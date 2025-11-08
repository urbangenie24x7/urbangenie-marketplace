import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

// Types
export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  image_url: string;
  rating: number;
  total_reviews: number;
  category_id: string;
  category: string;
  subcategory: string;
  service_type: 'platform' | 'vendor_product';
  is_active: boolean;
  created_at: Timestamp;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  gradient: string;
  is_active: boolean;
  created_at: Timestamp;
}

export interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at: Timestamp;
}

export interface User {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  addresses: Address[];
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface Address {
  id: string;
  type: string;
  address: string;
  city: string;
  pincode: string;
  is_default: boolean;
}

export interface CartItem {
  id: string;
  user_id: string;
  service_id: string;
  quantity: number;
  created_at: Timestamp;
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  total_amount: number;
  service_fee: number;
  status: string;
  scheduled_date: string;
  scheduled_time: string;
  address: Address;
  payment_method: string;
  payment_status: string;
  items: OrderItem[];
  assigned_vendor_id?: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface OrderItem {
  service_id: string;
  quantity: number;
  price: number;
}

export interface Vendor {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  rating: number;
  total_reviews: number;
  total_orders: number;
  is_active: boolean;
  verification_status: 'pending' | 'approved' | 'rejected';
  business_type: 'individual' | 'shop' | 'company';
  skills: string[];
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface Review {
  id: string;
  user_id: string;
  service_id: string;
  order_id: string;
  rating: number;
  comment: string;
  created_at: Timestamp;
}

// Collection references
export const collections = {
  users: collection(db, 'users'),
  services: collection(db, 'services'),
  categories: collection(db, 'categories'),
  subcategories: collection(db, 'subcategories'),
  orders: collection(db, 'orders'),
  vendors: collection(db, 'vendors'),
  reviews: collection(db, 'reviews'),
};

// Helper functions
export const createDocument = async (collectionName: string, data: any) => {
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp()
  });
  return docRef.id;
};

export const updateDocument = async (collectionName: string, docId: string, data: any) => {
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, {
    ...data,
    updated_at: serverTimestamp()
  });
};

export const deleteDocument = async (collectionName: string, docId: string) => {
  const docRef = doc(db, collectionName, docId);
  await deleteDoc(docRef);
};

export const getDocument = async (collectionName: string, docId: string) => {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

export const getCollection = async (collectionName: string, constraints: any[] = []) => {
  const q = query(collection(db, collectionName), ...constraints);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const subscribeToDocument = (collectionName: string, docId: string, callback: (data: any) => void) => {
  const docRef = doc(db, collectionName, docId);
  return onSnapshot(docRef, (doc) => {
    callback(doc.exists() ? { id: doc.id, ...doc.data() } : null);
  });
};

export const subscribeToCollection = (collectionName: string, callback: (data: any[]) => void, constraints: any[] = []) => {
  const q = query(collection(db, collectionName), ...constraints);
  return onSnapshot(q, (querySnapshot) => {
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(data);
  });
};