import React from 'react'

const CartContext = React.createContext()

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = React.useState([])
  const [currentUser, setCurrentUser] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const [deliveryOptions, setDeliveryOptions] = React.useState({})

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('currentUser')
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser)
          setCurrentUser(user)
        } catch (error) {
          console.error('Error parsing saved user:', error)
        }
      }
    }
  }, [])

  const addToCart = (product, variation = null) => {
    const cartItem = {
      id: `${product.id}-${variation ? variation.index : 0}`,
      productId: product.id,
      name: product.name,
      price: variation ? Math.round(product.price * variation.priceMultiplier) : product.price,
      imageUrl: product.imageUrl,
      vendorId: product.vendorId || 'unknown-vendor',
      vendorName: product.vendorName || 'Unknown Vendor',
      selectedVariation: variation,
      quantity: 1
    }

    setCartItems(prev => {
      const existing = prev.find(item => item.id === cartItem.id)
      if (existing) {
        return prev.map(item => 
          item.id === cartItem.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, cartItem]
    })
  }

  const removeFromCart = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId))
  }

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }
    
    setCartItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    )
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }

  const updateDeliveryOption = (vendorId, option) => {
    setDeliveryOptions(prev => ({ ...prev, [vendorId]: option }))
  }

  const clearCart = () => {
    setCartItems([])
    setDeliveryOptions({})
  }

  const updateUser = (user) => {
    setCurrentUser(user)
    if (typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user))
      } else {
        localStorage.removeItem('currentUser')
      }
    }
  }

  return React.createElement(CartContext.Provider, {
    value: {
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      getCartTotal,
      getCartCount,
      clearCart,
      updateUser,
      currentUser,
      loading,
      deliveryOptions,
      updateDeliveryOption
    }
  }, children)
}

export const useCart = () => {
  const context = React.useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}