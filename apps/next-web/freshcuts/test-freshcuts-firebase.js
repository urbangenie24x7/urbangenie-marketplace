const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyAR757jp5A9sKg45vqZckfwTCLSLC-PRGk",
  authDomain: "freshcuts-5cb4c.firebaseapp.com",
  projectId: "freshcuts-5cb4c",
  storageBucket: "freshcuts-5cb4c.firebasestorage.app",
  messagingSenderId: "14592809171",
  appId: "1:14592809171:web:b618aa729d65385f3d1c26"
};

async function testFreshCutsConnection() {
  try {
    console.log('🥩 Testing FreshCuts Firebase connection...');
    console.log('Project ID:', firebaseConfig.projectId);
    
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    const collections = ['categoryCards', 'vendors', 'products', 'users', 'bannerAds', 'orders'];
    
    for (const collectionName of collections) {
      try {
        const snapshot = await getDocs(collection(db, collectionName));
        console.log(`✅ ${collectionName}: ${snapshot.size} documents`);
      } catch (error) {
        console.log(`❌ ${collectionName}: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ FreshCuts Firebase connection failed:', error.message);
  }
}

testFreshCutsConnection();