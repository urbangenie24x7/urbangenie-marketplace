import { db } from './firebase'
import { collection, getDocs, addDoc, query, where, serverTimestamp } from 'firebase/firestore'

export async function createVendorUsers() {
  try {
    // Get all existing vendors
    const vendorsSnap = await getDocs(collection(db, 'vendors'))
    const vendors = vendorsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    
    if (vendors.length === 0) {
      return { success: false, message: 'No vendors found in database' }
    }

    // Check existing users to avoid duplicates
    const usersSnap = await getDocs(collection(db, 'users'))
    const existingPhones = usersSnap.docs.map(doc => doc.data().phone)

    let created = 0
    const userAccounts = []

    // Track used names and phones to ensure uniqueness
    const usedNames = new Set()
    const usedPhones = new Set(existingPhones)
    
    for (let i = 0; i < vendors.length; i++) {
      const vendor = vendors[i]
      
      // Generate unique vendor name
      let vendorName = vendor.name
      let nameCounter = 1
      while (usedNames.has(vendorName)) {
        vendorName = `${vendor.name} ${nameCounter}`
        nameCounter++
      }
      usedNames.add(vendorName)
      
      // Generate unique phone number
      let phone = vendor.phone
      if (!phone || usedPhones.has(phone)) {
        // Generate unique phone starting from +919876543211
        let phoneCounter = 3211 + i
        do {
          phone = `+91987654${String(phoneCounter).padStart(4, '0')}`
          phoneCounter++
        } while (usedPhones.has(phone))
      }
      usedPhones.add(phone)
      
      const email = vendor.email || `${vendorName.toLowerCase().replace(/\s+/g, '')}@freshcuts.com`
      
      const userData = {
        name: vendorName,
        phone: phone,
        email: email,
        role: 'vendor',
        shopName: vendorName,
        verticals: ['freshcuts'],
        createdAt: serverTimestamp()
      }
      
      await addDoc(collection(db, 'users'), userData)
      userAccounts.push({ 
        phone: phone,
        email: email,
        name: vendorName 
      })
      created++
    }

    // Also create admin accounts if they don't exist
    const adminAccounts = [
      {
        name: 'Super Admin',
        phone: '+919876543210',
        email: 'admin@freshcuts.com',
        role: 'super_admin',
        verticals: ['food', 'grocery', 'freshcuts', 'health', 'services']
      },
      {
        name: 'FreshCuts Admin',
        phone: '+919876543212',
        email: 'vertical@freshcuts.com',
        role: 'admin',
        verticals: ['freshcuts']
      }
    ]

    for (const admin of adminAccounts) {
      if (!existingPhones.includes(admin.phone)) {
        await addDoc(collection(db, 'users'), {
          ...admin,
          createdAt: serverTimestamp()
        })
        userAccounts.push({ 
          phone: admin.phone,
          email: admin.email,
          name: admin.name 
        })
        created++
      }
    }

    return { 
      success: true, 
      message: `Created ${created} user accounts with phone authentication`, 
      accounts: userAccounts 
    }
    
  } catch (error) {
    console.error('Error creating vendor users:', error)
    return { success: false, message: 'Error: ' + error.message }
  }
}