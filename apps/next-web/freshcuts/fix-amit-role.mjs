import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAR757jp5A9sKg45vqZckfwTCLSLC-PRGk",
  authDomain: "freshcuts-5cb4c.firebaseapp.com",
  projectId: "freshcuts-5cb4c",
  storageBucket: "freshcuts-5cb4c.appspot.com",
  messagingSenderId: "14592809171",
  appId: "1:14592809171:web:abc123def456"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fixAmitRole() {
  try {
    const q = query(collection(db, 'users'), where('name', '==', 'Amit Patel'));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('Amit Patel not found in database');
      return;
    }
    
    querySnapshot.forEach(async (docSnapshot) => {
      const userData = docSnapshot.data();
      console.log('Found Amit Patel:', userData);
      
      if (!userData.role) {
        await updateDoc(doc(db, 'users', docSnapshot.id), {
          role: 'customer'
        });
        console.log('Updated Amit Patel role to customer');
      } else {
        console.log('Amit Patel already has role:', userData.role);
      }
    });
  } catch (error) {
    console.error('Error fixing Amit role:', error);
  }
}

fixAmitRole();