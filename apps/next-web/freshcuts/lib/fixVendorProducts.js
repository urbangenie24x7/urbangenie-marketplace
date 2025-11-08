import { collection, getDocs, deleteDoc, doc, addDoc } from 'firebase/firestore'
import { db } from './firebase'

export async function fixVendorProducts() {
  try {
    console.log('Fixing vendor-product associations...')
    
    // Get current vendors and products
    const vendorsSnap = await getDocs(collection(db, 'vendors'))
    const vendors = vendorsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    
    const productsSnap = await getDocs(collection(db, 'products'))
    const products = productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    
    console.log('Current vendors:', vendors.map(v => v.name))
    console.log('Current products:', products.map(p => p.name))
    
    // Clear existing vendor products
    const vendorProductsSnap = await getDocs(collection(db, 'vendorProducts'))
    for (const docSnap of vendorProductsSnap.docs) {
      await deleteDoc(doc(db, 'vendorProducts', docSnap.id))
    }
    console.log('Cleared existing vendor products')
    
    // Helper functions
    const findVendor = (name) => vendors.find(v => v.name === name)
    const findProduct = (name) => products.find(p => p.name === name)
    
    // Re-create vendor-product associations with current product IDs
    const vendorProductsData = [
      // Lakshmi Poultry & Fish
      { vendorName: 'Lakshmi Poultry & Fish', productName: 'Whole Chicken', price: 270 },
      { vendorName: 'Lakshmi Poultry & Fish', productName: 'Chicken Breast (Boneless)', price: 310 },
      { vendorName: 'Lakshmi Poultry & Fish', productName: 'Rohu Fish', price: 280 },
      { vendorName: 'Lakshmi Poultry & Fish', productName: 'Farm Fresh Eggs', price: 110 },
      
      // Other vendors
      { vendorName: 'Venkatesh Fresh Meats', productName: 'Whole Chicken', price: 280 },
      { vendorName: 'Venkatesh Fresh Meats', productName: 'Chicken Breast (Boneless)', price: 320 },
      { vendorName: 'Venkatesh Fresh Meats', productName: 'Mutton Curry Cut', price: 650 },
      
      { vendorName: 'Ravi Farm Fresh', productName: 'Whole Chicken', price: 290 },
      { vendorName: 'Ravi Farm Fresh', productName: 'Country Chicken (Whole)', price: 420 },
      { vendorName: 'Ravi Farm Fresh', productName: 'Farm Fresh Eggs', price: 115 },
      
      { vendorName: 'Srinivas Fish Market', productName: 'Rohu Fish', price: 300 },
      { vendorName: 'Srinivas Fish Market', productName: 'Fresh Prawns', price: 750 },
      { vendorName: 'Srinivas Fish Market', productName: 'Live Mud Crabs', price: 900 }
    ]
    
    let addedCount = 0
    for (const item of vendorProductsData) {
      const vendor = findVendor(item.vendorName)
      const product = findProduct(item.productName)
      
      if (vendor && product) {
        await addDoc(collection(db, 'vendorProducts'), {
          vendorId: vendor.id,
          productId: product.id,
          price: item.price,
          available: true,
          deliveryTime: '2-3 hours',
          deliveryCharges: 0,
          freeDelivery: true
        })
        console.log(`✓ Added ${product.name} for ${vendor.name}`)
        addedCount++
      } else {
        console.log(`✗ Skipped: ${item.vendorName} - ${item.productName} (vendor: ${!!vendor}, product: ${!!product})`)
      }
    }
    
    console.log(`Successfully fixed ${addedCount} vendor-product associations!`)
    return true
  } catch (error) {
    console.error('Error fixing vendor products:', error)
    return false
  }
}