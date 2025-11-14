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

async function testFirebaseConnection() {
  try {
    console.log('Initializing Firebase...');
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    console.log('Testing database connection...');
    const testCollection = collection(db, 'categoryCards');
    const snapshot = await getDocs(testCollection);
    
    console.log('✅ Firebase connection successful!');
    console.log(`Found ${snapshot.size} documents in categoryCards collection`);
    
    snapshot.forEach((doc) => {
      console.log(`- ${doc.id}:`, doc.data());
    });
    
  } catch (error) {
    console.error('❌ Firebase connection failed:', error.message);
    console.error('Error code:', error.code);
  }
}

testFirebaseConnection();