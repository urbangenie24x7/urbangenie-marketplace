const { initializeApp } = require('firebase/app')
const { getFirestore, collection, getDocs } = require('firebase/firestore')

const firebaseConfig = {
  apiKey: 'AIzaSyAR757jp5A9sKg45vqZckfwTCLSLC-PRGk',
  authDomain: 'freshcuts-5cb4c.firebaseapp.com',
  projectId: 'freshcuts-5cb4c',
  storageBucket: 'freshcuts-5cb4c.firebasestorage.app',
  messagingSenderId: '14592809171',
  appId: '1:14592809171:web:b618aa729d65385f3d1c26'
}

async function getBrandLogo() {
  try {
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    
    const brandSnap = await getDocs(collection(db, 'brandSettings'))
    if (brandSnap.docs.length > 0) {
      const brandData = brandSnap.docs[0].data()
      console.log('Brand Logo URL:', brandData.logo || 'No logo found')
      console.log('Logo Height:', brandData.logoHeight || 40)
    } else {
      console.log('No brand settings found')
    }
    
  } catch (error) {
    console.error('Error:', error.message)
  }
}

getBrandLogo()