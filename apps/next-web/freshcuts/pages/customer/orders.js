import Link from 'next/link'
import { useCart } from '../../lib/CartContext'
import SEOHead from '../../components/SEOHead'

export default function CustomerOrders() {
  const { getCartCount } = useCart()
  return (
    <>
      <SEOHead 
        title="My Orders - Order History | FreshCuts"
        description="Track your fresh meat orders. View order history, delivery status and reorder your favorite products from local vendors."
        url="https://freshcuts.com/orders"
      />
      {/* Customer Navigation Bar */}
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
            <Link href="/customer/cart" style={{ color: 'white', textDecoration: 'none', fontSize: '20px', position: 'relative' }}>
              🛒
              {getCartCount() > 0 && (
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
                  {getCartCount()}
                </span>
              )}
            </Link>
            <Link href="/customer/orders" style={{ color: 'white', textDecoration: 'none', fontSize: '20px' }}>
              📦
            </Link>
          </div>
        </div>
      </nav>
      
      <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ color: '#16a34a', fontSize: '32px', marginBottom: '20px' }}>My Orders</h1>
        
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          backgroundColor: '#f9fafb',
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>📦</div>
          <h2 style={{ color: '#374151', marginBottom: '10px' }}>No orders yet</h2>
          <p style={{ color: '#6b7280', marginBottom: '20px' }}>Your order history will appear here once you place your first order.</p>
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
      </div>
    </>
  )
}