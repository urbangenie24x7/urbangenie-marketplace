import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '../../lib/CartContext'
import SEOHead from '../../components/SEOHead'
import CheckoutAuth from '../../components/CheckoutAuth'

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart()
  const [mounted, setMounted] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    setMounted(true)
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
    }
  }, [])

  const handleCheckout = () => {
    if (currentUser) {
      // User is logged in, proceed to checkout
      alert(`Proceeding to checkout for ${currentUser.name}...`)
    } else {
      // Show authentication modal
      setShowAuth(true)
    }
  }

  const handleAuthSuccess = (userData) => {
    setCurrentUser(userData)
    setShowAuth(false)
    alert(`Welcome ${userData.name}! Proceeding to checkout...`)
  }

  const handleAuthCancel = () => {
    setShowAuth(false)
  }

  if (!mounted) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial', textAlign: 'center' }}>
        <h1 style={{ color: '#16a34a', fontSize: '32px', marginBottom: '20px' }}>FreshCuts</h1>
        <p style={{ fontSize: '18px', color: '#666' }}>Loading cart...</p>
      </div>
    )
  }

  return (
    <>
      <SEOHead 
        title="Shopping Cart | FreshCuts"
        description="Review your fresh meat selections. Quality products from local vendors with fast delivery."
        url="https://freshcuts.com/cart"
      />
      
      {/* Navigation Bar */}
      <nav style={{
        backgroundColor: '#16a34a',
        padding: '10px 20px',
        marginBottom: '20px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link href="/customer/marketplace" style={{ 
            color: 'white', 
            textDecoration: 'none', 
            fontSize: '20px', 
            fontWeight: 'bold' 
          }}>
            FreshCuts
          </Link>
          
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link href="/customer/marketplace" style={{ color: 'white', textDecoration: 'none', fontSize: '16px' }}>
              ← Back to Marketplace
            </Link>
          </div>
        </div>
      </nav>

      <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ color: '#16a34a', fontSize: '32px', marginBottom: '30px' }}>Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            backgroundColor: '#f9fafb',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            <h2 style={{ color: '#6b7280', fontSize: '24px', marginBottom: '15px' }}>Your cart is empty</h2>
            <p style={{ color: '#9ca3af', fontSize: '16px', marginBottom: '25px' }}>
              Add some fresh products from our marketplace
            </p>
            <Link 
              href="/customer/marketplace"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                backgroundColor: '#16a34a',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
            {/* Cart Items */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '20px', color: '#374151', margin: '0' }}>
                  Items ({cartItems.length})
                </h2>
                <button
                  onClick={clearCart}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Clear Cart
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {cartItems.map(item => (
                  <div key={item.id} style={{
                    display: 'grid',
                    gridTemplateColumns: '100px 1fr auto auto auto',
                    gap: '15px',
                    alignItems: 'center',
                    padding: '20px',
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px'
                  }}>
                    <img 
                      src={item.imageUrl}
                      alt={item.name}
                      style={{
                        width: '100px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }}
                    />
                    
                    <div>
                      <h3 style={{ color: '#374151', margin: '0 0 5px 0', fontSize: '16px' }}>
                        {item.name}
                      </h3>
                      <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 5px 0' }}>
                        From: {item.vendorName}
                      </p>
                      {item.variation && (
                        <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0' }}>
                          {item.variation.weight && `${item.variation.weight}g`}
                          {item.variation.quantity && `${item.variation.quantity} pieces`}
                          {item.variation.size && ` ${item.variation.size}`}
                          {item.variation.cut && ` - ${item.variation.cut}`}
                          {item.variation.prep && ` (${item.variation.prep})`}
                        </p>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{
                          width: '30px',
                          height: '30px',
                          backgroundColor: '#f3f4f6',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        -
                      </button>
                      <span style={{ fontSize: '16px', fontWeight: '500', minWidth: '20px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{
                          width: '30px',
                          height: '30px',
                          backgroundColor: '#f3f4f6',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        +
                      </button>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <p style={{ color: '#16a34a', fontSize: '18px', fontWeight: 'bold', margin: '0' }}>
                        ₹{item.price * item.quantity}
                      </p>
                      <p style={{ color: '#6b7280', fontSize: '14px', margin: '0' }}>
                        ₹{item.price} each
                      </p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div style={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '25px',
              height: 'fit-content',
              position: 'sticky',
              top: '20px'
            }}>
              <h2 style={{ fontSize: '20px', color: '#374151', marginBottom: '20px' }}>Order Summary</h2>
              
              <div style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#6b7280' }}>Subtotal:</span>
                  <span style={{ color: '#374151', fontWeight: '500' }}>₹{getCartTotal()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#6b7280' }}>Delivery:</span>
                  <span style={{ color: '#10b981', fontWeight: '500' }}>Free</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#6b7280' }}>Tax:</span>
                  <span style={{ color: '#374151', fontWeight: '500' }}>₹{Math.round(getCartTotal() * 0.05)}</span>
                </div>
              </div>

              <div style={{ 
                borderTop: '1px solid #e5e7eb', 
                paddingTop: '15px', 
                marginBottom: '20px' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#374151' }}>Total:</span>
                  <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#16a34a' }}>
                    ₹{getCartTotal() + Math.round(getCartTotal() * 0.05)}
                  </span>
                </div>
              </div>

              <button
                style={{
                  width: '100%',
                  padding: '15px',
                  backgroundColor: '#16a34a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginBottom: '15px'
                }}
                onClick={handleCheckout}
              >
                {currentUser ? 'Proceed to Checkout' : 'Login & Checkout'}
              </button>
              
              {currentUser && (
                <p style={{ 
                  textAlign: 'center', 
                  fontSize: '12px', 
                  color: '#6b7280', 
                  marginBottom: '15px' 
                }}>
                  Logged in as {currentUser.name}
                </p>
              )}

              <Link 
                href="/customer/marketplace"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  color: '#16a34a',
                  textDecoration: 'none',
                  fontSize: '14px'
                }}
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        )}
        
        {/* Checkout Authentication Modal */}
        {showAuth && (
          <CheckoutAuth 
            onAuthSuccess={handleAuthSuccess}
            onCancel={handleAuthCancel}
          />
        )}
      </div>
    </>
  )
}