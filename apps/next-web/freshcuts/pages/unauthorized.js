import { useRouter } from 'next/router'
import Navigation from '../components/Navigation'
import SEOHead from '../components/SEOHead'

export default function Unauthorized() {
  const router = useRouter()

  return (
    <>
      <SEOHead 
        title="Unauthorized | FreshCuts"
        description="Access denied"
        url="https://freshcuts.com/unauthorized"
      />
      <Navigation />
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f9fafb',
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🚫</div>
          <h1 style={{ color: '#dc2626', fontSize: '24px', marginBottom: '12px' }}>
            Access Denied
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>
            You don't have permission to access this page.
          </p>
          <button
            onClick={() => router.push('/')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#16a34a',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    </>
  )
}