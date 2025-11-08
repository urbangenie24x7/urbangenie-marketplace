import { db } from './firebase'
import { collection, getDocs, deleteDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore'

export async function resetVendorDatabase() {
  try {
    // Delete all vendor users
    const usersSnap = await getDocs(collection(db, 'users'))
    const vendorUsers = usersSnap.docs.filter(doc => doc.data().role === 'vendor')
    
    for (const user of vendorUsers) {
      await deleteDoc(doc(db, 'users', user.id))
    }

    // Delete all vendors
    const vendorsSnap = await getDocs(collection(db, 'vendors'))
    for (const vendor of vendorsSnap.docs) {
      await deleteDoc(doc(db, 'vendors', vendor.id))
    }

    // Delete all vendor products
    const vendorProductsSnap = await getDocs(collection(db, 'vendorProducts'))
    for (const vp of vendorProductsSnap.docs) {
      await deleteDoc(doc(db, 'vendorProducts', vp.id))
    }

    // Create fresh vendors with unique names and phone numbers
    const vendors = [
      { 
        name: 'Venkatesh Fresh Meats', 
        phone: '+919876543211',
        email: 'venkatesh@freshcuts.com',
        location: { lat: -1.2921, lng: 36.8219 }, 
        products: ['chicken', 'mutton'] 
      },
      { 
        name: 'Lakshmi Poultry & Fish', 
        phone: '+919876543212',
        email: 'lakshmi@freshcuts.com',
        location: { lat: -1.2901, lng: 36.8199 }, 
        products: ['chicken', 'fish', 'eggs'] 
      },
      { 
        name: 'Ravi Farm Fresh', 
        phone: '+919876543213',
        email: 'ravi@freshcuts.com',
        location: { lat: -1.2941, lng: 36.8239 }, 
        products: ['chicken', 'country-chicken', 'eggs'] 
      },
      { 
        name: 'Srinivas Fish Market', 
        phone: '+919876543214',
        email: 'srinivas@freshcuts.com',
        location: { lat: -1.2911, lng: 36.8209 }, 
        products: ['fish', 'prawns', 'crabs'] 
      }
    ]

    const vendorIds = []
    
    // Create vendors
    for (const vendor of vendors) {
      const docRef = await addDoc(collection(db, 'vendors'), {
        ...vendor,
        createdAt: serverTimestamp()
      })
      vendorIds.push({ id: docRef.id, ...vendor })
    }

    // Create vendor user accounts
    for (const vendor of vendors) {
      await addDoc(collection(db, 'users'), {
        name: vendor.name,
        phone: vendor.phone,
        email: vendor.email,
        role: 'vendor',
        shopName: vendor.name,
        verticals: ['freshcuts'],
        createdAt: serverTimestamp()
      })
    }

    return {
      success: true,
      message: `Vendor database reset successfully!\n\nCreated ${vendors.length} vendors:\n${vendors.map(v => `${v.name}: ${v.phone}`).join('\n')}`,
      vendors: vendors
    }
    
  } catch (error) {
    console.error('Error resetting vendor database:', error)
    return { success: false, message: 'Error: ' + error.message }
  }
}