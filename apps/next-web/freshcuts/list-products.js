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

async function listProducts() {
  try {
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    
    const productsSnap = await getDocs(collection(db, 'products'))
    
    console.log(`\n=== PRODUCTS IN DATABASE (${productsSnap.docs.length} total) ===\n`)
    
    productsSnap.docs.forEach((doc, index) => {
      const data = doc.data()
      console.log(`${index + 1}. ID: ${doc.id}`)
      console.log(`   Name: ${data.name || 'No name'}`)
      console.log(`   Category: ${data.category || 'No category'}`)
      console.log(`   Base Unit: ${data.baseUnit || data.unit || 'No unit'}`)
      console.log(`   Default Price: ₹${data.default_price || 'No price'}`)
      console.log(`   Description: ${data.description || 'No description'}`)
      console.log(`   Image: ${data.image_url ? 'Yes' : 'No'}`)
      console.log(`   Created: ${data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleDateString() : 'Unknown'}`)
      console.log('   ---')
    })
    
    if (productsSnap.docs.length === 0) {
      console.log('No products found in the database.')
    }
    
  } catch (error) {
    console.error('Error:', error.message)
  }
}

listProducts()