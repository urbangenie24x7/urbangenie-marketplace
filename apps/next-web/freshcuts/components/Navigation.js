import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getCurrentUser, logout } from '../lib/auth'

export default function Navigation() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    setUser(getCurrentUser())
  }, [])

  return (
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
        <Link href="/" style={{ 
          color: 'white', 
          textDecoration: 'none', 
          fontSize: '20px', 
          fontWeight: 'bold' 
        }}>
          FreshCuts
        </Link>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {user ? (
            <>
              {user.role === 'customer' && (
                <Link href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '20px' }}>
                  🛒
                </Link>
              )}
              {user.role === 'vendor' && (
                <Link href="/vendor/dashboard" style={{ color: 'white', textDecoration: 'none', fontSize: '20px' }}>
                  🏠
                </Link>
              )}
              {(user.role === 'admin' || user.role === 'super_admin') && (
                <Link href="/admin/dashboard" style={{ color: 'white', textDecoration: 'none', fontSize: '20px' }}>
                  ⚙️
                </Link>
              )}
              <Link href={`/${user.role}/notifications`} style={{ color: 'white', textDecoration: 'none', fontSize: '20px' }}>
                🔔
              </Link>
              <Link href={`/${user.role}/profile`} style={{ color: 'white', textDecoration: 'none', fontSize: '20px' }}>
                👤
              </Link>
              <button
                onClick={logout}
                style={{
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: '1px solid white',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '20px' }}>
                🛒
              </Link>
              <Link href="/login" style={{
                color: 'white',
                textDecoration: 'none',
                fontSize: '14px',
                border: '1px solid white',
                borderRadius: '4px',
                padding: '4px 8px'
              }}>
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}