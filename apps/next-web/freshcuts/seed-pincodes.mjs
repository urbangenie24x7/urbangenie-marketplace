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

const defaultPincodes = [
  { pincode: '500034', area: 'Banjara Hills', active: true },
  { pincode: '500033', area: 'Jubilee Hills', active: true },
  { pincode: '500081', area: 'HITEC City', active: true },
  { pincode: '500001', area: 'Abids', active: true },
  { pincode: '500016', area: 'Himayatnagar', active: true },
  { pincode: '500089', area: 'Gachibowli', active: true }
];

async function seedPincodes() {
  try {
    for (const pincodeData of defaultPincodes) {
      await addDoc(collection(db, 'serviceable_pincodes'), {
        ...pincodeData,
        created_at: serverTimestamp()
      });
      console.log(`Added pincode: ${pincodeData.pincode} - ${pincodeData.area}`);
    }
    console.log('Default pincodes seeded successfully!');
  } catch (error) {
    console.error('Error seeding pincodes:', error);
  }
}

seedPincodes();