import { useState } from 'react'

export default function CheckoutAuth({ onAuthSuccess, onCancel }) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: ''
  })
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState('details') // 'details' or 'otp'
  const [generatedOtp, setGeneratedOtp] = useState('')
  const [loading, setLoading] = useState(false)

  const sendOtp = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { collection, getDocs, query, where } = await import('firebase/firestore')
      const { db } = await import('../lib/firebase')

      if (isLogin) {
        // Check if customer exists
        const usersQuery = query(
          collection(db, 'users'), 
          where('phone', '==', formData.phone),
          where('role', '==', 'customer')
        )
        const userSnap = await getDocs(usersQuery)
        
        if (userSnap.empty) {
          alert('Account not found. Please sign up.')
          setLoading(false)
          return
        }
      } else {
        // Check if customer already exists
        const usersQuery = query(
          collection(db, 'users'), 
          where('phone', '==', formData.phone)
        )
        const existingUser = await getDocs(usersQuery)
        
        if (!existingUser.empty) {
          alert('Account already exists. Please login instead.')
          setIsLogin(true)
          setLoading(false)
          return
        }
      }

      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString()
      setGeneratedOtp(otp)
      
      console.log('OTP for', formData.phone, ':', otp)
      alert(`OTP sent to ${formData.phone}: ${otp}`)
      
      setStep('otp')
    } catch (error) {
      alert('Error: ' + error.message)
    }
    
    setLoading(false)
  }

  const verifyOtp = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (otp !== generatedOtp) {
        alert('Invalid OTP')
        setLoading(false)
        return
      }

      const { collection, getDocs, addDoc, query, where, serverTimestamp } = await import('firebase/firestore')
      const { db } = await import('../lib/firebase')

      if (isLogin) {
        // Login existing customer
        const usersQuery = query(
          collection(db, 'users'), 
          where('phone', '==', formData.phone),
          where('role', '==', 'customer')
        )
        const userSnap = await getDocs(usersQuery)
        const userData = { id: userSnap.docs[0].id, ...userSnap.docs[0].data() }
        localStorage.setItem('currentUser', JSON.stringify(userData))
        onAuthSuccess(userData)
      } else {
        // Create new customer account
        const newUser = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: 'customer',
          createdAt: serverTimestamp()
        }

        const docRef = await addDoc(collection(db, 'users'), newUser)
        const userData = { id: docRef.id, ...newUser }
        localStorage.setItem('currentUser', JSON.stringify(userData))
        onAuthSuccess(userData)
      }
    } catch (error) {
      alert('Error: ' + error.message)
    }
    
    setLoading(false)
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        width: '400px',
        maxWidth: '90vw'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#16a34a', fontSize: '24px', marginBottom: '8px' }}>
            {isLogin ? 'Login to Continue' : 'Create Account'}
          </h2>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            {isLogin ? 'Please login to complete your order' : 'Sign up to place your order'}
          </p>
        </div>

        <form onSubmit={step === 'details' ? sendOtp : verifyOtp}>
          {step === 'details' ? (
            <>
              {!isLogin && (
                <>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      marginBottom: '15px',
                      fontSize: '14px'
                    }}
                  />
                  <input
                    type="email"
                    placeholder="Email (for invoices & updates)"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      marginBottom: '15px',
                      fontSize: '14px'
                    }}
                  />
                </>
              )}
              
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  marginBottom: '20px',
                  fontSize: '14px'
                }}
              />
            </>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>
                  OTP sent to {formData.phone}
                </p>
                <button
                  type="button"
                  onClick={() => setStep('details')}
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
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength="6"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  marginBottom: '20px',
                  fontSize: '14px',
                  textAlign: 'center',
                  letterSpacing: '2px'
                }}
              />
            </>
          )}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? (step === 'details' ? 'Sending OTP...' : 'Verifying...') : (step === 'details' ? 'Send OTP' : (isLogin ? 'Login' : 'Create Account'))}
            </button>
            
            <button
              type="button"
              onClick={onCancel}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            onClick={() => setIsLogin(!isLogin)}
            style={{
              background: 'none',
              border: 'none',
              color: '#16a34a',
              fontSize: '14px',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  )
}