import { useState, useEffect } from 'react';
import { 
  signInWithPhoneNumber, 
  RecaptchaVerifier, 
  ConfirmationResult,
  onAuthStateChanged,
  User,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, query, where, collection, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { sanitizeForLog } from '@/shared/utils/validation';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          console.log('reCAPTCHA solved');
        }
      });
    }
  };

  const sendOTP = async (phoneNumber: string) => {
    try {
      setupRecaptcha();
      const formattedPhone = `+91${phoneNumber}`;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
      setConfirmationResult(confirmation);
      return { success: true };
    } catch (error: any) {
      console.error('Error sending OTP:', error.message);
      return { success: false, error: error.message };
    }
  };

  const verifyOTP = async (otp: string, phoneNumber: string) => {
    if (!confirmationResult) {
      return { success: false, error: 'No confirmation result found' };
    }

    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;

      // Create/update user profile in Firestore
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        await setDoc(userRef, {
          phone: `+91${phoneNumber}`,
          created_at: new Date(),
          updated_at: new Date(),
          addresses: []
        });
      }

      return { success: true, user };
    } catch (error: any) {
      console.error('Error verifying OTP:', error.message);
      return { success: false, error: error.message };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Create/update user profile in Firestore
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        await setDoc(userRef, {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          provider: 'google',
          created_at: new Date(),
          updated_at: new Date(),
          addresses: []
        });
      }

      return { success: true, user };
    } catch (error: any) {
      console.error('Error with Google sign-in:', error.message);
      return { success: false, error: error.message };
    }
  };

  const signInWithCredentials = async (usernameOrEmail: string, password: string) => {
    try {
      let email = usernameOrEmail;
      
      // If username provided instead of email, look up email in Firestore
      if (!usernameOrEmail.includes('@')) {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('username', '==', usernameOrEmail));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();
          email = userData.email || `${usernameOrEmail}@urbangenie.com`;
        } else {
          return { success: false, error: 'Username not found' };
        }
      }
      
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

      return { success: true, user };
    } catch (error: any) {
      console.error('Error with credentials sign-in:', error.message);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      console.log('User signed out');
    } catch (error: any) {
      console.error('Error signing out:', error.message);
    }
  };

  const registerWithEmail = async (email: string, password: string, displayName: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;

      // Update user profile
      await updateProfile(user, { displayName });

      // Create user profile in Firestore
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        email: user.email,
        displayName,
        provider: 'email',
        created_at: new Date(),
        updated_at: new Date(),
        addresses: []
      });

      return { success: true, user };
    } catch (error: any) {
      console.error('Error registering user:', error.message);
      return { success: false, error: error.message };
    }
  };

  return {
    user,
    loading,
    sendOTP,
    verifyOTP,
    signInWithGoogle,
    signInWithCredentials,
    registerWithEmail,
    logout
  };
};