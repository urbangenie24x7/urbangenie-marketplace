// Authentication utilities
export const getCurrentUser = () => {
  if (typeof window === 'undefined') return null
  
  const userStr = localStorage.getItem('currentUser')
  if (!userStr) return null
  
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('currentUser')
    window.location.href = '/login'
  }
}

export const requireAuth = (allowedRoles = []) => {
  const user = getCurrentUser()
  
  if (!user) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    return null
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    if (typeof window !== 'undefined') {
      window.location.href = '/unauthorized'
    }
    return null
  }
  
  return user
}

export const hasVerticalAccess = (user, vertical) => {
  if (!user) return false
  if (user.role === 'super_admin') return true
  if (user.role === 'admin') return user.verticals?.includes(vertical)
  if (user.role === 'vendor') return user.verticals?.includes(vertical)
  return false
}