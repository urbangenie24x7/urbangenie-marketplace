// UrbanGenie Access Control Model
export const ACCESS_ROLES = {
  CUSTOMER: 'customer',
  VENDOR: 'vendor', 
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin'
}

export const VERTICALS = {
  FOOD: 'food',
  GROCERY: 'grocery', 
  FRESHCUTS: 'freshcuts',
  HEALTH: 'health',
  SERVICES: 'services'
}

// Access Control Rules
export const ACCESS_RULES = {
  // Customers: Global access across all verticals
  [ACCESS_ROLES.CUSTOMER]: {
    verticals: Object.values(VERTICALS), // All verticals
    permissions: ['browse', 'order', 'review'],
    scope: 'global', // One account works everywhere
    authRequired: {
      browse: false, // Anonymous browsing allowed
      addToCart: false, // Anonymous cart allowed
      checkout: true, // Authentication required at checkout
      orderHistory: true // Authentication required for orders
    }
  },

  // Vendors: Vertical-scoped, own data only
  [ACCESS_ROLES.VENDOR]: {
    verticals: [], // Assigned during onboarding
    permissions: ['manage_products', 'view_orders', 'update_profile'],
    scope: 'own_data', // Only their own vendor data
    dataAccess: {
      orders: 'own_vendor_only',
      products: 'own_vendor_only', 
      payouts: 'own_vendor_only'
    }
  },

  // Admins: Vertical-scoped administration
  [ACCESS_ROLES.ADMIN]: {
    verticals: [], // Assigned specific vertical(s)
    permissions: ['manage_vendors', 'manage_products', 'view_analytics', 'manage_categories'],
    scope: 'assigned_verticals',
    dataAccess: {
      vendors: 'assigned_verticals_only',
      products: 'assigned_verticals_only',
      orders: 'assigned_verticals_only'
    }
  },

  // Super Admin: Full platform access
  [ACCESS_ROLES.SUPER_ADMIN]: {
    verticals: Object.values(VERTICALS), // All verticals
    permissions: ['full_access'],
    scope: 'global',
    dataAccess: {
      all: 'unrestricted'
    }
  }
}

// Helper functions for access control
export const hasVerticalAccess = (userRole, userVerticals, targetVertical) => {
  if (userRole === ACCESS_ROLES.CUSTOMER || userRole === ACCESS_ROLES.SUPER_ADMIN) {
    return true // Global access
  }
  return userVerticals?.includes(targetVertical)
}

export const canAccessVendorData = (userRole, userId, targetVendorId) => {
  if (userRole === ACCESS_ROLES.SUPER_ADMIN) return true
  if (userRole === ACCESS_ROLES.VENDOR) return userId === targetVendorId
  return false
}

export const canManageVertical = (userRole, userVerticals, targetVertical) => {
  if (userRole === ACCESS_ROLES.SUPER_ADMIN) return true
  if (userRole === ACCESS_ROLES.ADMIN) return userVerticals?.includes(targetVertical)
  return false
}

// Customer authentication flow helpers
export const requiresAuth = (action) => {
  const authRequirements = {
    browse: false,
    addToCart: false, 
    checkout: true,
    orderHistory: true,
    profile: true
  }
  return authRequirements[action] || false
}

export const CUSTOMER_FLOW = {
  ANONYMOUS_BROWSING: 'anonymous_browsing', // Browse all verticals without login
  ANONYMOUS_CART: 'anonymous_cart', // Add to cart without login
  CHECKOUT_AUTH: 'checkout_auth', // Authenticate at checkout
  AUTHENTICATED: 'authenticated' // Full access after login
}