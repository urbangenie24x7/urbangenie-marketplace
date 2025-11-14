import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '../../lib/CartContext'
import SEOHead from '../../components/SEOHead'
import OTPLogin from '../../components/OTPLogin'
import CheckoutFlow from '../../components/CheckoutFlow'

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart, updateUser, loading, deliveryOptions, updateDeliveryOption } = useCart()
  const [mounted, setMounted] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [vendorGroups, setVendorGroups] = useState({})
  const [brandLogo, setBrandLogo] = useState('')
  const [logoHeight, setLogoHeight] = useState(40)

  useEffect(() => {
    setMounted(true)
    loadBrandSettings()
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
    }
    groupCartByVendor()
  }, [cartItems])

  const loadBrandSettings = async () => {
    try {
      const { collection, getDocs } = await import('firebase/firestore')
      const { db } = await import('../../lib/firebase')
      
      const brandSnap = await getDocs(collection(db, 'brandSettings'))
      if (brandSnap.docs.length > 0) {
        const brandData = brandSnap.docs[0].data()
        setBrandLogo(brandData.logo || '')
        setLogoHeight(brandData.logoHeight || 40)
      }
    } catch (error) {
      console.error('Error loading brand settings:', error)
    }
  }

  const groupCartByVendor = () => {
    const groups = {}
    cartItems.forEach(item => {
      if (!groups[item.vendorId]) {
        groups[item.vendorId] = {
          vendorId: item.vendorId,
          vendorName: item.vendorName,
          items: [],
          total: 0
        }
      }
      groups[item.vendorId].items.push(item)
      groups[item.vendorId].total += item.price * item.quantity
    })
    setVendorGroups(groups)
  }

  const handleCheckout = () => {
    if (currentUser) {
      // User is logged in, proceed to checkout flow
      setShowCheckout(true)
    } else {
      // Show authentication modal
      setShowAuth(true)
    }
  }

  const handleAuthSuccess = (userData) => {
    setCurrentUser(userData)
    setShowAuth(false)
    // Stay on cart page after login - cart is preserved
  }

  const handleCheckoutComplete = (orderData) => {
    // CheckoutFlow now handles order creation and redirect
    clearCart()
    setShowCheckout(false)
  }

  const handleCheckoutCancel = () => {
    setShowCheckout(false)
  }

  const handleAuthCancel = () => {
    setShowAuth(false)
  }

  if (!mounted || loading) {
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
        backgroundColor: '#ffffff',
        padding: '12px 20px',
        marginBottom: '0',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: '0',
        zIndex: '100',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Link href="/customer/marketplace" style={{ 
            color: '#16a34a', 
            textDecoration: 'none', 
            fontSize: '24px', 
            fontWeight: '700',
            letterSpacing: '-0.5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {brandLogo ? (
              <img 
                src={brandLogo} 
                alt="FreshCuts Logo"
                style={{ 
                  height: `${logoHeight}px`, 
                  objectFit: 'contain',
                  display: 'block',
                  verticalAlign: 'middle'
                }}
              />
            ) : (
              'FreshCuts'
            )}
          </Link>
        </div>
      </nav>

      <div style={{ padding: window.innerWidth > 768 ? '20px' : '16px', paddingBottom: '100px', fontFamily: 'Arial', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ color: '#16a34a', fontSize: window.innerWidth > 768 ? '32px' : '24px', marginBottom: window.innerWidth > 768 ? '30px' : '20px' }}>Shopping Cart</h1>

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
          <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 768 ? '2fr 1fr' : '1fr', gap: window.innerWidth > 768 ? '30px' : '20px' }}>
            {/* Cart Items */}
            <div>
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '20px', color: '#374151', margin: '0' }}>
                  Items ({cartItems.length})
                </h2>
              </div>

              {Object.keys(vendorGroups).length > 1 && (
                <div style={{ backgroundColor: '#dcfce7', padding: '12px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #bbf7d0' }}>
                  <p style={{ margin: '0', fontSize: '14px', color: '#166534' }}>
                    🎉 <strong>Great choice!</strong> You're shopping from {Object.keys(vendorGroups).length} different vendors in one order.
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                {Object.keys(vendorGroups).map(vendorId => {
                  const vendor = vendorGroups[vendorId]
                  return (
                    <div key={vendorId} style={{
                      border: '2px solid #e5e7eb',
                      borderRadius: '16px',
                      padding: window.innerWidth > 768 ? '20px' : '16px',
                      backgroundColor: '#fafafa'
                    }}>
                      {/* Vendor Header */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '15px',
                        paddingBottom: '10px',
                        borderBottom: '1px solid #d1d5db'
                      }}>
                        <div>
                          <h3 style={{ color: '#16a34a', margin: '0', fontSize: window.innerWidth > 768 ? '18px' : '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <svg width={window.innerWidth > 768 ? '20' : '18'} height={window.innerWidth > 768 ? '20' : '18'} viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2Z"/>
                            </svg>
                            {vendor.vendorName}
                          </h3>
                          <p style={{ color: '#6b7280', fontSize: '14px', margin: '5px 0 0 0' }}>
                            {vendor.items.length} item{vendor.items.length > 1 ? 's' : ''}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ color: '#16a34a', fontSize: '20px', fontWeight: 'bold', margin: '0' }}>
                            ₹{vendor.total}
                          </p>
                          <p style={{ color: '#6b7280', fontSize: '12px', margin: '0' }}>
                            Vendor Total
                          </p>
                          {vendor.total < 500 && (
                            <p style={{ color: '#f59e0b', fontSize: '11px', margin: '2px 0 0 0', fontWeight: '500' }}>
                              Add ₹{500 - vendor.total} for FREE delivery
                            </p>
                          )}
                          {vendor.total >= 500 && (
                            <p style={{ color: '#10b981', fontSize: '11px', margin: '2px 0 0 0', fontWeight: '500' }}>
                              ✓ Eligible for FREE delivery
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Delivery Options Selection */}
                      <div style={{
                        backgroundColor: '#f8fafc',
                        padding: '16px',
                        borderRadius: '8px',
                        marginBottom: '15px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <h4 style={{ color: '#374151', fontSize: '14px', margin: '0 0 12px 0', fontWeight: '600' }}>
                          Select Delivery Option:
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {/* Pickup Option */}
                          <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px',
                            backgroundColor: deliveryOptions[vendorId] === 'pickup' ? '#f0f9ff' : 'white',
                            border: deliveryOptions[vendorId] === 'pickup' ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}>
                            <input
                              type="radio"
                              name={`delivery-${vendorId}`}
                              value="pickup"
                              checked={deliveryOptions[vendorId] === 'pickup'}
                              onChange={() => updateDeliveryOption(vendorId, 'pickup')}
                              style={{ margin: 0 }}
                            />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="#16a34a">
                                <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2Z"/>
                              </svg>
                              <div>
                                <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Store Pickup</div>
                                <div style={{ fontSize: '12px', color: '#6b7280' }}>Collect from vendor store</div>
                              </div>
                            </div>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: '#16a34a' }}>FREE</div>
                          </label>

                          {/* Home Delivery Option */}
                          <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px',
                            backgroundColor: deliveryOptions[vendorId] === 'delivery' ? '#f0f9ff' : 'white',
                            border: deliveryOptions[vendorId] === 'delivery' ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}>
                            <input
                              type="radio"
                              name={`delivery-${vendorId}`}
                              value="delivery"
                              checked={deliveryOptions[vendorId] === 'delivery'}
                              onChange={() => updateDeliveryOption(vendorId, 'delivery')}
                              style={{ margin: 0 }}
                            />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill={vendor.total >= 500 ? '#16a34a' : '#f59e0b'}>
                                <path d="M3,4A2,2 0 0,0 1,6V17H3A3,3 0 0,0 6,20A3,3 0 0,0 9,17H15A3,3 0 0,0 18,20A3,3 0 0,0 21,17H23V12L20,8H17V4Z"/>
                              </svg>
                              <div>
                                <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Home Delivery</div>
                                <div style={{ fontSize: '12px', color: '#6b7280' }}>Delivered to your address</div>
                              </div>
                            </div>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: vendor.total >= 500 ? '#16a34a' : '#f59e0b' }}>
                              {vendor.total >= 500 ? 'FREE' : '₹35'}
                            </div>
                          </label>

                          {/* Express Delivery Option */}
                          <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px',
                            backgroundColor: deliveryOptions[vendorId] === 'express' ? '#f0f9ff' : 'white',
                            border: deliveryOptions[vendorId] === 'express' ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}>
                            <input
                              type="radio"
                              name={`delivery-${vendorId}`}
                              value="express"
                              checked={deliveryOptions[vendorId] === 'express'}
                              onChange={() => updateDeliveryOption(vendorId, 'express')}
                              style={{ margin: 0 }}
                            />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill={vendor.total >= 1000 ? '#16a34a' : '#f59e0b'}>
                                <path d="M13,2.05V5.08C16.39,5.57 19,8.47 19,12C19,12.9 18.82,13.75 18.5,14.54L21.12,16.07C21.68,14.83 22,13.45 22,12C22,6.82 18.05,2.55 13,2.05Z"/>
                              </svg>
                              <div>
                                <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Express Delivery</div>
                                <div style={{ fontSize: '12px', color: '#6b7280' }}>Same day delivery (2-4 hrs)</div>
                              </div>
                            </div>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: vendor.total >= 1000 ? '#16a34a' : '#f59e0b' }}>
                              {vendor.total >= 1000 ? 'FREE' : '₹75'}
                            </div>
                          </label>
                        </div>
                        {vendor.total < 500 && (
                          <div style={{
                            marginTop: '8px',
                            padding: '8px',
                            backgroundColor: '#fef3c7',
                            borderRadius: '6px',
                            border: '1px solid #fcd34d'
                          }}>
                            <p style={{ color: '#92400e', fontSize: '11px', margin: '0', fontWeight: '500' }}>
                              💡 Add ₹{500 - vendor.total} more to get FREE home delivery!
                            </p>
                          </div>
                        )}
                        {vendor.total >= 500 && vendor.total < 1000 && (
                          <div style={{
                            marginTop: '8px',
                            padding: '8px',
                            backgroundColor: '#dcfce7',
                            borderRadius: '6px',
                            border: '1px solid #bbf7d0'
                          }}>
                            <p style={{ color: '#166534', fontSize: '11px', margin: '0', fontWeight: '500' }}>
                              🎉 You've unlocked FREE delivery! Add ₹{1000 - vendor.total} more for FREE express.
                            </p>
                          </div>
                        )}
                        {vendor.total >= 1000 && (
                          <div style={{
                            marginTop: '8px',
                            padding: '8px',
                            backgroundColor: '#dcfce7',
                            borderRadius: '6px',
                            border: '1px solid #bbf7d0'
                          }}>
                            <p style={{ color: '#166534', fontSize: '11px', margin: '0', fontWeight: '500' }}>
                              🌟 You've unlocked FREE delivery & express delivery!
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Vendor Items */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {vendor.items.map(item => (
                          <div key={item.id} style={{
                            display: 'grid',
                            gridTemplateColumns: window.innerWidth > 768 ? '80px 1fr auto auto auto' : '60px 1fr auto',
                            gap: window.innerWidth > 768 ? '12px' : '8px',
                            alignItems: 'center',
                            padding: '15px',
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '10px'
                          }}>
                            <img 
                              src={item.imageUrl}
                              alt={item.name}
                              style={{
                                width: window.innerWidth > 768 ? '80px' : '60px',
                                height: window.innerWidth > 768 ? '60px' : '50px',
                                objectFit: 'cover',
                                borderRadius: '6px'
                              }}
                            />
                            
                            <div>
                              <h4 style={{ color: '#374151', margin: '0 0 3px 0', fontSize: '15px' }}>
                                {item.name}
                              </h4>
                              {item.variation && (
                                <p style={{ color: '#9ca3af', fontSize: '11px', margin: '0' }}>
                                  {item.variation.weight && `${item.variation.weight}g`}
                                  {item.variation.quantity && `${item.variation.quantity} pieces`}
                                  {item.variation.size && ` ${item.variation.size}`}
                                  {item.variation.cut && ` - ${item.variation.cut}`}
                                  {item.variation.prep && ` (${item.variation.prep})`}
                                </p>
                              )}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <svg 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                width="20" 
                                height="20" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="#9ca3af" 
                                strokeWidth="2"
                                style={{
                                  cursor: 'pointer',
                                  transition: 'stroke 0.2s ease',
                                  padding: '4px'
                                }}
                                onMouseEnter={(e) => e.target.style.stroke = '#16a34a'}
                                onMouseLeave={(e) => e.target.style.stroke = '#9ca3af'}
                                title="Decrease quantity"
                              >
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M8 12h8"/>
                              </svg>
                              <span style={{ fontSize: '14px', fontWeight: '500', minWidth: '18px', textAlign: 'center' }}>
                                {item.quantity}
                              </span>
                              <svg 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                width="20" 
                                height="20" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="#9ca3af" 
                                strokeWidth="2"
                                style={{
                                  cursor: 'pointer',
                                  transition: 'stroke 0.2s ease',
                                  padding: '4px'
                                }}
                                onMouseEnter={(e) => e.target.style.stroke = '#16a34a'}
                                onMouseLeave={(e) => e.target.style.stroke = '#9ca3af'}
                                title="Increase quantity"
                              >
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M12 8v8M8 12h8"/>
                              </svg>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                              <p style={{ color: '#16a34a', fontSize: '16px', fontWeight: 'bold', margin: '0' }}>
                                ₹{item.price * item.quantity}
                              </p>
                              <p style={{ color: '#6b7280', fontSize: '12px', margin: '0' }}>
                                ₹{item.price} each
                              </p>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.id)}
                              style={{
                                width: '32px',
                                height: '32px',
                                backgroundColor: 'transparent',
                                color: '#9ca3af',
                                border: 'none',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#fef2f2'
                                e.target.style.color = '#dc2626'
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent'
                                e.target.style.color = '#9ca3af'
                              }}
                              title="Remove item"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6"/>
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Order Summary */}
            <div style={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '25px',
              height: 'fit-content',
              position: window.innerWidth > 768 ? 'sticky' : 'static',
              top: window.innerWidth > 768 ? '20px' : 'auto',
              marginTop: window.innerWidth > 768 ? '0' : '30px',
              order: window.innerWidth > 768 ? 0 : 1
            }}>
              <h2 style={{ fontSize: window.innerWidth > 768 ? '20px' : '18px', color: '#374151', marginBottom: window.innerWidth > 768 ? '20px' : '16px' }}>Order Summary</h2>
              
              {/* Vendor-wise breakdown */}
              <div style={{ marginBottom: '15px' }}>
                {Object.keys(vendorGroups).map(vendorId => {
                  const vendor = vendorGroups[vendorId]
                  const selectedOption = deliveryOptions[vendorId] || 'delivery'
                  let deliveryCharge = 0
                  let deliveryLabel = 'Pickup'
                  
                  if (selectedOption === 'delivery') {
                    deliveryCharge = vendor.total >= 500 ? 0 : 35
                    deliveryLabel = 'Home Delivery'
                  } else if (selectedOption === 'express') {
                    deliveryCharge = vendor.total >= 1000 ? 0 : 75
                    deliveryLabel = 'Express Delivery'
                  }
                  
                  return (
                    <div key={vendorId} style={{ marginBottom: '12px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                        {vendor.vendorName}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '3px' }}>
                        <span style={{ color: '#6b7280' }}>Items ({vendor.items.length}):</span>
                        <span style={{ color: '#374151' }}>₹{vendor.total}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '3px' }}>
                        <span style={{ color: '#6b7280' }}>{deliveryLabel}:</span>
                        <span style={{ color: deliveryCharge === 0 ? '#10b981' : '#f59e0b' }}>
                          {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', borderTop: '1px solid #e2e8f0', paddingTop: '6px', marginTop: '6px' }}>
                        <span style={{ color: '#374151' }}>Vendor Total:</span>
                        <span style={{ color: '#16a34a' }}>₹{vendor.total + deliveryCharge}</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Overall totals */}
              <div style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#6b7280' }}>Items Subtotal:</span>
                  <span style={{ color: '#374151', fontWeight: '500' }}>₹{getCartTotal()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#6b7280' }}>Total Delivery:</span>
                  <span style={{ color: '#374151', fontWeight: '500' }}>
                    ₹{Object.keys(vendorGroups).reduce((total, vendorId) => {
                      const vendor = vendorGroups[vendorId]
                      const selectedOption = deliveryOptions[vendorId] || 'delivery'
                      let deliveryCharge = 0
                      
                      if (selectedOption === 'delivery') {
                        deliveryCharge = vendor.total >= 500 ? 0 : 35
                      } else if (selectedOption === 'express') {
                        deliveryCharge = vendor.total >= 1000 ? 0 : 75
                      }
                      
                      return total + deliveryCharge
                    }, 0)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#6b7280' }}>Tax (5%):</span>
                  <span style={{ color: '#374151', fontWeight: '500' }}>₹{Math.round(getCartTotal() * 0.05)}</span>
                </div>
              </div>

              <div style={{ 
                borderTop: '1px solid #e5e7eb', 
                paddingTop: '15px', 
                marginBottom: '20px' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#374151' }}>Grand Total:</span>
                  <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#16a34a' }}>
                    ₹{getCartTotal() + Object.keys(vendorGroups).reduce((total, vendorId) => {
                      const vendor = vendorGroups[vendorId]
                      const selectedOption = deliveryOptions[vendorId] || 'delivery'
                      let deliveryCharge = 0
                      
                      if (selectedOption === 'delivery') {
                        deliveryCharge = vendor.total >= 500 ? 0 : 35
                      } else if (selectedOption === 'express') {
                        deliveryCharge = vendor.total >= 1000 ? 0 : 75
                      }
                      
                      return total + deliveryCharge
                    }, 0) + Math.round(getCartTotal() * 0.05)}
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
                {window.innerWidth <= 768 && (
                  <Link 
                    href="/"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      color: '#6b7280',
                      textDecoration: 'none',
                      fontSize: '14px',
                      padding: '12px 16px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      fontWeight: '500',
                      minHeight: '44px'
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/>
                    </svg>
                    Back to Categories
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Checkout Authentication Modal */}
        {showAuth && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', maxWidth: '400px', width: '90%', position: 'relative' }}>
              <button
                onClick={handleAuthCancel}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '15px',
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
              <OTPLogin 
                onLogin={handleAuthSuccess}
                userType="customer"
              />
            </div>
          </div>
        )}
        
        {/* Checkout Flow Modal */}
        {showCheckout && (
          <CheckoutFlow
            cartItems={cartItems}
            onComplete={handleCheckoutComplete}
            onCancel={handleCheckoutCancel}
            currentUser={currentUser}
            deliveryOptions={deliveryOptions}
          />
        )}
      </div>
      
      {/* Mobile Bottom Tab Bar */}
      {window.innerWidth <= 768 && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e5e7eb',
          padding: '8px 0',
          zIndex: 100,
          boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            <Link href="/customer/marketplace" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textDecoration: 'none',
              color: '#6b7280',
              padding: '8px',
              minWidth: '60px'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/>
              </svg>
              <span style={{ fontSize: '10px', marginTop: '2px', fontWeight: '500' }}>Home</span>
            </Link>
            
            <Link href="/customer/cart" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textDecoration: 'none',
              color: '#16a34a',
              padding: '8px',
              minWidth: '60px',
              position: 'relative'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 18C5.9 18 5 18.9 5 20S5.9 22 7 22 9 21.1 9 20 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5H5.21L4.27 3H1M17 18C15.9 18 15 18.9 15 20S15.9 22 17 22 19 21.1 19 20 18.1 18 17 18Z"/>
              </svg>
              {cartItems.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '4px',
                  right: '12px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  borderRadius: '50%',
                  width: '16px',
                  height: '16px',
                  fontSize: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>
                  {cartItems.length}
                </span>
              )}
              <span style={{ fontSize: '10px', marginTop: '2px', fontWeight: '500' }}>Cart</span>
            </Link>
            
            {mounted && currentUser && (
              <>
                <Link href="/customer/orders" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: '#6b7280',
                  padding: '8px',
                  minWidth: '60px'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5,3C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19H5V5H12V3H5M17.78,4C17.61,4 17.43,4.07 17.3,4.2L16.08,5.41L18.58,7.91L19.8,6.7C20.06,6.44 20.06,6 19.8,5.75L18.25,4.2C18.12,4.07 17.95,4 17.78,4M15.37,6.12L8,13.5V16H10.5L17.87,8.62L15.37,6.12Z"/>
                  </svg>
                  <span style={{ fontSize: '10px', marginTop: '2px', fontWeight: '500' }}>Orders</span>
                </Link>
                
                <Link href="/customer/profile" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: '#6b7280',
                  padding: '8px',
                  minWidth: '60px'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5V9C15 10.1 14.1 11 13 11H11C9.9 11 9 10.1 9 9V7.5L3 7V9C3 10.1 3.9 11 5 11H7V20C7 21.1 7.9 22 9 22H15C16.1 22 17 21.1 17 20V11H19C20.1 11 21 10.1 21 9Z"/>
                  </svg>
                  <span style={{ fontSize: '10px', marginTop: '2px', fontWeight: '500' }}>Profile</span>
                </Link>
              </>
            )}
            
            {mounted && !currentUser && (
              <button
                onClick={() => window.location.href = '/customer/marketplace'}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  background: 'none',
                  border: 'none',
                  color: '#6b7280',
                  padding: '8px',
                  minWidth: '60px',
                  cursor: 'pointer'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5V9C15 10.1 14.1 11 13 11H11C9.9 11 9 10.1 9 9V7.5L3 7V9C3 10.1 3.9 11 5 11H7V20C7 21.1 7.9 22 9 22H15C16.1 22 17 21.1 17 20V11H19C20.1 11 21 10.1 21 9Z"/>
                </svg>
                <span style={{ fontSize: '10px', marginTop: '2px', fontWeight: '500' }}>Login</span>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default Cart