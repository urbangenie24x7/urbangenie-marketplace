import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useCart } from '../../lib/CartContext'
import CheckoutFlow from '../../components/CheckoutFlow'

export default function CustomerDashboard() {
  const router = useRouter()
  const { cartItems, getCartTotal, clearCart } = useCart()
  const [currentUser, setCurrentUser] = useState(null)
  const [showCheckout, setShowCheckout] = useState(false)
  const [recentOrders, setRecentOrders] = useState([])
  const [brandLogo, setBrandLogo] = useState('')
  const [logoHeight, setLogoHeight] = useState(40)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null')
    if (!user) {
      router.push('/customer/marketplace')
      return
    }
    setCurrentUser(user)
    loadRecentOrders(user.id)
    loadBrandSettings()
    
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

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

  const loadRecentOrders = async (userId) => {
    try {
      const { collection, getDocs, query, where } = await import('firebase/firestore')
      const { db } = await import('../../lib/firebase')
      
      const ordersQuery = query(
        collection(db, 'orders'),
        where('userId', '==', userId)
      )
      
      const ordersSnap = await getDocs(ordersQuery)
      const orders = ordersSnap.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().createdAt?.toDate().toLocaleDateString() || new Date().toLocaleDateString()
        }))
        .sort((a, b) => (b.createdAt?.toDate() || new Date()) - (a.createdAt?.toDate() || new Date()))
        .slice(0, 5)
      
      setRecentOrders(orders)
    } catch (error) {
      console.error('Error loading orders:', error)
      setRecentOrders([])
    }
  }

  const handleCheckoutComplete = (orderData) => {
    // CheckoutFlow now handles order creation and redirect
    clearCart()
    setShowCheckout(false)
    // Reload orders after checkout
    if (currentUser) {
      loadRecentOrders(currentUser.id)
    }
  }

  if (!currentUser) {
    return <div style={{ padding: '20px' }}>Loading...</div>
  }

  return (
    <>
      {/* Navigation */}
      <nav style={{
        backgroundColor: '#ffffff',
        padding: isMobile ? '8px 0' : '12px 20px',
        marginBottom: '0',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: '0',
        zIndex: '100',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          maxWidth: isMobile ? '100%' : '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'nowrap',
          gap: isMobile ? '4px' : '10px',
          padding: isMobile ? '0 8px' : '0',
          minHeight: '48px',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '20px', minWidth: 0, flex: '1 1 auto', overflow: 'hidden' }}>
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
                    height: isMobile ? `${Math.min(logoHeight * 0.6, 28)}px` : `${logoHeight}px`, 
                    objectFit: 'contain',
                    maxWidth: isMobile ? '100px' : '200px',
                    display: 'block',
                    verticalAlign: 'middle'
                  }}
                />
              ) : (
                isMobile ? 'FC' : 'FreshCuts'
              )}
            </Link>
          </div>
          
          {!isMobile && (
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexShrink: 0 }}>
              <span style={{ color: '#374151', fontSize: '14px' }}>
                Welcome, {currentUser?.name}
              </span>
              <Link href="/customer/cart" title="Cart" style={{ color: '#374151', textDecoration: 'none', position: 'relative', display: 'flex', alignItems: 'center', padding: '8px', borderRadius: '6px', transition: 'all 0.2s' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 18C5.9 18 5 18.9 5 20S5.9 22 7 22 9 21.1 9 20 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5H5.21L4.27 3H1M17 18C15.9 18 15 18.9 15 20S15.9 22 17 22 19 21.1 19 20 18.1 18 17 18Z"/>
                </svg>
                {cartItems.length > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                  }}>
                    {cartItems.length}
                  </span>
                )}
              </Link>
              <Link href="/customer/orders" title="Orders" style={{ color: '#374151', textDecoration: 'none', display: 'flex', alignItems: 'center', padding: '8px', borderRadius: '8px', transition: 'all 0.2s' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5,3C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19H5V5H12V3H5M17.78,4C17.61,4 17.43,4.07 17.3,4.2L16.08,5.41L18.58,7.91L19.8,6.7C20.06,6.44 20.06,6 19.8,5.75L18.25,4.2C18.12,4.07 17.95,4 17.78,4M15.37,6.12L8,13.5V16H10.5L17.87,8.62L15.37,6.12Z"/>
                </svg>
              </Link>
              <Link href="/customer/dashboard" title="Dashboard" style={{ color: '#16a34a', textDecoration: 'none', display: 'flex', alignItems: 'center', padding: '8px', borderRadius: '8px', transition: 'all 0.2s' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5V9C15 10.1 14.1 11 13 11H11C9.9 11 9 10.1 9 9V7.5L3 7V9C3 10.1 3.9 11 5 11H7V20C7 21.1 7.9 22 9 22H15C16.1 22 17 21.1 17 20V11H19C20.1 11 21 10.1 21 9Z"/>
                </svg>
              </Link>
              <button
                title="Logout"
                onClick={() => {
                  localStorage.removeItem('currentUser')
                  router.push('/customer/marketplace')
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#374151',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px',
                  borderRadius: '8px',
                  transition: 'all 0.2s'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 17V14H9V10H16V7L21 12L16 17M14 2C15.11 2 16 2.9 16 4V6H14V4H5V20H14V18H16V20C16 21.11 15.11 22 14 22H5C3.9 22 3 21.11 3 20V4C3 2.9 3.9 2 5 2H14Z"/>
                </svg>
              </button>
            </div>
          )}
        </div>
      </nav>
      
      {/* Mobile Bottom Tab Bar */}
      {isMobile && (
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
              color: '#6b7280',
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
            
            <Link href="/customer/dashboard" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textDecoration: 'none',
              color: '#16a34a',
              padding: '8px',
              minWidth: '60px'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5V9C15 10.1 14.1 11 13 11H11C9.9 11 9 10.1 9 9V7.5L3 7V9C3 10.1 3.9 11 5 11H7V20C7 21.1 7.9 22 9 22H15C16.1 22 17 21.1 17 20V11H19C20.1 11 21 10.1 21 9Z"/>
              </svg>
              <span style={{ fontSize: '10px', marginTop: '2px', fontWeight: '500' }}>Profile</span>
            </Link>
          </div>
        </div>
      )}

      <div className="container" style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '1200px', margin: '0 auto' }}>

        <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 768 ? '2fr 1fr' : '1fr', gap: '30px' }}>
          {/* Main Content */}
          <div>
            {/* Current Cart Section */}
            {cartItems.length > 0 && (
              <div style={{ 
                backgroundColor: 'white', 
                padding: '25px', 
                borderRadius: '12px', 
                border: '1px solid #e5e7eb',
                marginBottom: '30px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '20px', color: '#374151', margin: '0' }}>
                    Your Cart ({cartItems.length} items)
                  </h2>
                  <Link href="/customer/cart" style={{
                    padding: '12px 24px',
                    backgroundColor: '#16a34a',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    display: 'inline-block'
                  }}>
                    View Cart & Checkout
                  </Link>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {cartItems.slice(0, 3).map(item => (
                    <div key={item.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      padding: '15px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px'
                    }}>
                      <img 
                        src={item.imageUrl}
                        alt={item.name}
                        style={{
                          width: '60px',
                          height: '50px',
                          objectFit: 'cover',
                          borderRadius: '6px'
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#374151' }}>
                          {item.name}
                        </h4>
                        <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
                          {item.vendorName} • Qty: {item.quantity}
                        </p>
                      </div>
                      <span style={{ color: '#16a34a', fontWeight: '600' }}>
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                  
                  {cartItems.length > 3 && (
                    <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '14px', margin: '10px 0 0 0' }}>
                      +{cartItems.length - 3} more items
                    </p>
                  )}
                </div>

                <div style={{ 
                  borderTop: '1px solid #e5e7eb', 
                  paddingTop: '15px', 
                  marginTop: '15px',
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: '18px', fontWeight: '700', color: '#16a34a' }}>
                    Total: ₹{getCartTotal()}
                  </span>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div style={{ 
              backgroundColor: 'white', 
              padding: '25px', 
              borderRadius: '12px', 
              border: '1px solid #e5e7eb',
              marginBottom: '30px'
            }}>
              <h2 style={{ fontSize: '20px', color: '#374151', marginBottom: '20px' }}>Quick Actions</h2>
              
              <div className="quick-actions" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                <Link href="/marketplace" style={{
                  display: 'block',
                  padding: '20px',
                  backgroundColor: '#f0f9ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>🛒</div>
                  <div style={{ color: '#1e40af', fontWeight: '500' }}>Continue Shopping</div>
                </Link>
                
                <Link href="/customer/orders" style={{
                  display: 'block',
                  padding: '20px',
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>📦</div>
                  <div style={{ color: '#166534', fontWeight: '500' }}>Track Orders</div>
                </Link>
                
                <Link href="/customer/profile" style={{
                  display: 'block',
                  padding: '20px',
                  backgroundColor: '#fef3c7',
                  border: '1px solid #fde68a',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>👤</div>
                  <div style={{ color: '#92400e', fontWeight: '500' }}>Manage Profile</div>
                </Link>
              </div>
            </div>

            {/* Recent Orders */}
            <div style={{ 
              backgroundColor: 'white', 
              padding: '25px', 
              borderRadius: '12px', 
              border: '1px solid #e5e7eb'
            }}>
              <h2 style={{ fontSize: '20px', color: '#374151', marginBottom: '20px' }}>Recent Orders</h2>
              
              {recentOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                  <div style={{ fontSize: '48px', marginBottom: '15px' }}>📦</div>
                  <p>No orders yet. Start shopping to see your orders here!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {recentOrders.map(order => (
                    <div key={order.id} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '15px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px'
                    }}>
                      <div>
                        <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#374151' }}>
                          Order #{order.id}
                        </h4>
                        <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
                          {order.date} • {order.vendorName ? `${order.vendorName} • ` : ''}{order.items?.length || 0} items
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: '#16a34a', fontWeight: '600', marginBottom: '5px' }}>
                          ₹{order.total}
                        </div>
                        <span style={{
                          padding: '2px 8px',
                          backgroundColor: order.status === 'Delivered' ? '#dcfce7' : '#fef3c7',
                          color: order.status === 'Delivered' ? '#166534' : '#92400e',
                          borderRadius: '12px',
                          fontSize: '12px'
                        }}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* User Info Card */}
            <div style={{ 
              backgroundColor: 'white', 
              padding: '25px', 
              borderRadius: '12px', 
              border: '1px solid #e5e7eb',
              marginBottom: '20px'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ 
                  width: '60px', 
                  height: '60px', 
                  backgroundColor: '#16a34a', 
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 15px',
                  fontSize: '24px',
                  color: 'white'
                }}>
                  {currentUser.name?.charAt(0) || '👤'}
                </div>
                <h3 style={{ margin: '0 0 5px 0', color: '#374151' }}>{currentUser.name}</h3>
                <p style={{ margin: '0', color: '#6b7280', fontSize: '14px' }}>{currentUser.phone}</p>
                <p style={{ margin: '5px 0 0 0', color: '#6b7280', fontSize: '12px' }}>
                  Role: {currentUser.role}
                </p>
              </div>
              
              <Link href="/customer/profile" style={{
                display: 'block',
                width: '100%',
                padding: '10px',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                textDecoration: 'none',
                borderRadius: '6px',
                textAlign: 'center',
                fontSize: '14px'
              }}>
                Edit Profile
              </Link>
            </div>

            {/* Stats Card */}
            <div style={{ 
              backgroundColor: 'white', 
              padding: '25px', 
              borderRadius: '12px', 
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{ margin: '0 0 20px 0', color: '#374151' }}>Your Stats</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280', fontSize: '14px' }}>Total Orders:</span>
                  <span style={{ color: '#374151', fontWeight: '500' }}>{recentOrders.length}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280', fontSize: '14px' }}>Cart Items:</span>
                  <span style={{ color: '#374151', fontWeight: '500' }}>{cartItems.length}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280', fontSize: '14px' }}>Cart Value:</span>
                  <span style={{ color: '#16a34a', fontWeight: '600' }}>₹{getCartTotal()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Flow Modal */}
        {showCheckout && (
          <CheckoutFlow
            cartItems={cartItems}
            onComplete={handleCheckoutComplete}
            onCancel={() => setShowCheckout(false)}
          />
        )}
      </div>
    </>
  )
}