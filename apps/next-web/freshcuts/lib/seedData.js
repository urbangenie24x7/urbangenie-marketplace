import { db } from './firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

export async function seedTestData() {
  try {
    // Add products with variations
    const products = [
      // CHICKEN CATEGORY
      { 
        name: 'Whole Chicken', 
        category: 'chicken', 
        unit: 'kg', 
        default_price: 500, 
        image_url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop', 
        available: true,
        variations: [
          { weight: 250, priceMultiplier: 0.25 },
          { weight: 500, priceMultiplier: 0.5 },
          { weight: 1000, priceMultiplier: 1.0 },
          { weight: 1500, priceMultiplier: 1.45 },
          { weight: 2000, priceMultiplier: 1.9 }
        ]
      },
      { 
        name: 'Chicken Breast (Boneless)', 
        category: 'chicken', 
        unit: 'kg', 
        default_price: 650, 
        image_url: 'https://images.unsplash.com/photo-1606728035253-49e8a23146de?w=400&h=300&fit=crop', 
        available: true,
        variations: [
          { weight: 250, priceMultiplier: 0.25 },
          { weight: 500, priceMultiplier: 0.5 },
          { weight: 1000, priceMultiplier: 1.0 }
        ]
      },
      { 
        name: 'Chicken Thighs', 
        category: 'chicken', 
        unit: 'kg', 
        default_price: 480, 
        image_url: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop', 
        available: true,
        variations: [
          { weight: 250, priceMultiplier: 0.25 },
          { weight: 500, priceMultiplier: 0.5 },
          { weight: 1000, priceMultiplier: 1.0 }
        ]
      },
      { 
        name: 'Chicken Wings', 
        category: 'chicken', 
        unit: 'kg', 
        default_price: 420, 
        image_url: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&h=300&fit=crop', 
        available: true,
        variations: [
          { weight: 250, priceMultiplier: 0.25 },
          { weight: 500, priceMultiplier: 0.5 },
          { weight: 1000, priceMultiplier: 1.0 }
        ]
      },
      { 
        name: 'Chicken Drumsticks', 
        category: 'chicken', 
        unit: 'kg', 
        default_price: 450, 
        image_url: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&h=300&fit=crop', 
        available: true,
        variations: [
          { weight: 250, priceMultiplier: 0.25 },
          { weight: 500, priceMultiplier: 0.5 },
          { weight: 1000, priceMultiplier: 1.0 }
        ]
      },
      { 
        name: 'Chicken Curry Cut', 
        category: 'chicken', 
        unit: 'kg', 
        default_price: 520, 
        image_url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop', 
        available: true,
        variations: [
          { weight: 500, priceMultiplier: 0.5 },
          { weight: 1000, priceMultiplier: 1.0 },
          { weight: 1500, priceMultiplier: 1.45 }
        ]
      },

      // COUNTRY CHICKEN CATEGORY
      { 
        name: 'Country Chicken (Whole)', 
        category: 'country-chicken', 
        unit: 'kg', 
        default_price: 750, 
        image_url: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&h=300&fit=crop', 
        available: true,
        variations: [
          { weight: 500, priceMultiplier: 0.5 },
          { weight: 1000, priceMultiplier: 1.0 },
          { weight: 1500, priceMultiplier: 1.4 }
        ]
      },
      { 
        name: 'Country Chicken Curry Cut', 
        category: 'country-chicken', 
        unit: 'kg', 
        default_price: 780, 
        image_url: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&h=300&fit=crop', 
        available: true,
        variations: [
          { weight: 500, priceMultiplier: 0.5 },
          { weight: 1000, priceMultiplier: 1.0 }
        ]
      },

      // MUTTON CATEGORY
      { 
        name: 'Mutton Curry Cut', 
        category: 'mutton', 
        unit: 'kg', 
        default_price: 850, 
        image_url: 'https://images.unsplash.com/photo-1588347818133-6b8b5d2e8b4b?w=400&h=300&fit=crop', 
        available: true,
        variations: [
          { weight: 250, priceMultiplier: 0.25 },
          { weight: 500, priceMultiplier: 0.5 },
          { weight: 1000, priceMultiplier: 1.0 },
          { weight: 2000, priceMultiplier: 1.9 }
        ]
      },
      { 
        name: 'Mutton Ribs', 
        category: 'mutton', 
        unit: 'kg', 
        default_price: 900, 
        image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop', 
        available: true,
        variations: [
          { weight: 250, priceMultiplier: 0.25 },
          { weight: 500, priceMultiplier: 0.5 },
          { weight: 1000, priceMultiplier: 1.0 }
        ]
      },
      { 
        name: 'Mutton Leg (Boneless)', 
        category: 'mutton', 
        unit: 'kg', 
        default_price: 950, 
        image_url: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=300&fit=crop', 
        available: true,
        variations: [
          { weight: 250, priceMultiplier: 0.25 },
          { weight: 500, priceMultiplier: 0.5 },
          { weight: 1000, priceMultiplier: 1.0 }
        ]
      },
      { 
        name: 'Mutton Shoulder', 
        category: 'mutton', 
        unit: 'kg', 
        default_price: 820, 
        image_url: 'https://images.unsplash.com/photo-1588347818133-6b8b5d2e8b4b?w=400&h=300&fit=crop', 
        available: true,
        variations: [
          { weight: 500, priceMultiplier: 0.5 },
          { weight: 1000, priceMultiplier: 1.0 },
          { weight: 1500, priceMultiplier: 1.45 }
        ]
      },
      { 
        name: 'Mutton Mince', 
        category: 'mutton', 
        unit: 'kg', 
        default_price: 880, 
        image_url: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400&h=300&fit=crop', 
        available: true,
        variations: [
          { weight: 250, priceMultiplier: 0.25 },
          { weight: 500, priceMultiplier: 0.5 },
          { weight: 1000, priceMultiplier: 1.0 }
        ]
      },

      // FISH CATEGORY
      { 
        name: 'Rohu Fish', 
        category: 'fish', 
        unit: 'kg', 
        default_price: 320, 
        image_url: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400&h=300&fit=crop', 
        available: true,
        variations: [
          { weight: 250, cut: 'Cut pieces', priceMultiplier: 0.28 },
          { weight: 500, cut: 'Cut pieces', priceMultiplier: 0.55 },
          { weight: 500, cut: 'Whole fish', priceMultiplier: 0.5 },
          { weight: 1000, cut: 'Whole fish', priceMultiplier: 0.9 }
        ]
      },
      { 
        name: 'Salmon Fish', 
        category: 'fish', 
        unit: 'kg', 
        default_price: 1200, 
        image_url: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=400&h=300&fit=crop', 
        available: true,
        variations: [
          { weight: 250, cut: 'Steaks', priceMultiplier: 0.28 },
          { weight: 500, cut: 'Steaks', priceMultiplier: 0.55 },
          { weight: 250, cut: 'Fillets (boneless)', priceMultiplier: 0.35 },
          { weight: 500, cut: 'Fillets (boneless)', priceMultiplier: 0.7 }
        ]
      },
      { 
        name: 'Pomfret Fish', 
        category: 'fish', 
        unit: 'kg', 
        default_price: 800, 
        image_url: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400&h=300&fit=crop', 
        available: true,
        variations: [
          { weight: 250, cut: 'Whole fish (1-2 pieces)', priceMultiplier: 0.25 },
          { weight: 500, cut: 'Whole fish (2-3 pieces)', priceMultiplier: 0.5 },
          { weight: 250, cut: 'Cut pieces', priceMultiplier: 0.28 },
          { weight: 500, cut: 'Cut pieces', priceMultiplier: 0.55 }
        ]
      },
      { 
        name: 'Kingfish', 
        category: 'fish', 
        unit: 'kg', 
        default_price: 650, 
        image_url: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400&h=300&fit=crop', 
        available: true,
        variations: [
          { weight: 250, cut: 'Steaks', priceMultiplier: 0.25 },
          { weight: 500, cut: 'Steaks', priceMultiplier: 0.5 },
          { weight: 1000, cut: 'Whole fish', priceMultiplier: 0.9 }
        ]
      },

      // PRAWNS CATEGORY
      { 
        name: 'Fresh Prawns', 
        category: 'prawns', 
        unit: 'kg', 
        default_price: 800, 
        image_url: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&h=300&fit=crop', 
        available: true,
        variations: [
          { weight: 250, size: 'Small (41-50 count)', priceMultiplier: 0.25 },
          { weight: 250, size: 'Medium (31-40 count)', priceMultiplier: 0.28 },
          { weight: 250, size: 'Large (21-30 count)', priceMultiplier: 0.32 },
          { weight: 500, size: 'Small (41-50 count)', priceMultiplier: 0.5 },
          { weight: 500, size: 'Medium (31-40 count)', priceMultiplier: 0.56 },
          { weight: 500, size: 'Large (21-30 count)', priceMultiplier: 0.64 }
        ]
      },
      { 
        name: 'Tiger Prawns', 
        category: 'prawns', 
        unit: 'kg', 
        default_price: 1200, 
        image_url: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&h=300&fit=crop', 
        available: true,
        variations: [
          { weight: 250, prep: 'Whole with head', priceMultiplier: 0.25 },
          { weight: 250, prep: 'Headless', priceMultiplier: 0.28 },
          { weight: 250, prep: 'Peeled & deveined', priceMultiplier: 0.4 },
          { weight: 500, prep: 'Whole with head', priceMultiplier: 0.5 },
          { weight: 500, prep: 'Headless', priceMultiplier: 0.56 },
          { weight: 500, prep: 'Peeled & deveined', priceMultiplier: 0.8 }
        ]
      },
      { 
        name: 'Jumbo Prawns', 
        category: 'prawns', 
        unit: 'kg', 
        default_price: 1500, 
        image_url: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&h=300&fit=crop', 
        available: true,
        variations: [
          { weight: 250, size: 'Extra Large (16-20 count)', priceMultiplier: 0.25 },
          { weight: 500, size: 'Extra Large (16-20 count)', priceMultiplier: 0.5 },
          { weight: 250, size: 'Jumbo (10-15 count)', priceMultiplier: 0.3 },
          { weight: 500, size: 'Jumbo (10-15 count)', priceMultiplier: 0.6 }
        ]
      },

      // CRABS CATEGORY
      { 
        name: 'Live Mud Crabs', 
        category: 'crabs', 
        unit: 'kg', 
        default_price: 950, 
        image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop', 
        available: true,
        variations: [
          { weight: 250, priceMultiplier: 0.25 },
          { weight: 500, priceMultiplier: 0.5 },
          { weight: 1000, priceMultiplier: 1.0 }
        ]
      },
      { 
        name: 'Blue Swimming Crabs', 
        category: 'crabs', 
        unit: 'kg', 
        default_price: 750, 
        image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop', 
        available: true,
        variations: [
          { weight: 250, priceMultiplier: 0.25 },
          { weight: 500, priceMultiplier: 0.5 },
          { weight: 1000, priceMultiplier: 1.0 }
        ]
      },

      // EGGS CATEGORY
      { 
        name: 'Farm Fresh Eggs', 
        category: 'eggs', 
        unit: 'dozen', 
        default_price: 120, 
        image_url: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=300&fit=crop', 
        available: true,
        variations: [
          { quantity: 6, priceMultiplier: 0.5 },
          { quantity: 12, priceMultiplier: 1.0 },
          { quantity: 30, priceMultiplier: 2.4 }
        ]
      },
      { 
        name: 'Country Chicken Eggs', 
        category: 'eggs', 
        unit: 'dozen', 
        default_price: 180, 
        image_url: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=300&fit=crop', 
        available: true,
        variations: [
          { quantity: 6, priceMultiplier: 0.5 },
          { quantity: 12, priceMultiplier: 1.0 },
          { quantity: 24, priceMultiplier: 1.9 }
        ]
      },
      { 
        name: 'Duck Eggs', 
        category: 'eggs', 
        unit: 'dozen', 
        default_price: 200, 
        image_url: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=300&fit=crop', 
        available: true,
        variations: [
          { quantity: 6, priceMultiplier: 0.5 },
          { quantity: 12, priceMultiplier: 1.0 }
        ]
      }
    ]

    const productIds = []
    for (const product of products) {
      const docRef = await addDoc(collection(db, 'products'), {
        ...product,
        createdAt: serverTimestamp()
      })
      productIds.push({ id: docRef.id, ...product })
    }

    // Add test vendors
    const vendors = [
      { name: 'Venkatesh Fresh Meats', location: { lat: -1.2921, lng: 36.8219 }, products: ['chicken', 'mutton'] },
      { name: 'Lakshmi Poultry & Fish', location: { lat: -1.2901, lng: 36.8199 }, products: ['chicken', 'fish', 'eggs'] },
      { name: 'Ravi Farm Fresh', location: { lat: -1.2941, lng: 36.8239 }, products: ['chicken', 'country-chicken', 'eggs'] },
      { name: 'Srinivas Fish Market', location: { lat: -1.2911, lng: 36.8209 }, products: ['fish', 'prawns', 'crabs'] }
    ]

    const vendorIds = []
    for (const vendor of vendors) {
      const docRef = await addDoc(collection(db, 'vendors'), {
        ...vendor,
        createdAt: serverTimestamp()
      })
      vendorIds.push({ id: docRef.id, ...vendor })
    }

    // Add vendor-specific products with custom pricing (using safe array access)
    const vendorProducts = []
    
    // Venkatesh Fresh Meats (Chicken & Mutton specialist)
    if (productIds[0]) vendorProducts.push({ productId: productIds[0].id, vendorId: vendorIds[0].id, price: 520, deliveryTime: '2 hours', minOrder: 1 })
    if (productIds[1]) vendorProducts.push({ productId: productIds[1].id, vendorId: vendorIds[0].id, price: 670, deliveryTime: '2 hours', minOrder: 1 })
    if (productIds[2]) vendorProducts.push({ productId: productIds[2].id, vendorId: vendorIds[0].id, price: 490, deliveryTime: '2 hours', minOrder: 1 })
    if (productIds[8]) vendorProducts.push({ productId: productIds[8].id, vendorId: vendorIds[0].id, price: 870, deliveryTime: '3 hours', minOrder: 1 })
    if (productIds[9]) vendorProducts.push({ productId: productIds[9].id, vendorId: vendorIds[0].id, price: 920, deliveryTime: '3 hours', minOrder: 1 })
    
    // Lakshmi Poultry & Fish (Chicken, Fish & Eggs)
    if (productIds[0]) vendorProducts.push({ productId: productIds[0].id, vendorId: vendorIds[1].id, price: 510, deliveryTime: '1 hour', minOrder: 1 })
    if (productIds[1]) vendorProducts.push({ productId: productIds[1].id, vendorId: vendorIds[1].id, price: 660, deliveryTime: '1 hour', minOrder: 1 })
    if (productIds[14]) vendorProducts.push({ productId: productIds[14].id, vendorId: vendorIds[1].id, price: 330, deliveryTime: '2 hours', minOrder: 1 })
    if (productIds[23]) vendorProducts.push({ productId: productIds[23].id, vendorId: vendorIds[1].id, price: 125, deliveryTime: '1 hour', minOrder: 1 })
    
    // Ravi Farm Fresh (Chicken, Country Chicken & Eggs)
    if (productIds[0]) vendorProducts.push({ productId: productIds[0].id, vendorId: vendorIds[2].id, price: 540, deliveryTime: '2 hours', minOrder: 1 })
    if (productIds[6]) vendorProducts.push({ productId: productIds[6].id, vendorId: vendorIds[2].id, price: 780, deliveryTime: '3 hours', minOrder: 1 })
    if (productIds[23]) vendorProducts.push({ productId: productIds[23].id, vendorId: vendorIds[2].id, price: 130, deliveryTime: '2 hours', minOrder: 1 })
    
    // Srinivas Fish Market (Fish, Prawns & Crabs)
    if (productIds[14]) vendorProducts.push({ productId: productIds[14].id, vendorId: vendorIds[3].id, price: 310, deliveryTime: '1 hour', minOrder: 2 })
    if (productIds[18]) vendorProducts.push({ productId: productIds[18].id, vendorId: vendorIds[3].id, price: 820, deliveryTime: '1 hour', minOrder: 1 })
    if (productIds[21]) vendorProducts.push({ productId: productIds[21].id, vendorId: vendorIds[3].id, price: 980, deliveryTime: '1 hour', minOrder: 1 })

    for (const vendorProduct of vendorProducts) {
      await addDoc(collection(db, 'vendorProducts'), {
        ...vendorProduct,
        available: true,
        createdAt: serverTimestamp()
      })
    }

    // Add demo users for authentication testing
    const users = [
      {
        name: 'Super Admin',
        email: 'admin@freshcuts.com',
        password: 'admin123',
        role: 'super_admin',
        verticals: ['food', 'grocery', 'freshcuts', 'health', 'services']
      },
      {
        name: 'FreshCuts Admin',
        email: 'vertical@freshcuts.com',
        password: 'admin123',
        role: 'admin',
        verticals: ['freshcuts']
      },
      {
        name: 'Venkatesh Fresh Meats',
        email: 'vendor@freshcuts.com',
        password: 'vendor123',
        role: 'vendor',
        shopName: 'Venkatesh Fresh Meats',
        verticals: ['freshcuts']
      },
      {
        name: 'Lakshmi Poultry',
        email: 'lakshmi@freshcuts.com',
        password: 'vendor123',
        role: 'vendor',
        shopName: 'Lakshmi Poultry & Fish',
        verticals: ['freshcuts']
      }
    ]

    for (const user of users) {
      await addDoc(collection(db, 'users'), {
        ...user,
        createdAt: serverTimestamp()
      })
    }

    // Update vendors with email addresses for authentication
    const vendorEmails = [
      'vendor@freshcuts.com',
      'lakshmi@freshcuts.com',
      'ravi@freshcuts.com',
      'srinivas@freshcuts.com'
    ]

    for (let i = 0; i < vendorIds.length && i < vendorEmails.length; i++) {
      const { doc, updateDoc } = await import('firebase/firestore')
      await updateDoc(doc(db, 'vendors', vendorIds[i].id), {
        email: vendorEmails[i]
      })
    }

    // Add default settings
    await addDoc(collection(db, 'settings'), {
      marginPercentage: 15,
      createdAt: serverTimestamp()
    })

    return true
  } catch (error) {
    console.error('Seed data failed:', error)
    return false
  }
}