import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import OTPLogin from '../../components/OTPLogin'

export default function VendorLogin() {
  const router = useRouter()

  useEffect(() => {
    // Check if vendor is already logged in
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      const user = JSON.parse(currentUser)
      if (user.role === 'vendor') {
        router.push('/vendor/dashboard')
      }
    }
  }, [])

  const handleLogin = (user) => {
    router.push('/vendor/dashboard')
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#ffffff',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px'
    }}>
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: '32px 40px', 
        borderRadius: '24px', 
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        width: '100%', 
        maxWidth: '420px',
        position: 'relative',
        backdropFilter: 'blur(10px)'
      }}>
        
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '140px',
            height: '140px',
            backgroundColor: '#f8fafc',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}>
            <img 
              src="https://res.cloudinary.com/dwxk3blcb/image/upload/v1762799836/freshcuts/logos/t5u5oj5d8rsltoeexxka.png" 
              alt="FreshCuts Logo"
              style={{ height: '100px', objectFit: 'contain' }}
            />
          </div>
          <p style={{ 
            color: '#6b7280', 
            fontSize: '14px', 
            fontWeight: '400',
            lineHeight: '1.4'
          }}>Vendor Portal</p>
        </div>

        <OTPLogin onLogin={handleLogin} userType="vendor" />
        
        {/* Footer */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '32px', 
          paddingTop: '24px',
          borderTop: '1px solid #f3f4f6'
        }}>
          <p style={{ 
            fontSize: '12px', 
            color: '#9ca3af',
            lineHeight: '1.5',
            margin: '0'
          }}>
            For vendor support, contact: support@freshcuts.com
          </p>
        </div>
      </div>
    </div>
  )
}