import { collection, addDoc, getDocs, query, where } from 'firebase/firestore'
import { db } from './firebase'

export async function addVendorProducts() {
  try {
    console.log('Getting vendors and products from database...')
    
    // Get all vendors
    const vendorsSnap = await getDocs(collection(db, 'vendors'))
    const vendors = vendorsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    
    // Get all products
    const productsSnap = await getDocs(collection(db, 'products'))
    const products = productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    
    console.log(`Found ${vendors.length} vendors and ${products.length} products`)
    
    // Helper function to find product by name
    const findProduct = (name) => products.find(p => p.name === name)
    
    // Helper function to find vendor by name
    const findVendor = (name) => vendors.find(v => v.name === name)
    
    const vendorProductsData = [
      // Venkatesh Fresh Meats - Chicken & Mutton
      { vendorName: 'Venkatesh Fresh Meats', productName: 'Whole Chicken', price: 280 },
      { vendorName: 'Venkatesh Fresh Meats', productName: 'Chicken Breast (Boneless)', price: 320 },
      { vendorName: 'Venkatesh Fresh Meats', productName: 'Mutton Curry Cut', price: 650 },
      { vendorName: 'Venkatesh Fresh Meats', productName: 'Mutton Ribs', price: 720 },
      
      // Lakshmi Poultry & Fish - Chicken & Fish
      { vendorName: 'Lakshmi Poultry & Fish', productName: 'Whole Chicken', price: 270 },
      { vendorName: 'Lakshmi Poultry & Fish', productName: 'Chicken Breast (Boneless)', price: 310 },
      { vendorName: 'Lakshmi Poultry & Fish', productName: 'Rohu Fish', price: 280 },
      { vendorName: 'Lakshmi Poultry & Fish', productName: 'Farm Fresh Eggs', price: 110 },
      
      // Ravi Farm Fresh - Chicken & Country Chicken
      { vendorName: 'Ravi Farm Fresh', productName: 'Whole Chicken', price: 290 },
      { vendorName: 'Ravi Farm Fresh', productName: 'Country Chicken (Whole)', price: 420 },
      { vendorName: 'Ravi Farm Fresh', productName: 'Farm Fresh Eggs', price: 115 },
      
      // Srinivas Fish Market - Fish & Seafood
      { vendorName: 'Srinivas Fish Market', productName: 'Rohu Fish', price: 300 },
      { vendorName: 'Srinivas Fish Market', productName: 'Fresh Prawns', price: 750 },
      { vendorName: 'Srinivas Fish Market', productName: 'Live Mud Crabs', price: 900 }
    ]
    
    console.log('Adding vendor products...')
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
        console.log(`Added ${product.name} for ${vendor.name}`)
        addedCount++
      } else {
        console.log(`Skipped: ${item.vendorName} - ${item.productName} (not found)`)
      }
    }
    
    console.log(`Successfully added ${addedCount} vendor products!`)
    return true
  } catch (error) {
    console.error('Error adding vendor products:', error)
    return false
  }
}