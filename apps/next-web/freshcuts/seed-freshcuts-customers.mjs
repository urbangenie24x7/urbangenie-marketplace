import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

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

const freshcutsCustomers = [
  {
    phone: "+919876543210",
    name: "Rajesh Kumar",
    email: "rajesh@freshcuts.com",
    role: "customer",
    addresses: [{
      type: "Home",
      address: "123 MG Road, Banjara Hills",
      city: "Hyderabad",
      pincode: "500034",
      is_default: true
    }]
  },
  {
    phone: "+919876543211", 
    name: "Priya Sharma",
    email: "priya@freshcuts.com",
    role: "customer",
    addresses: [{
      type: "Home",
      address: "456 Jubilee Hills",
      city: "Hyderabad", 
      pincode: "500033",
      is_default: true
    }]
  },
  {
    phone: "+919876543212",
    name: "Amit Patel", 
    email: "amit@freshcuts.com",
    role: "customer",
    addresses: [{
      type: "Office",
      address: "789 HITEC City",
      city: "Hyderabad",
      pincode: "500081", 
      is_default: true
    }]
  }
];

async function seedFreshCutsCustomers() {
  try {
    for (const customer of freshcutsCustomers) {
      await addDoc(collection(db, 'users'), {
        ...customer,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });
      console.log(`Added FreshCuts customer: ${customer.name}`);
    }
    console.log('FreshCuts customers added successfully!');
  } catch (error) {
    console.error('Error adding FreshCuts customers:', error);
  }
}

seedFreshCutsCustomers();