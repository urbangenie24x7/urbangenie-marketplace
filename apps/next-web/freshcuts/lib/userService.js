import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc, 
  serverTimestamp 
} from 'firebase/firestore'
import { db } from './firebase'

// Valid user roles
const VALID_ROLES = ['customer', 'admin', 'super_admin']

export const userService = {
  // Create user with role defaulting to customer
  async createUser(userData) {
    // Validate mandatory fields
    if (!userData.phone || !userData.name) {
      throw new Error('Phone and name are mandatory fields')
    }

    // Default role to customer if not provided
    const role = userData.role || 'customer'
    
    // Validate role
    if (!VALID_ROLES.includes(role)) {
      throw new Error(`Invalid role. Must be one of: ${VALID_ROLES.join(', ')}`)
    }

    // Validate phone format
    if (!userData.phone.startsWith('+91') || userData.phone.length !== 13) {
      throw new Error('Phone must be in +91XXXXXXXXXX format')
    }

    const user = {
      phone: userData.phone,
      role: role, // Defaults to customer
      name: userData.name, // Mandatory
      email: userData.email || '',
      status: 'active',
      emailVerified: userData.emailVerified || false,
      createdAt: serverTimestamp(),
      lastLoginAt: null,
      permissions: userData.permissions || this.getDefaultPermissions(role)
    }

    const docRef = await addDoc(collection(db, 'users'), user)
    return { id: docRef.id, ...user }
  },

  // Update user with role validation
  async updateUser(userId, updates) {
    // Prevent role changes after creation for security
    if (updates.role) {
      throw new Error('Role cannot be changed after user creation')
    }

    // Validate phone format if being updated
    if (updates.phone && (!updates.phone.startsWith('+91') || updates.phone.length !== 13)) {
      throw new Error('Phone must be in +91XXXXXXXXXX format')
    }

    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp()
    })
  },

  // Get default permissions based on role
  getDefaultPermissions(role) {
    switch (role) {
      case 'super_admin':
        return ['read', 'write', 'admin', 'super_admin']
      case 'admin':
        return ['read', 'write', 'admin']
      case 'customer':
        return ['read']
      default:
        return ['read']
    }
  },

  // Validate user data structure
  validateUserData(userData) {
    const errors = []

    if (!userData.phone) errors.push('Phone is mandatory')
    if (!userData.name) errors.push('Name is mandatory')
    
    const role = userData.role || 'customer'
    if (!VALID_ROLES.includes(role)) {
      errors.push(`Invalid role. Must be one of: ${VALID_ROLES.join(', ')}`)
    }

    if (userData.phone && (!userData.phone.startsWith('+91') || userData.phone.length !== 13)) {
      errors.push('Phone must be in +91XXXXXXXXXX format')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}