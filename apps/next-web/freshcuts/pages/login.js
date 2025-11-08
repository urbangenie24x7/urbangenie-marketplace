import { useState } from 'react'
import { useRouter } from 'next/router'
import Navigation from '../components/Navigation'
import SEOHead from '../components/SEOHead'

export default function Login() {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState('phone') // 'phone' or 'otp'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [generatedOtp, setGeneratedOtp] = useState('')
  const router = useRouter()

  const sendOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { collection, query, where, getDocs } = await import('firebase/firestore')
      const { db } = await import('../lib/firebase')
      
      // Check if phone exists in users collection
      const usersRef = collection(db, 'users')
      const q = query(usersRef, where('phone', '==', phone))
      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.empty) {
        setError('Phone number not registered')
        setLoading(false)
        return
      }
      
      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString()
      setGeneratedOtp(otp)
      
      // In production, send OTP via SMS service
      console.log('OTP for', phone, ':', otp)
      alert(`OTP sent to ${phone}: ${otp}`) // Demo only
      
      setStep('otp')
      
    } catch (error) {
      console.error('OTP send error:', error)
      setError('Failed to send OTP. Please try again.')
    }
    
    setLoading(false)
  }

  const verifyOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (otp !== generatedOtp) {
        setError('Invalid OTP')
        setLoading(false)
        return
      }

      const { collection, query, where, getDocs } = await import('firebase/firestore')
      const { db } = await import('../lib/firebase')
      
      // Get user data
      const usersRef = collection(db, 'users')
      const q = query(usersRef, where('phone', '==', phone))
      const querySnapshot = await getDocs(q)
      
      const userData = querySnapshot.docs[0].data()
      const userId = querySnapshot.docs[0].id
      
      // Store user data in localStorage
      const userSession = {
        id: userId,
        phone: userData.phone,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        verticals: userData.verticals || [],
        shopName: userData.shopName || null
      }
      
      localStorage.setItem('currentUser', JSON.stringify(userSession))
      
      // Redirect based on role
      if (userData.role === 'super_admin' || userData.role === 'admin') {
        router.push('/admin/dashboard')
      } else if (userData.role === 'vendor') {
        router.push('/vendor/dashboard')
      } else {
        router.push('/')
      }
      
    } catch (error) {
      console.error('OTP verify error:', error)
      setError('Verification failed. Please try again.')
    }
    
    setLoading(false)
  }

  return (
    <>
      <SEOHead 
        title="Login | FreshCuts"
        description="Login to access your FreshCuts dashboard"
        url="https://freshcuts.com/login"
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
          maxWidth: '400px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{ color: '#16a34a', fontSize: '28px', margin: '0 0 8px 0' }}>
              FreshCuts Login
            </h1>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>
              Access your dashboard
            </p>
          </div>

          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={step === 'phone' ? sendOtp : verifyOtp}>
            {step === 'phone' ? (
              <div style={{ marginBottom: '30px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontSize: '14px', 
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Enter your phone number"
                />
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '15px', textAlign: 'center' }}>
                  <p style={{ color: '#6b7280', fontSize: '14px' }}>
                    OTP sent to {phone}
                  </p>
                  <button
                    type="button"
                    onClick={() => setStep('phone')}
                    style={{
                      color: '#16a34a',
                      background: 'none',
                      border: 'none',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Change number
                  </button>
                </div>
                <div style={{ marginBottom: '30px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '6px', 
                    fontSize: '14px', 
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength="6"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '16px',
                      boxSizing: 'border-box',
                      textAlign: 'center',
                      letterSpacing: '2px'
                    }}
                    placeholder="Enter 6-digit OTP"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: loading ? '#9ca3af' : '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? (step === 'phone' ? 'Sending OTP...' : 'Verifying...') : (step === 'phone' ? 'Send OTP' : 'Verify OTP')}
            </button>
          </form>

          <div style={{ 
            marginTop: '30px', 
            padding: '20px', 
            backgroundColor: '#f9fafb', 
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ color: '#374151', fontSize: '14px', marginBottom: '12px', fontWeight: '500' }}>
              Demo Accounts:
            </h3>
            <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.5', marginBottom: '15px' }}>
              <p><strong>Demo Phone Numbers:</strong></p>
              <p>Super Admin: +919876543210</p>
              <p>Vendor: +919876543211</p>
              <p>Vendor (Lakshmi): +919876543212</p>
              <p>Admin: Check database or create via setup</p>
            </div>
            <div style={{ 
              padding: '10px', 
              backgroundColor: '#fef3c7', 
              borderRadius: '6px',
              border: '1px solid #fbbf24',
              fontSize: '12px',
              color: '#92400e'
            }}>
              <strong>First time?</strong> <a href="/setup" style={{ color: '#16a34a', textDecoration: 'underline' }}>Setup database</a> to create demo accounts.
            </div>
          </div>
        </div>
      </div>
    </>
  )
}