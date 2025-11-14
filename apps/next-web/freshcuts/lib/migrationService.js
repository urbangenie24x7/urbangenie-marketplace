import { 
  collection, 
  doc, 
  getDocs, 
  updateDoc, 
  addDoc,
  query,
  where,
  writeBatch
} from 'firebase/firestore'
import { db } from './firebase'

// Migration service to upgrade existing data to new structure
export const migrationService = {
  // Migrate user addresses from localStorage to Firestore
  async migrateUserAddresses(userId) {
    try {
      const addressKey = `userAddresses-${userId}`
      const savedAddresses = JSON.parse(localStorage.getItem(addressKey) || '[]')
      
      if (savedAddresses.length > 0) {
        const userRef = doc(db, 'users', userId)
        await updateDoc(userRef, {
          addresses: savedAddresses,
          migratedAt: new Date()
        })
        
        // Clear localStorage after successful migration
        localStorage.removeItem(addressKey)
        console.log(`Migrated ${savedAddresses.length} addresses for user ${userId}`)
      }
    } catch (error) {
      console.error('Error migrating user addresses:', error)
    }
  },

  // Migrate cart data from localStorage to Firestore
  async migrateUserCart(userId) {
    try {
      const cartKey = `freshcuts-cart-${userId}`
      const savedCart = JSON.parse(localStorage.getItem(cartKey) || '[]')
      
      if (savedCart.length > 0) {
        const cartRef = doc(db, 'carts', userId)
        await updateDoc(cartRef, {
          items: savedCart.map(item => ({
            ...item,
            id: item.id || `${item.productId}-${item.vendorId}-${Date.now()}`,
            addedAt: new Date()
          })),
          updatedAt: new Date(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          migratedAt: new Date()
        })
        
        // Clear localStorage after successful migration
        localStorage.removeItem(cartKey)
        console.log(`Migrated ${savedCart.length} cart items for user ${userId}`)
      }
    } catch (error) {
      console.error('Error migrating user cart:', error)
    }
  },

  // Add inventory fields to existing vendor products
  async upgradeVendorProducts() {
    try {
      const vendorProductsSnap = await getDocs(collection(db, 'vendorProducts'))
      const batch = writeBatch(db)
      let updateCount = 0

      vendorProductsSnap.docs.forEach(docSnap => {
        const data = docSnap.data()
        
        // Only update if inventory fields are missing
        if (!data.hasOwnProperty('stockQuantity')) {
          batch.update(docSnap.ref, {
            stockQuantity: 50, // Default stock
            reservedQuantity: 0,
            lowStockThreshold: 10,
            lastRestocked: new Date(),
            autoRestock: false,
            upgradedAt: new Date()
          })
          updateCount++
        }
      })

      if (updateCount > 0) {
        await batch.commit()
        console.log(`Upgraded ${updateCount} vendor products with inventory fields`)
      }
    } catch (error) {
      console.error('Error upgrading vendor products:', error)
    }
  },

  // Create user profiles for existing users
  async createUserProfiles() {
    try {
      // This would typically be run for users who have localStorage data but no Firestore profile
      const existingUsers = []
      
      // Get users from localStorage patterns (this is a simplified example)
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('freshcuts-cart-')) {
          const userId = key.replace('freshcuts-cart-', '')
          if (userId !== 'guest') {
            existingUsers.push(userId)
          }
        }
      }

      for (const userId of existingUsers) {
        try {
          const userRef = doc(db, 'users', userId)
          await updateDoc(userRef, {
            createdAt: new Date(),
            lastActiveAt: new Date(),
            addresses: [],
            preferences: {
              defaultDeliveryOption: 'home_delivery',
              notifications: { sms: true, email: true }
            },
            migratedAt: new Date()
          })
          console.log(`Created profile for user ${userId}`)
        } catch (error) {
          // User document might not exist, create it
          await addDoc(collection(db, 'users'), {
            id: userId,
            createdAt: new Date(),
            lastActiveAt: new Date(),
            addresses: [],
            preferences: {
              defaultDeliveryOption: 'home_delivery',
              notifications: { sms: true, email: true }
            },
            migratedAt: new Date()
          })
        }
      }
    } catch (error) {
      console.error('Error creating user profiles:', error)
    }
  },

  // Run all migrations
  async runAllMigrations(userId = null) {
    console.log('Starting database migrations...')
    
    try {
      // Global migrations
      await this.upgradeVendorProducts()
      await this.createUserProfiles()
      
      // User-specific migrations
      if (userId) {
        await this.migrateUserAddresses(userId)
        await this.migrateUserCart(userId)
      }
      
      console.log('Database migrations completed successfully')
    } catch (error) {
      console.error('Error running migrations:', error)
    }
  }
}