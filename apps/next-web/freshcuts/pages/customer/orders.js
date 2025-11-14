import { useState, useEffect } from 'react'
import Link from 'next/link'
import SEOHead from '../../components/SEOHead'
// Database services imported dynamically

export default function CustomerOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)
  const [brandLogo, setBrandLogo] = useState('')
  const [filter, setFilter] = useState('all') // all, active, completed

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser')
    if (!savedUser) {
      window.location.href = '/customer/marketplace'
      return
    }
    
    const user = JSON.parse(savedUser)
    setCurrentUser(user)
    loadOrders(user.id)
    loadBrandSettings()
    
    // Track page view
    const trackPageView = async () => {
      try {
        const { analyticsService } = await import('../../lib/dbService')
        analyticsService.trackEvent('orders_page_view', user.id)
      } catch (error) {
        console.log('Analytics not available')
      }
    }
    trackPageView()
  }, [])

  const loadBrandSettings = async () => {
    try {
      const { collection, getDocs } = await import('firebase/firestore')
      const { db } = await import('../../lib/firebase')
      
      const brandSnap = await getDocs(collection(db, 'brandSettings'))
      if (brandSnap.docs.length > 0) {
        setBrandLogo(brandSnap.docs[0].data().logo || '')
      }
    } catch (error) {
      console.error('Error loading brand settings:', error)
    }
  }

  const loadOrders = async (userId) => {
    try {
      setLoading(true)
      
      // Try new database service first
      try {
        const { orderService } = await import('../../lib/dbService')
        const ordersData = await orderService.getOrdersByUser(userId)
        
        if (ordersData && ordersData.length > 0) {
          const sortedOrders = ordersData.sort((a, b) => {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt)
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt)
            return dateB - dateA
          })
          setOrders(sortedOrders)
          return
        }
      } catch (dbError) {
        console.log('Database service not available, falling back to direct Firebase')
      }
      
      // Fallback to direct Firebase query
      const { collection, getDocs, query, where, orderBy } = await import('firebase/firestore')
      const { db } = await import('../../lib/firebase')
      
      // Try both customerId and userId fields for backward compatibility
      let ordersQuery = query(
        collection(db, 'orders'),
        where('customerId', '==', userId)
      )
      
      let ordersSnap = await getDocs(ordersQuery)
      
      // If no orders found with customerId, try userId field
      if (ordersSnap.empty) {
        ordersQuery = query(
          collection(db, 'orders'),
          where('userId', '==', userId)
        )
        ordersSnap = await getDocs(ordersQuery)
      }
      
      const ordersData = ordersSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(doc.data().createdAt)
      }))
      
      // Sort by creation date (newest first) in JavaScript
      const sortedOrders = ordersData.sort((a, b) => {
        const dateA = a.createdAt
        const dateB = b.createdAt
        return dateB - dateA
      })
      
      setOrders(sortedOrders)
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return '#3b82f6'
      case 'preparing': return '#f59e0b'
      case 'ready': return '#10b981'
      case 'dispatched': return '#8b5cf6'
      case 'delivered': return '#16a34a'
      case 'cancelled': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return '✓'
      case 'preparing': return '👨‍🍳'
      case 'ready': return '📦'
      case 'dispatched': return '🚚'
      case 'delivered': return '✅'
      case 'cancelled': return '❌'
      default: return '⏳'
    }
  }

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true
    if (filter === 'active') return !['delivered', 'cancelled'].includes(order.status?.toLowerCase())
    if (filter === 'completed') return ['delivered', 'cancelled'].includes(order.status?.toLowerCase())
    return true
  })

  const formatDate = (date) => {
    if (!date) return 'Unknown'
    const orderDate = date.toDate ? date.toDate() : new Date(date)
    return orderDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center', fontFamily: 'system-ui' }}>
        <div style={{ fontSize: '18px', color: '#6b7280' }}>Loading your orders...</div>
      </div>
    )
  }

  return (
    <>
      <SEOHead 
        title="My Orders | FreshCuts"
        description="Track your fresh meat orders and delivery status"
      />
      
      {/* Navigation */}
      <nav style={{
        backgroundColor: '#ffffff',
        padding: '12px 20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center'
        }}>
          <Link href="/customer/marketplace" style={{ 
            color: '#16a34a', 
            textDecoration: 'none', 
            fontSize: '24px', 
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {brandLogo ? (
              <img src={brandLogo} alt="FreshCuts Logo" style={{ 
                height: '40px', 
                objectFit: 'contain',
                verticalAlign: 'middle'
              }} />
            ) : (
              'FreshCuts'
            )}
          </Link>
        </div>
      </nav>

      <div style={{ padding: '40px 20px', paddingBottom: '100px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'system-ui' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>
            My Orders
          </h1>
          <p style={{ color: '#6b7280', fontSize: '16px', margin: '0' }}>
            Track your orders and delivery status
          </p>
        </div>

        {/* Filter Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          marginBottom: '30px',
          borderBottom: '1px solid #e5e7eb',
          paddingBottom: '16px'
        }}>
          {[
            { key: 'all', label: 'All Orders', count: orders.length },
            { key: 'active', label: 'Active', count: orders.filter(o => !['delivered', 'cancelled'].includes(o.status?.toLowerCase())).length },
            { key: 'completed', label: 'Completed', count: orders.filter(o => ['delivered', 'cancelled'].includes(o.status?.toLowerCase())).length }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              style={{
                padding: '8px 16px',
                backgroundColor: filter === tab.key ? '#16a34a' : 'transparent',
                color: filter === tab.key ? 'white' : '#6b7280',
                border: filter === tab.key ? 'none' : '1px solid #e5e7eb',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {tab.label}
              <span style={{
                backgroundColor: filter === tab.key ? 'rgba(255,255,255,0.2)' : '#f3f4f6',
                color: filter === tab.key ? 'white' : '#6b7280',
                padding: '2px 6px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: '#f9fafb',
            borderRadius: '16px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>📦</div>
            <h3 style={{ fontSize: '20px', color: '#374151', marginBottom: '8px', fontWeight: '600' }}>
              {filter === 'all' ? 'No orders yet' : `No ${filter} orders`}
            </h3>
            <p style={{ color: '#6b7280', fontSize: '16px', marginBottom: '20px' }}>
              {filter === 'all' 
                ? "Start shopping to see your orders here" 
                : `You don't have any ${filter} orders at the moment`
              }
            </p>
            <Link href="/customer/marketplace" style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#16a34a',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600'
            }}>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {filteredOrders.map(order => (
              <div key={order.id} style={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.2s'
              }}>
                {/* Order Header */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '20px',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '18px', color: '#1f2937', margin: '0', fontWeight: '700' }}>
                        Order #{order.id.substring(0, 8)}
                      </h3>
                      <div style={{
                        backgroundColor: getStatusColor(order.status) + '20',
                        color: getStatusColor(order.status),
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <span>{getStatusIcon(order.status)}</span>
                        {order.status || 'Processing'}
                      </div>
                    </div>
                    <div style={{ color: '#6b7280', fontSize: '14px' }}>
                      <div>{order.vendorName}</div>
                      <div>{formatDate(order.createdAt)}</div>
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: '#16a34a', marginBottom: '4px' }}>
                      ₹{order.total}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      {order.items?.length || 0} items
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '14px', color: '#374151', marginBottom: '12px', fontWeight: '600' }}>
                    Items Ordered:
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {order.items?.slice(0, 3).map((item, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 0',
                        borderBottom: index < Math.min(order.items.length, 3) - 1 ? '1px solid #f3f4f6' : 'none'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img 
                            src={item.imageUrl || 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=50&h=50&fit=crop'}
                            alt={item.name}
                            style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                              {item.name}
                            </div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>
                              Qty: {item.quantity} × ₹{item.price}
                            </div>
                          </div>
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                          ₹{item.price * item.quantity}
                        </div>
                      </div>
                    ))}
                    {order.items?.length > 3 && (
                      <div style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center', padding: '8px 0' }}>
                        +{order.items.length - 3} more items
                      </div>
                    )}
                  </div>
                </div>

                {/* Delivery Info */}
                <div style={{ 
                  backgroundColor: '#f8fafc', 
                  padding: '16px', 
                  borderRadius: '8px',
                  marginBottom: '20px'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', fontWeight: '600' }}>
                        DELIVERY OPTION
                      </div>
                      <div style={{ fontSize: '14px', color: '#374151', textTransform: 'capitalize' }}>
                        {order.deliveryOption === 'pickup' ? '🏪 Pickup' : 
                         order.deliveryOption === 'express' ? '⚡ Express Delivery' : '🚚 Home Delivery'}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', fontWeight: '600' }}>
                        TIME SLOT
                      </div>
                      <div style={{ fontSize: '14px', color: '#374151' }}>
                        {order.timeSlot || 'Not specified'}
                      </div>
                    </div>
                    {order.deliveryOption !== 'pickup' && (
                      <div>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', fontWeight: '600' }}>
                          DELIVERY ADDRESS
                        </div>
                        <div style={{ fontSize: '14px', color: '#374151' }}>
                          {order.address?.address?.substring(0, 50)}...
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Progress */}
                {order.statusHistory && order.statusHistory.length > 1 && (
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '14px', color: '#374151', marginBottom: '12px', fontWeight: '600' }}>
                      Order Progress:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {order.statusHistory.slice(-3).map((status, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          fontSize: '12px',
                          color: '#6b7280'
                        }}>
                          <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: getStatusColor(status.status)
                          }} />
                          <span style={{ textTransform: 'capitalize', fontWeight: '500' }}>
                            {status.status}
                          </span>
                          <span>•</span>
                          <span>
                            {new Date(status.timestamp).toLocaleString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          {status.note && (
                            <>
                              <span>•</span>
                              <span>{status.note}</span>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Order Actions */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {order.status?.toLowerCase() === 'delivered' && (
                    <button
                      onClick={async () => {
                        // Track reorder event
                        try {
                          const { analyticsService } = await import('../../lib/dbService')
                          analyticsService.trackEvent('reorder_clicked', currentUser.id, {
                            orderId: order.id,
                            vendorId: order.vendorId
                          })
                        } catch (error) {
                          console.log('Analytics not available')
                        }
                        // Implement reorder logic
                        alert('Reorder functionality coming soon!')
                      }}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#16a34a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Reorder
                    </button>
                  )}
                  
                  {!['delivered', 'cancelled'].includes(order.status?.toLowerCase()) && (
                    <button
                      onClick={async () => {
                        if (confirm('Are you sure you want to cancel this order?')) {
                          try {
                            const { orderService } = await import('../../lib/dbService')
                            await orderService.updateOrderStatus(order.id, 'cancelled', 'Cancelled by customer')
                            loadOrders(currentUser.id)
                          } catch (error) {
                            console.error('Error cancelling order:', error)
                            alert('Error cancelling order. Please try again.')
                          }
                        }
                      }}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: 'transparent',
                        color: '#ef4444',
                        border: '1px solid #ef4444',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel Order
                    </button>
                  )}
                  
                  <button
                    onClick={async () => {
                      // Track help request
                      try {
                        const { analyticsService } = await import('../../lib/dbService')
                        analyticsService.trackEvent('help_requested', currentUser.id, {
                          orderId: order.id,
                          orderStatus: order.status
                        })
                      } catch (error) {
                        console.log('Analytics not available')
                      }
                      alert('Help: Call +91-XXXXXXXXXX or email support@freshcuts.com')
                    }}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: 'transparent',
                      color: '#6b7280',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Need Help?
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Mobile Bottom Tab Bar */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e5e7eb',
        padding: '8px 0',
        zIndex: 100,
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
        display: window.innerWidth <= 768 ? 'block' : 'none'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          maxWidth: '400px',
          margin: '0 auto'
        }}>
          <Link href="/customer/marketplace" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            color: '#6b7280',
            padding: '8px',
            fontSize: '10px',
            gap: '4px'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/>
            </svg>
            Home
          </Link>
          
          <Link href="/customer/cart" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            color: '#6b7280',
            padding: '8px',
            fontSize: '10px',
            gap: '4px'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 18C5.9 18 5 18.9 5 20S5.9 22 7 22 9 21.1 9 20 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5H5.21L4.27 3H1M17 18C15.9 18 15 18.9 15 20S15.9 22 17 22 19 21.1 19 20 18.1 18 17 18Z"/>
            </svg>
            Cart
          </Link>
          
          <Link href="/customer/orders" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            color: '#16a34a',
            padding: '8px',
            fontSize: '10px',
            gap: '4px'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5,3C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19H5V5H12V3H5M17.78,4C17.61,4 17.43,4.07 17.3,4.2L16.08,5.41L18.58,7.91L19.8,6.7C20.06,6.44 20.06,6 19.8,5.75L18.25,4.2C18.12,4.07 17.95,4 17.78,4M15.37,6.12L8,13.5V16H10.5L17.87,8.62L15.37,6.12Z"/>
            </svg>
            Orders
          </Link>
          
          <Link href="/customer/profile" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            color: '#6b7280',
            padding: '8px',
            fontSize: '10px',
            gap: '4px'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5V9C15 10.1 14.1 11 13 11H11C9.9 11 9 10.1 9 9V7.5L3 7V9C3 10.1 3.9 11 5 11H7V20C7 21.1 7.9 22 9 22H15C16.1 22 17 21.1 17 20V11H19C20.1 11 21 10.1 21 9Z"/>
            </svg>
            Profile
          </Link>
        </div>
      </div>
    </>
  )
}