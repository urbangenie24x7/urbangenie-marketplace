import { useState } from 'react'

export default function TestOrders() {
  const [userId, setUserId] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const createTestOrder = async () => {
    if (!userId) {
      alert('Please enter a user ID')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/create-test-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })
      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setResult(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const checkOrders = async () => {
    if (!userId) {
      alert('Please enter a user ID')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/test-orders?userId=${userId}`)
      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setResult(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const getCurrentUserId = () => {
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      const user = JSON.parse(savedUser)
      setUserId(user.id)
      setResult(`Current user ID: ${user.id}`)
    } else {
      setResult('No user logged in')
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
      <h1>Test Orders Page</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={getCurrentUserId} style={{ 
          padding: '10px 20px', 
          backgroundColor: '#3b82f6', 
          color: 'white', 
          border: 'none', 
          borderRadius: '6px', 
          marginRight: '10px',
          cursor: 'pointer'
        }}>
          Get Current User ID
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>User ID:</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter user ID"
          style={{ 
            width: '300px', 
            padding: '8px', 
            border: '1px solid #d1d5db', 
            borderRadius: '4px',
            marginRight: '10px'
          }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={createTestOrder} 
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#16a34a', 
            color: 'white', 
            border: 'none', 
            borderRadius: '6px', 
            marginRight: '10px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Creating...' : 'Create Test Order'}
        </button>

        <button 
          onClick={checkOrders} 
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#f59e0b', 
            color: 'white', 
            border: 'none', 
            borderRadius: '6px', 
            marginRight: '10px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Checking...' : 'Check Orders'}
        </button>

        <a 
          href="/customer/orders" 
          style={{ 
            display: 'inline-block',
            padding: '10px 20px', 
            backgroundColor: '#8b5cf6', 
            color: 'white', 
            textDecoration: 'none',
            borderRadius: '6px'
          }}
        >
          Go to Orders Page
        </a>
      </div>

      {result && (
        <div style={{ 
          backgroundColor: '#f3f4f6', 
          padding: '15px', 
          borderRadius: '6px', 
          border: '1px solid #d1d5db',
          whiteSpace: 'pre-wrap',
          fontFamily: 'monospace',
          fontSize: '14px'
        }}>
          {result}
        </div>
      )}
    </div>
  )
}