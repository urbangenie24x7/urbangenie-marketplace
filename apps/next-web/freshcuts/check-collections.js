const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: 'AIzaSyAQtrV9q2mi4tuoKkPbtDZlgjuvLQWSHD8',
  authDomain: 'urbangenie24x7.firebaseapp.com',
  projectId: 'urbangenie24x7',
  storageBucket: 'urbangenie24x7.appspot.com',
  messagingSenderId: '371106212419',
  appId: '1:371106212419:web:urbangenie-web-app'
};

async function checkCollections() {
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    const collections = ['categoryCards', 'vendors', 'products', 'users', 'bannerAds'];
    
    for (const collectionName of collections) {
      const snapshot = await getDocs(collection(db, collectionName));
      console.log(`${collectionName}: ${snapshot.size} documents`);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkCollections();