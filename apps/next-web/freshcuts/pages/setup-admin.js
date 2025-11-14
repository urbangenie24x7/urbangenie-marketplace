import { useState } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'

export default function SetupAdmin() {
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const createAdmin = async () => {
    if (!phone || !name || !email) {
      alert('Please fill all fields')
      return
    }

    setLoading(true)
    try {
      await addDoc(collection(db, 'users'), {
        phone: `+91${phone}`,
        role: 'admin', // Mandatory role field
        name,
        email,
        status: 'active',
        permissions: ['read', 'write', 'admin'],
        createdAt: new Date(),
        lastLoginAt: null
      })
      setSuccess(true)
      alert('Admin account created successfully!')
    } catch (error) {
      console.error('Error creating admin:', error)
      alert('Error creating admin account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '40px', maxWidth: '500px', margin: '0 auto' }}>
      <h1>Setup Admin Account</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <label>Phone (10 digits):</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
          placeholder="9876543210"
          style={{ width: '100%', padding: '10px', margin: '5px 0' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Admin Name"
          style={{ width: '100%', padding: '10px', margin: '5px 0' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@freshcuts.com"
          style={{ width: '100%', padding: '10px', margin: '5px 0' }}
        />
      </div>

      <button
        onClick={createAdmin}
        disabled={loading || success}
        style={{
          padding: '12px 24px',
          backgroundColor: success ? '#16a34a' : '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Creating...' : success ? 'Admin Created ✓' : 'Create Admin Account'}
      </button>

      {success && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px' }}>
          <p><strong>Admin account created!</strong></p>
          <p>Phone: +91{phone}</p>
          <p>Now go to <a href="/admin/login">/admin/login</a> and use:</p>
          <ul>
            <li>Phone: {phone}</li>
            <li>OTP: 123456 (for testing)</li>
          </ul>
        </div>
      )}
    </div>
  )
}