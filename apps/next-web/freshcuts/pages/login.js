import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Login() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      const user = JSON.parse(currentUser)
      if (user.role === 'admin' || user.role === 'super_admin') {
        router.push('/admin/dashboard')
      } else if (user.role === 'vendor') {
        router.push('/vendor/dashboard')
      } else {
        router.push('/')
      }
    } else {
      // Redirect to customer login by default
      router.push('/customer/login')
    }
  }, [])

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center'
    }}>
      <div style={{ textAlign: 'center', color: 'white' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(255, 255, 255, 0.3)',
          borderTop: '3px solid white',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px'
        }} />
        <p style={{ fontSize: '16px', fontWeight: '500' }}>Redirecting to login...</p>
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}