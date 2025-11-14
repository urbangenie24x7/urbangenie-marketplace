import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import SEOHead from '../../components/SEOHead'
import { sendOrderConfirmationSMS } from '../../lib/smsService'

export default function OrderConfirmation() {
  const router = useRouter()
  const { orderIds } = router.query
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [brandLogo, setBrandLogo] = useState('')

  useEffect(() => {
    const { parentOrderId } = router.query
    if (parentOrderId) {
      loadOrders(null, parentOrderId)
      loadBrandSettings()
    } else if (orderIds) {
      loadOrders(orderIds.split(','))
      loadBrandSettings()
    }
  }, [router.query])

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

  const loadOrders = async (orderIdList, parentOrderId = null) => {
    try {
      const { doc, getDoc } = await import('firebase/firestore')
      const { db } = await import('../../lib/firebase')
      
      let orderData = []
      
      if (parentOrderId) {
        // Load parent order info
        const parentOrderDoc = await getDoc(doc(db, 'parentOrders', parentOrderId))
        if (parentOrderDoc.exists()) {
          const parentOrder = parentOrderDoc.data()
          
          // Load all vendor orders
          const orderPromises = parentOrder.vendorOrders.map(id => getDoc(doc(db, 'orders', id)))
          const orderDocs = await Promise.all(orderPromises)
          
          orderData = orderDocs
            .filter(doc => doc.exists())
            .map(doc => ({
              id: doc.id,
              ...doc.data(),
              createdAt: doc.data().createdAt?.toDate(),
              parentOrderId: parentOrderId
            }))
        }
      } else if (orderIdList) {
        // Fallback to individual order loading
        const orderPromises = orderIdList.map(id => getDoc(doc(db, 'orders', id)))
        const orderDocs = await Promise.all(orderPromises)
        
        orderData = orderDocs
          .filter(doc => doc.exists())
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate()
          }))
      }
      
      setOrders(orderData)
      setLoading(false)
      
      // Send SMS confirmations
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
      if (currentUser.phone && orderData.length > 0) {
        orderData.forEach(order => {
          sendOrderConfirmationSMS(currentUser.phone, {
            orderId: order.id,
            vendorName: order.vendorName,
            total: order.total,
            timeSlot: order.timeSlot
          })
        })
      }
    } catch (error) {
      console.error('Error loading orders:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
  }

  if (orders.length === 0) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center', fontFamily: 'system-ui' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
        <h1 style={{ color: '#dc2626', fontSize: '24px', marginBottom: '10px' }}>Orders Not Found</h1>
        <p style={{ color: '#6b7280', marginBottom: '20px' }}>The orders you're looking for could not be found.</p>
        <Link href="/customer/marketplace" style={{
          display: 'inline-block',
          padding: '12px 24px',
          backgroundColor: '#16a34a',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '8px',
          fontWeight: '600'
        }}>
          Back to Shopping
        </Link>
      </div>
    )
  }

  return (
    <>
      <SEOHead 
        title="Order Confirmed | FreshCuts"
        description="Your order has been confirmed successfully"
      />
      
      {/* Navigation */}
      <nav style={{
        backgroundColor: '#ffffff',
        padding: '12px 20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center' }}>
          <Link href="/customer/marketplace" style={{ 
            color: '#16a34a', 
            textDecoration: 'none', 
            fontSize: '24px', 
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center'
          }}>
            {brandLogo ? (
              <img src={brandLogo} alt="FreshCuts Logo" style={{ height: '40px', objectFit: 'contain' }} />
            ) : (
              'FreshCuts'
            )}
          </Link>
        </div>
      </nav>

      <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'system-ui' }}>
        {/* Success Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
          <h1 style={{ color: '#16a34a', fontSize: '32px', marginBottom: '10px' }}>Order Confirmed!</h1>
          <p style={{ color: '#6b7280', fontSize: '18px' }}>
            Thank you for your order. We've sent confirmation details to your phone and email.
          </p>
        </div>

        {/* Order Details */}
        {orders.map(order => (
          <div key={order.id} style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '20px', color: '#374151', margin: '0 0 5px 0' }}>
                  Order #{order.id.substring(0, 8)}
                </h2>
                <p style={{ color: '#6b7280', fontSize: '14px', margin: '0' }}>
                  {order.vendorName} • {order.createdAt?.toLocaleString()}
                </p>
              </div>
              <div style={{
                backgroundColor: '#dcfce7',
                color: '#166534',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {order.status}
              </div>
            </div>

            {/* Items */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', color: '#374151', marginBottom: '10px' }}>Items Ordered:</h3>
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

            {/* Delivery Details */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', color: '#374151', marginBottom: '10px' }}>Delivery Details:</h3>
              <p style={{ color: '#6b7280', fontSize: '14px', margin: '0' }}>
                <strong>Address:</strong> {order.address?.address}<br/>
                <strong>Delivery Option:</strong> {order.deliveryOption}<br/>
                <strong>Time Slot:</strong> {order.timeSlot}
              </p>
            </div>

            {/* Order Summary */}
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>Items Total:</span>
                <span>₹{order.itemsTotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>Delivery Charges:</span>
                <span>{order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>Tax:</span>
                <span>₹{order.tax}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '700', color: '#16a34a' }}>
                <span>Total Paid:</span>
                <span>₹{order.total}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Action Buttons */}
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/customer/orders" style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#16a34a',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600'
            }}>
              Track Orders
            </Link>
            <Link href="/customer/marketplace" style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600'
            }}>
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Help Section */}
        <div style={{
          backgroundColor: '#f0f9ff',
          padding: '20px',
          borderRadius: '12px',
          marginTop: '30px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#0369a1', fontSize: '18px', marginBottom: '10px' }}>Need Help?</h3>
          <p style={{ color: '#0369a1', fontSize: '14px', margin: '0' }}>
            Contact us at <strong>+91-XXXXXXXXXX</strong> or email <strong>support@freshcuts.com</strong>
          </p>
        </div>
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
            maxWidth: '400px',
            margin: '0 auto'
          }}>
            <Link href="/customer/marketplace" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              color: '#6b7280',
              padding: '8px'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/>
              </svg>
            </Link>
            
            <Link href="/customer/orders" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              color: '#16a34a',
              padding: '8px'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5,3C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19H5V5H12V3H5M17.78,4C17.61,4 17.43,4.07 17.3,4.2L16.08,5.41L18.58,7.91L19.8,6.7C20.06,6.44 20.06,6 19.8,5.75L18.25,4.2C18.12,4.07 17.95,4 17.78,4M15.37,6.12L8,13.5V16H10.5L17.87,8.62L15.37,6.12Z"/>
              </svg>
            </Link>
          </div>
        </div>
      )}
    </>
  )
}