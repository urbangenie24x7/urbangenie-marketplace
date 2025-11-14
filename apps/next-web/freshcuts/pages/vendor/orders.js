import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import SEOHead from '../../components/SEOHead'

export default function VendorOrders() {
  const router = useRouter()
  const [currentVendor, setCurrentVendor] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const vendor = JSON.parse(localStorage.getItem('currentVendor') || 'null')
    if (!vendor) {
      router.push('/vendor/login')
      return
    }
    setCurrentVendor(vendor)
    loadOrders(vendor.id)
  }, [])

  const loadOrders = async (vendorId) => {
    try {
      const { collection, getDocs, query, where, orderBy } = await import('firebase/firestore')
      const { db } = await import('../../lib/firebase')
      
      const ordersQuery = query(
        collection(db, 'orders'),
        where('vendorId', '==', vendorId),
        orderBy('createdAt', 'desc')
      )
      
      const ordersSnap = await getDocs(ordersQuery)
      const orderData = ordersSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }))
      
      setOrders(orderData)
      setLoading(false)
    } catch (error) {
      console.error('Error loading orders:', error)
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { doc, updateDoc } = await import('firebase/firestore')
      const { db } = await import('../../lib/firebase')
      
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
        updatedAt: new Date()
      })
      
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ))
      
      alert(`Order ${newStatus.toLowerCase()} successfully!`)
    } catch (error) {
      console.error('Error updating order:', error)
      alert('Error updating order status')
    }
  }

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true
    return order.status.toLowerCase() === filter
  })

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading orders...</div>
  }

  return (
    <>
      <SEOHead 
        title="Vendor Orders | FreshCuts"
        description="Manage your orders and deliveries"
      />
      
      {/* Navigation */}
      <nav style={{
        backgroundColor: '#ffffff',
        padding: '12px 20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/vendor/dashboard" style={{ 
            color: '#16a34a', 
            textDecoration: 'none', 
            fontSize: '24px', 
            fontWeight: '700'
          }}>
            FreshCuts Vendor
          </Link>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <span style={{ color: '#374151' }}>{currentVendor?.name}</span>
            <Link href="/vendor/orders" style={{ color: '#16a34a', textDecoration: 'none', fontWeight: '600' }}>Orders</Link>
            <Link href="/vendor/dashboard" style={{ color: '#374151', textDecoration: 'none' }}>Dashboard</Link>
          </div>
        </div>
      </nav>

      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#374151', fontSize: '32px', margin: '0' }}>Orders</h1>
          
          {/* Filter Buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            {['all', 'confirmed', 'preparing', 'ready', 'delivered'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: filter === status ? '#16a34a' : '#f3f4f6',
                  color: filter === status ? 'white' : '#374151',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  fontSize: '14px'
                }}
              >
                {status} ({orders.filter(o => status === 'all' || o.status.toLowerCase() === status).length})
              </button>
            ))}
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: '#f9fafb',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>📦</div>
            <h2 style={{ color: '#374151', marginBottom: '10px' }}>No {filter === 'all' ? '' : filter} orders</h2>
            <p style={{ color: '#6b7280' }}>Orders will appear here when customers place them</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {filteredOrders.map(order => (
              <div key={order.id} style={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div>
                    <h2 style={{ fontSize: '20px', color: '#374151', margin: '0 0 5px 0' }}>
                      Order #{order.id.substring(0, 8)}
                    </h2>
                    <p style={{ color: '#6b7280', fontSize: '14px', margin: '0' }}>
                      {order.createdAt?.toLocaleString()} • {order.deliveryOption}
                    </p>
                  </div>
                  <div style={{
                    backgroundColor: order.status === 'Confirmed' ? '#fef3c7' : 
                                   order.status === 'Preparing' ? '#dbeafe' :
                                   order.status === 'Ready' ? '#dcfce7' : '#f3f4f6',
                    color: order.status === 'Confirmed' ? '#92400e' : 
                           order.status === 'Preparing' ? '#1e40af' :
                           order.status === 'Ready' ? '#166534' : '#374151',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {order.status}
                  </div>
                </div>

                {/* Customer Info */}
                <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                  <h3 style={{ fontSize: '16px', color: '#374151', marginBottom: '10px' }}>Customer Details:</h3>
                  <p style={{ margin: '0', fontSize: '14px', color: '#6b7280' }}>
                    <strong>Address:</strong> {order.address?.address}<br/>
                    <strong>Email:</strong> {order.email}<br/>
                    <strong>Time Slot:</strong> {order.timeSlot}
                  </p>
                </div>

                {/* Items */}
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '16px', color: '#374151', marginBottom: '10px' }}>Items:</h3>
                  {order.items?.map(item => (
                    <div key={item.id} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '8px 0',
                      borderBottom: '1px solid #f3f4f6'
                    }}>
                      <span>{item.name} × {item.quantity}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Order Total */}
                <div style={{ marginBottom: '20px', borderTop: '1px solid #e5e7eb', paddingTop: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '700', color: '#16a34a' }}>
                    <span>Total:</span>
                    <span>₹{order.total}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {order.status === 'Confirmed' && (
                    <>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Preparing')}
                        style={{
                          padding: '10px 20px',
                          backgroundColor: '#16a34a',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        Accept & Start Preparing
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Rejected')}
                        style={{
                          padding: '10px 20px',
                          backgroundColor: '#dc2626',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        Reject Order
                      </button>
                    </>
                  )}
                  
                  {order.status === 'Preparing' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'Ready')}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#16a34a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Mark as Ready
                    </button>
                  )}
                  
                  {order.status === 'Ready' && order.deliveryOption === 'pickup' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'Delivered')}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#16a34a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Mark as Picked Up
                    </button>
                  )}
                  
                  {order.status === 'Ready' && order.deliveryOption !== 'pickup' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'Out for Delivery')}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#f59e0b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Send for Delivery
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}