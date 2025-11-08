import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  query, 
  where,
  onSnapshot 
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { Service } from '@/lib/firestore';
import { sanitizeForLog } from '@/shared/utils/validation';

interface CartItem {
  id: string;
  service_id: string;
  quantity: number;
  service?: Service;
}

export const useFirebaseCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        subscribeToCart(user.uid);
      } else {
        loadGuestCart();
      }
    });

    return unsubscribe;
  }, []);

  const subscribeToCart = (userId: string) => {
    const cartRef = collection(db, 'users', userId, 'cart');
    
    return onSnapshot(cartRef, async (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CartItem[];

      // Fetch service details for each item
      const itemsWithServices = await Promise.all(
        items.map(async (item) => {
          const serviceDoc = await getDoc(doc(db, 'services', item.service_id));
          return {
            ...item,
            service: serviceDoc.exists() ? { id: serviceDoc.id, ...serviceDoc.data() } as Service : undefined
          };
        })
      );

      setCartItems(itemsWithServices);
      setLoading(false);
    });
  };

  const loadGuestCart = () => {
    try {
      const guestCart = JSON.parse(localStorage.getItem('firebase_cart') || '[]');
      setCartItems(guestCart);
      setLoading(false);
    } catch (error) {
      console.error('Error loading guest cart:', error);
      setCartItems([]);
      setLoading(false);
    }
  };

  const addToCart = async (serviceId: string, quantity: number = 1) => {
    try {
      const sanitizedServiceId = sanitizeForLog(serviceId);
      console.log('Adding to cart, service ID:', sanitizedServiceId);

      if (user) {
        // Authenticated user - save to Firestore
        const cartItemRef = doc(db, 'users', user.uid, 'cart', serviceId);
        const existingItem = await getDoc(cartItemRef);

        if (existingItem.exists()) {
          await setDoc(cartItemRef, {
            service_id: serviceId,
            quantity: existingItem.data().quantity + quantity,
            updated_at: new Date()
          });
        } else {
          await setDoc(cartItemRef, {
            service_id: serviceId,
            quantity,
            created_at: new Date(),
            updated_at: new Date()
          });
        }
      } else {
        // Guest user - save to localStorage
        const guestCart = JSON.parse(localStorage.getItem('firebase_cart') || '[]');
        const existingItemIndex = guestCart.findIndex((item: CartItem) => item.service_id === serviceId);

        if (existingItemIndex >= 0) {
          guestCart[existingItemIndex].quantity += quantity;
        } else {
          guestCart.push({
            id: Date.now().toString(),
            service_id: serviceId,
            quantity
          });
        }

        localStorage.setItem('firebase_cart', JSON.stringify(guestCart));
        loadGuestCart();
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(itemId);
        return;
      }

      if (user) {
        const cartItemRef = doc(db, 'users', user.uid, 'cart', itemId);
        await setDoc(cartItemRef, {
          service_id: itemId,
          quantity,
          updated_at: new Date()
        }, { merge: true });
      } else {
        const guestCart = JSON.parse(localStorage.getItem('firebase_cart') || '[]');
        const itemIndex = guestCart.findIndex((item: CartItem) => item.id === itemId);
        
        if (itemIndex >= 0) {
          guestCart[itemIndex].quantity = quantity;
          localStorage.setItem('firebase_cart', JSON.stringify(guestCart));
          loadGuestCart();
        }
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      if (user) {
        const cartItemRef = doc(db, 'users', user.uid, 'cart', itemId);
        await deleteDoc(cartItemRef);
      } else {
        const guestCart = JSON.parse(localStorage.getItem('firebase_cart') || '[]');
        const updatedCart = guestCart.filter((item: CartItem) => item.id !== itemId);
        localStorage.setItem('firebase_cart', JSON.stringify(updatedCart));
        loadGuestCart();
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      if (user) {
        const cartRef = collection(db, 'users', user.uid, 'cart');
        const snapshot = await getDocs(cartRef);
        
        const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
      } else {
        localStorage.removeItem('firebase_cart');
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  };

  const subtotal = cartItems.reduce((sum, item) => 
    sum + (item.service?.price || 0) * item.quantity, 0
  );

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cartItems,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    itemCount
  };
};