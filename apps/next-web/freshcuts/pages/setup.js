import { useState } from 'react'
import Navigation from '../components/Navigation'
import SEOHead from '../components/SEOHead'

export default function Setup() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const seedDatabase = async () => {
    setLoading(true)
    setMessage('')
    
    try {
      const { seedTestData } = await import('../lib/seedData')
      const result = await seedTestData()
      
      if (result) {
        setMessage('✅ Database seeded successfully! Demo accounts created.')
      } else {
        setMessage('❌ Failed to seed database. Check console for errors.')
      }
    } catch (error) {
      console.error('Seed error:', error)
      setMessage('❌ Error seeding database: ' + error.message)
    }
    
    setLoading(false)
  }

  return (
    <>
      <SEOHead 
        title="Setup | FreshCuts"
        description="Setup FreshCuts database"
        url="https://freshcuts.com/setup"
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
          width: '100%',
          maxWidth: '500px',
          textAlign: 'center'
        }}>
          <h1 style={{ color: '#16a34a', fontSize: '28px', marginBottom: '20px' }}>
            FreshCuts Setup
          </h1>
          
          <p style={{ color: '#6b7280', marginBottom: '30px' }}>
            Click the button below to seed the database with demo data and create test accounts.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
            <button
              onClick={seedDatabase}
              disabled={loading}
              style={{
                flex: 1,
                padding: '15px',
                backgroundColor: loading ? '#9ca3af' : '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Seeding...' : 'Seed Database'}
            </button>
            
            <button
              onClick={async () => {
                setLoading(true)
                setMessage('')
                try {
                  const { createVendorUsers } = await import('../lib/createVendorUsers')
                  const result = await createVendorUsers()
                  
                  if (result.success) {
                    setMessage(`✅ ${result.message}\n\nCreated accounts:\n${result.accounts.map(acc => `${acc.name}:\n  Phone: ${acc.phone}\n  Email: ${acc.email}`).join('\n\n')}`)
                  } else {
                    setMessage(`❌ ${result.message}`)
                  }
                } catch (error) {
                  setMessage('❌ Error: ' + error.message)
                }
                setLoading(false)
              }}
              disabled={loading}
              style={{
                flex: 1,
                padding: '15px',
                backgroundColor: loading ? '#9ca3af' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Creating...' : 'Create User Accounts'}
            </button>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <button
              onClick={async () => {
                if (!confirm('This will DELETE ALL vendors and recreate them. Continue?')) return
                setLoading(true)
                setMessage('')
                try {
                  const { resetVendorDatabase } = await import('../lib/resetVendors')
                  const result = await resetVendorDatabase()
                  
                  if (result.success) {
                    setMessage(`✅ ${result.message}`)
                  } else {
                    setMessage(`❌ ${result.message}`)
                  }
                } catch (error) {
                  setMessage('❌ Error: ' + error.message)
                }
                setLoading(false)
              }}
              disabled={loading}
              style={{
                width: '100%',
                padding: '15px',
                backgroundColor: loading ? '#9ca3af' : '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Resetting...' : 'Reset Vendor Database'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
            <button
              onClick={async () => {
                setLoading(true)
                setMessage('')
                try {
                  const { listAllUsers } = await import('../lib/cleanupUsers')
                  const result = await listAllUsers()
                  
                  if (result.success) {
                    setMessage(`✅ ${result.message}`)
                  } else {
                    setMessage(`❌ ${result.message}`)
                  }
                } catch (error) {
                  setMessage('❌ Error: ' + error.message)
                }
                setLoading(false)
              }}
              disabled={loading}
              style={{
                padding: '15px',
                backgroundColor: loading ? '#9ca3af' : '#8b5cf6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Loading...' : 'List All Users'}
            </button>
            
            <button
              onClick={async () => {
                if (!confirm('This will remove duplicate users. Continue?')) return
                setLoading(true)
                setMessage('')
                try {
                  const { cleanupDuplicateUsers } = await import('../lib/cleanupUsers')
                  const result = await cleanupDuplicateUsers()
                  
                  if (result.success) {
                    setMessage(`✅ ${result.message}`)
                  } else {
                    setMessage(`❌ ${result.message}`)
                  }
                } catch (error) {
                  setMessage('❌ Error: ' + error.message)
                }
                setLoading(false)
              }}
              disabled={loading}
              style={{
                padding: '15px',
                backgroundColor: loading ? '#9ca3af' : '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Cleaning...' : 'Remove Duplicates'}
            </button>
          </div>

          {message && (
            <div style={{
              padding: '15px',
              borderRadius: '8px',
              backgroundColor: message.includes('✅') ? '#f0f9ff' : '#fef2f2',
              border: `1px solid ${message.includes('✅') ? '#bfdbfe' : '#fecaca'}`,
              color: message.includes('✅') ? '#1e40af' : '#dc2626',
              fontSize: '14px',
              marginBottom: '20px',
              whiteSpace: 'pre-line',
              textAlign: 'left'
            }}>
              {message}
            </div>
          )}

          <div style={{ 
            padding: '20px', 
            backgroundColor: '#f9fafb', 
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            textAlign: 'left'
          }}>
            <h3 style={{ color: '#374151', fontSize: '16px', marginBottom: '15px' }}>
              Demo Accounts (after seeding):
            </h3>
            <div style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>
              <p><strong>Demo Accounts:</strong></p>
              <p>Super Admin: +919876543210 (admin@freshcuts.com)</p>
              <p>Vertical Admin: +919876543212 (vertical@freshcuts.com)</p>
              <p>Vendors: Generated phone numbers with emails</p>
              <p style={{ fontSize: '12px', fontStyle: 'italic' }}>Login: Phone + OTP | Email: For invoices & communications</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}