const { initializeApp } = require('firebase/app')
const { getFirestore, collection, getDocs, query, where } = require('firebase/firestore')

const firebaseConfig = {
  apiKey: "AIzaSyAR757jp5A9sKg45vqZckfwTCLSLC-PRGk",
  authDomain: "freshcuts-5cb4c.firebaseapp.com",
  projectId: "freshcuts-5cb4c",
  storageBucket: "freshcuts-5cb4c.firebasestorage.app",
  messagingSenderId: "14592809171",
  appId: "1:14592809171:web:b618aa729d65385f3d1c26"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function checkVendorDeliverySettings() {
  try {
    console.log('🔍 Checking delivery settings for vendors...\n')
    
    // Get all vendors
    const vendorsSnap = await getDocs(collection(db, 'vendors'))
    const vendors = vendorsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    
    // Find specific vendors
    const venkatesh = vendors.find(v => v.name?.includes('Venkatesh'))
    const dilsukhnagar = vendors.find(v => v.name?.includes('Dilsukhnagar'))
    
    console.log('📋 VENDORS FOUND:')
    if (venkatesh) {
      console.log(`✅ ${venkatesh.name} (ID: ${venkatesh.id})`)
    } else {
      console.log('❌ Venkatesh Fresh Meats not found')
    }
    
    if (dilsukhnagar) {
      console.log(`✅ ${dilsukhnagar.name} (ID: ${dilsukhnagar.id})`)
    } else {
      console.log('❌ Dilsukhnagar Fresh Meats not found')
    }
    
    console.log('\n🚚 DELIVERY SETTINGS:')
    
    // Check delivery settings for each vendor
    const deliverySnap = await getDocs(collection(db, 'vendorDeliverySettings'))
    const deliverySettings = deliverySnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    
    if (venkatesh) {
      const venkateshDelivery = deliverySettings.find(d => d.vendorId === venkatesh.id)
      console.log(`\n📦 ${venkatesh.name}:`)
      if (venkateshDelivery) {
        console.log('   Settings:', JSON.stringify(venkateshDelivery.settings, null, 2))
      } else {
        console.log('   ❌ No delivery settings configured (using defaults)')
        console.log('   Default: Pickup (FREE), Delivery (₹35, FREE above ₹500), Express (₹75, FREE above ₹1000)')
      }
    }
    
    if (dilsukhnagar) {
      const dilsukhnagarDelivery = deliverySettings.find(d => d.vendorId === dilsukhnagar.id)
      console.log(`\n📦 ${dilsukhnagar.name}:`)
      if (dilsukhnagarDelivery) {
        console.log('   Settings:', JSON.stringify(dilsukhnagarDelivery.settings, null, 2))
      } else {
        console.log('   ❌ No delivery settings configured (using defaults)')
        console.log('   Default: Pickup (FREE), Delivery (₹35, FREE above ₹500), Express (₹75, FREE above ₹1000)')
      }
    }
    
    console.log('\n📊 ALL VENDOR DELIVERY SETTINGS:')
    deliverySettings.forEach(setting => {
      const vendor = vendors.find(v => v.id === setting.vendorId)
      console.log(`\n🏪 ${vendor?.name || 'Unknown Vendor'} (${setting.vendorId}):`)
      console.log('   Settings:', JSON.stringify(setting.settings, null, 2))
    })
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

checkVendorDeliverySettings()