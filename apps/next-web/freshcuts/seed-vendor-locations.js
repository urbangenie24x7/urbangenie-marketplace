const { initializeApp } = require('firebase/app')
const { getFirestore, collection, getDocs, updateDoc, doc } = require('firebase/firestore')

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'your-api-key-here',
  authDomain: 'freshcuts-5cb4c.firebaseapp.com',
  projectId: 'freshcuts-5cb4c',
  storageBucket: 'freshcuts-5cb4c.firebasestorage.app',
  messagingSenderId: '14592809171',
  appId: '1:14592809171:web:b618aa729d65385f3d1c26'
}

// Sample locations in Hyderabad - Hitech City and Khajaguda areas
const sampleLocations = [
  { lat: 17.4435, lng: 78.3772, area: 'Hitech City' },
  { lat: 17.4399, lng: 78.3908, area: 'Madhapur' },
  { lat: 17.4126, lng: 78.3667, area: 'Khajaguda' },
  { lat: 17.4183, lng: 78.3538, area: 'Manikonda' },
  { lat: 17.4239, lng: 78.3816, area: 'Kondapur' },
  { lat: 17.4020, lng: 78.3618, area: 'Narsingi' },
  { lat: 17.4304, lng: 78.4067, area: 'Gachibowli' },
  { lat: 17.4060, lng: 78.3380, area: 'Kokapet' }
]

async function seedVendorLocations() {
  try {
    console.log('🌍 Seeding vendor locations...')
    
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    
    // Get all vendors
    const vendorsSnap = await getDocs(collection(db, 'vendors'))
    const vendors = vendorsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    
    console.log(`Found ${vendors.length} vendors`)
    
    // Update each vendor with a random location
    for (let i = 0; i < vendors.length; i++) {
      const vendor = vendors[i]
      const location = sampleLocations[i % sampleLocations.length]
      
      // Add some random variation to coordinates (within ~2km radius)
      const randomLat = location.lat + (Math.random() - 0.5) * 0.02
      const randomLng = location.lng + (Math.random() - 0.5) * 0.02
      
      const vendorLocation = {
        lat: randomLat,
        lng: randomLng,
        area: location.area,
        address: `${vendor.name}, ${location.area}, Hyderabad`
      }
      
      await updateDoc(doc(db, 'vendors', vendor.id), {
        location: vendorLocation
      })
      
      console.log(`✅ Updated ${vendor.name} - ${location.area}`)
    }
    
    console.log('🎉 All vendor locations updated!')
    
  } catch (error) {
    console.error('❌ Error seeding locations:', error)
  }
}

seedVendorLocations()