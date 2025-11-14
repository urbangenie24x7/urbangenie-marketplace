const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "demo-key",
  authDomain: "urbangenie-demo.firebaseapp.com",
  projectId: "urbangenie-demo",
  storageBucket: "urbangenie-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const customers = [
  {
    phone: "+919876543210",
    name: "Rajesh Kumar",
    email: "rajesh@example.com",
    addresses: [{
      id: "addr1",
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
    email: "priya@example.com",
    addresses: [{
      id: "addr2",
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
    email: "amit@example.com",
    addresses: [{
      id: "addr3",
      type: "Office",
      address: "789 HITEC City",
      city: "Hyderabad",
      pincode: "500081",
      is_default: true
    }]
  }
];

async function seedCustomers() {
  try {
    for (const customer of customers) {
      await addDoc(collection(db, 'users'), {
        ...customer,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });
      console.log(`Added customer: ${customer.name}`);
    }
    console.log('All customers added successfully!');
  } catch (error) {
    console.error('Error adding customers:', error);
  }
}

seedCustomers();