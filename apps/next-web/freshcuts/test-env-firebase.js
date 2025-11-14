require('dotenv').config({ path: '.env.local' });
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

async function testConnection() {
  try {
    console.log('Testing Firebase with environment variables...');
    console.log('Project ID:', firebaseConfig.projectId);
    
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    const collections = ['categoryCards', 'vendors', 'products', 'users', 'bannerAds', 'orders'];
    
    for (const collectionName of collections) {
      try {
        const snapshot = await getDocs(collection(db, collectionName));
        console.log(`✅ ${collectionName}: ${snapshot.size} documents`);
        
        if (snapshot.size > 0 && snapshot.size <= 3) {
          snapshot.forEach((doc) => {
            console.log(`  - ${doc.id}`);
          });
        }
      } catch (error) {
        console.log(`❌ ${collectionName}: Error - ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Firebase connection failed:', error.message);
  }
}

testConnection();