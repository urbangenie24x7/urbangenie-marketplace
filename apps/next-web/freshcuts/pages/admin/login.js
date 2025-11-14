import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import OTPLogin from '../../components/OTPLogin'

export default function AdminLogin() {
  const router = useRouter()

  useEffect(() => {
    // Check if admin is already logged in
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      const user = JSON.parse(currentUser)
      if (user.role === 'admin' || user.role === 'super_admin') {
        router.push('/admin/dashboard')
      }
    }
  }, [])

  const handleLogin = (user) => {
    router.push('/admin/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%', maxWidth: '500px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <img 
            src="https://res.cloudinary.com/dwxk3blcb/image/upload/v1762799836/freshcuts/logos/t5u5oj5d8rsltoeexxka.png" 
            alt="FreshCuts Logo"
            style={{ height: '52px', objectFit: 'contain', marginBottom: '16px' }}
          />
          <p style={{ color: '#6b7280', fontSize: '16px' }}>Admin Portal</p>
        </div>

        <OTPLogin onLogin={handleLogin} userType="admin" />
        
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#6b7280' }}>
          Authorized personnel only. All activities are logged.
        </div>
      </div>
    </div>
  )
}