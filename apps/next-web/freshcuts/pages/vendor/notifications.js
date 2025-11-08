import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Navigation from '../../components/Navigation'
import SEOHead from '../../components/SEOHead'
import { getCurrentUser, logout, requireAuth } from '../../lib/auth'

export default function VendorNotifications() {
  const [mounted, setMounted] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [filter, setFilter] = useState('all') // 'all', 'unread', 'orders', 'system'
  const router = useRouter()

  useEffect(() => {
    const user = requireAuth(['vendor'])
    if (!user) return
    
    if (user.role !== 'vendor') {
      router.push('/unauthorized')
      return
    }
    
    setCurrentUser(user)
    setMounted(true)
    loadNotifications(user)
  }, [])

  const loadNotifications = async (user) => {
    try {
      const { collection, getDocs, query, where, orderBy } = await import('firebase/firestore')
      const { db } = await import('../../lib/firebase')
      
      // Load notifications for this vendor
      const notificationsRef = collection(db, 'notifications')
      const q = query(
        notificationsRef, 
        where('vendorId', '==', user.id),
        orderBy('createdAt', 'desc')
      )
      const notificationsSnap = await getDocs(q)
      
      if (!notificationsSnap.empty) {
        setNotifications(notificationsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      } else {
        // Create demo notifications if none exist
        createDemoNotifications(user)
      }
    } catch (error) {
      console.error('Error loading notifications:', error)
      // Create demo notifications on error
      createDemoNotifications(user)
    }
  }

  const createDemoNotifications = (user) => {
    const demoNotifications = [
      {
        id: '1',
        type: 'order',
        title: 'New Order Received',
        message: 'You have received a new order for ₹450. Order #12345',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        vendorId: user.id
      },
      {
        id: '2',
        type: 'system',
        title: 'Product Approved',
        message: 'Your product "Fresh Chicken Breast" has been approved and is now live.',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        vendorId: user.id
      },
      {
        id: '3',
        type: 'order',
        title: 'Order Delivered',
        message: 'Order #12340 has been successfully delivered to the customer.',
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        vendorId: user.id
      },
      {
        id: '4',
        type: 'system',
        title: 'Weekly Sales Report',
        message: 'Your weekly sales report is ready. Total sales: ₹12,450',
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        vendorId: user.id
      },
      {
        id: '5',
        type: 'system',
        title: 'Platform Update',
        message: 'New features have been added to the vendor dashboard. Check them out!',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
        vendorId: user.id
      }
    ]
    setNotifications(demoNotifications)
  }

  const markAsRead = async (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    )
    
    // In a real app, update the database
    try {
      const { doc, updateDoc } = await import('firebase/firestore')
      const { db } = await import('../../lib/firebase')
      
      await updateDoc(doc(db, 'notifications', notificationId), {
        read: true
      })
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    )
  }

  const deleteNotification = (notificationId) => {
    setNotifications(prev => 
      prev.filter(notif => notif.id !== notificationId)
    )
  }

  const getFilteredNotifications = () => {
    switch (filter) {
      case 'unread':
        return notifications.filter(n => !n.read)
      case 'orders':
        return notifications.filter(n => n.type === 'order')
      case 'system':
        return notifications.filter(n => n.type === 'system')
      default:
        return notifications
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return '🛒'
      case 'system':
        return '🔔'
      default:
        return '📢'
    }
  }

  const formatTime = (date) => {
    const now = new Date()
    const diff = now - new Date(date)
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  if (!mounted) {
    return <div style={{ padding: '20px' }}>Loading...</div>
  }

  const filteredNotifications = getFilteredNotifications()
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <>
      <SEOHead 
        title="Notifications | FreshCuts Vendor"
        description="View your vendor notifications and updates"
        url="https://freshcuts.com/vendor/notifications"
      />
      <Navigation />
      <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ color: '#16a34a', fontSize: '32px', margin: '0' }}>Notifications</h1>
            {unreadCount > 0 && (
              <p style={{ color: '#dc2626', fontSize: '14px', margin: '5px 0 0 0' }}>
                {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
              </p>
            )}
          </div>

        </div>

        {/* Filter Tabs */}
        <div style={{ marginBottom: '20px', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            {[
              { key: 'all', label: 'All', count: notifications.length },
              { key: 'unread', label: 'Unread', count: unreadCount },
              { key: 'orders', label: 'Orders', count: notifications.filter(n => n.type === 'order').length },
              { key: 'system', label: 'System', count: notifications.filter(n => n.type === 'system').length }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                style={{
                  padding: '10px 0',
                  backgroundColor: 'transparent',
                  color: filter === tab.key ? '#16a34a' : '#6b7280',
                  border: 'none',
                  borderBottom: filter === tab.key ? '2px solid #16a34a' : '2px solid transparent',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        {unreadCount > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <button
              onClick={markAllAsRead}
              style={{
                padding: '8px 16px',
                backgroundColor: '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Mark All as Read
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          {filteredNotifications.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
              <p>No notifications found.</p>
            </div>
          ) : (
            filteredNotifications.map(notification => (
              <div
                key={notification.id}
                style={{
                  padding: '20px',
                  borderBottom: '1px solid #f3f4f6',
                  backgroundColor: notification.read ? 'white' : '#f0f9ff',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '15px'
                }}
              >
                <div style={{ fontSize: '24px', marginTop: '5px' }}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 style={{ 
                      color: '#374151', 
                      fontSize: '16px', 
                      margin: '0',
                      fontWeight: notification.read ? '400' : '600'
                    }}>
                      {notification.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: '#9ca3af', fontSize: '12px' }}>
                        {formatTime(notification.createdAt)}
                      </span>
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: '#dc2626',
                          cursor: 'pointer',
                          fontSize: '16px',
                          padding: '2px'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  <p style={{ 
                    color: '#6b7280', 
                    fontSize: '14px', 
                    margin: '0 0 10px 0',
                    lineHeight: '1.5'
                  }}>
                    {notification.message}
                  </p>
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#16a34a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}