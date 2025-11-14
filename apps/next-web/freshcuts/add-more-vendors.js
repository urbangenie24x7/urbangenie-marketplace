const { initializeApp } = require('firebase/app')
const { getFirestore, collection, addDoc } = require('firebase/firestore')

const firebaseConfig = {
  apiKey: 'AIzaSyAR757jp5A9sKg45vqZckfwTCLSLC-PRGk',
  authDomain: 'freshcuts-5cb4c.firebaseapp.com',
  projectId: 'freshcuts-5cb4c',
  storageBucket: 'freshcuts-5cb4c.firebasestorage.app',
  messagingSenderId: '14592809171',
  appId: '1:14592809171:web:b618aa729d65385f3d1c26'
}

// More vendors focused on Jubilee Hills and Manikonda areas
const newVendors = [
  // Jubilee Hills vendors
  {
    name: "Jubilee Hills Premium Meats",
    products: ["chicken", "mutton", "fish"],
    location: { lat: 17.4251, lng: 78.4065, area: "Jubilee Hills", address: "Jubilee Hills Premium Meats, Road No 36, Jubilee Hills, Hyderabad" },
    phone: "9876543210",
    rating: 4.6,
    available: true
  },
  {
    name: "Fresh Catch Jubilee",
    products: ["fish", "prawns", "crabs"],
    location: { lat: 17.4289, lng: 78.4123, area: "Jubilee Hills", address: "Fresh Catch Jubilee, Road No 45, Jubilee Hills, Hyderabad" },
    phone: "9876543211",
    rating: 4.4,
    available: true
  },
  {
    name: "Jubilee Poultry Express",
    products: ["chicken", "country-chicken"],
    location: { lat: 17.4198, lng: 78.4089, area: "Jubilee Hills", address: "Jubilee Poultry Express, Road No 32, Jubilee Hills, Hyderabad" },
    phone: "9876543212",
    rating: 4.3,
    available: true
  },
  {
    name: "Hills Mutton Corner",
    products: ["mutton", "country-chicken"],
    location: { lat: 17.4267, lng: 78.4156, area: "Jubilee Hills", address: "Hills Mutton Corner, Road No 92, Jubilee Hills, Hyderabad" },
    phone: "9876543213",
    rating: 4.5,
    available: true
  },
  
  // Manikonda vendors
  {
    name: "Manikonda Fresh Mart",
    products: ["chicken", "mutton", "fish"],
    location: { lat: 17.4183, lng: 78.3538, area: "Manikonda", address: "Manikonda Fresh Mart, Manikonda Village, Hyderabad" },
    phone: "9876543214",
    rating: 4.2,
    available: true
  },
  {
    name: "Village Chicken Manikonda",
    products: ["country-chicken", "chicken"],
    location: { lat: 17.4156, lng: 78.3567, area: "Manikonda", address: "Village Chicken Manikonda, Manikonda Main Road, Hyderabad" },
    phone: "9876543215",
    rating: 4.4,
    available: true
  },
  {
    name: "Manikonda Seafood Hub",
    products: ["fish", "prawns"],
    location: { lat: 17.4201, lng: 78.3512, area: "Manikonda", address: "Manikonda Seafood Hub, Near Manikonda Junction, Hyderabad" },
    phone: "9876543216",
    rating: 4.1,
    available: true
  },
  {
    name: "Royal Mutton Manikonda",
    products: ["mutton", "chicken"],
    location: { lat: 17.4167, lng: 78.3589, area: "Manikonda", address: "Royal Mutton Manikonda, Manikonda Cross Roads, Hyderabad" },
    phone: "9876543217",
    rating: 4.3,
    available: true
  },
  {
    name: "Fresh Farm Manikonda",
    products: ["chicken", "country-chicken", "fish"],
    location: { lat: 17.4145, lng: 78.3523, area: "Manikonda", address: "Fresh Farm Manikonda, Manikonda Bus Stop, Hyderabad" },
    phone: "9876543218",
    rating: 4.0,
    available: true
  },
  {
    name: "Manikonda Meat Palace",
    products: ["mutton", "chicken", "prawns"],
    location: { lat: 17.4189, lng: 78.3556, area: "Manikonda", address: "Manikonda Meat Palace, Manikonda Market, Hyderabad" },
    phone: "9876543219",
    rating: 4.2,
    available: true
  }
]

async function addMoreVendors() {
  try {
    console.log('🥩 Adding more vendors across Hyderabad...')
    
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    
    for (const vendor of newVendors) {
      await addDoc(collection(db, 'vendors'), {
        ...vendor,
        createdAt: new Date(),
        verified: true
      })
      
      console.log(`✅ Added ${vendor.name} - ${vendor.location.area}`)
    }
    
    console.log(`🎉 Successfully added ${newVendors.length} new vendors!`)
    
  } catch (error) {
    console.error('❌ Error adding vendors:', error)
  }
}

addMoreVendors()