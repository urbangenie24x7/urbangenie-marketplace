require('dotenv').config({ path: '.env.local' })
const { initializeApp } = require('firebase/app')
const { getFirestore, collection, getDocs } = require('firebase/firestore')

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

async function testFirebaseConnection() {
  try {
    console.log('🔥 Testing Firebase connection...')
    console.log('Project ID:', firebaseConfig.projectId)
    console.log('Auth Domain:', firebaseConfig.authDomain)
    
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    
    console.log('✅ Firebase initialized successfully')
    
    // Test a simple read operation
    const testCollection = collection(db, 'vendors')
    const snapshot = await getDocs(testCollection)
    
    console.log('✅ Firestore connection successful')
    console.log(`Found ${snapshot.size} vendors`)
    
  } catch (error) {
    console.error('❌ Firebase connection failed:', error.message)
    console.error('Error code:', error.code)
  }
}

testFirebaseConnection()