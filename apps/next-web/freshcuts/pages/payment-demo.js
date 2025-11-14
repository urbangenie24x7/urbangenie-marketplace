import { useState } from 'react'

export default function PaymentDemo() {
  const [selectedMethod, setSelectedMethod] = useState('')
  const [paymentResult, setPaymentResult] = useState(null)

  const handlePayment = () => {
    if (selectedMethod === 'upi') {
      // Simulate UPI payment
      setTimeout(() => {
        setPaymentResult({ success: true, method: 'UPI', transactionId: 'UPI_' + Date.now() })
      }, 2000)
    } else if (selectedMethod === 'cod') {
      // COD payment
      setPaymentResult({ success: true, method: 'COD', paymentId: 'COD_' + Date.now() })
    } else {
      alert('Razorpay requires actual test credentials. Use UPI or COD for demo.')
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', fontFamily: 'Arial' }}>
      <h1>Payment Demo (No Razorpay Keys Required)</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Select Payment Method:</h3>
        
        <label style={{ display: 'block', marginBottom: '10px' }}>
          <input 
            type="radio" 
            value="upi" 
            checked={selectedMethod === 'upi'}
            onChange={(e) => setSelectedMethod(e.target.value)}
          />
          📱 UPI Payment (Demo)
        </label>
        
        <label style={{ display: 'block', marginBottom: '10px' }}>
          <input 
            type="radio" 
            value="cod" 
            checked={selectedMethod === 'cod'}
            onChange={(e) => setSelectedMethod(e.target.value)}
          />
          💵 Cash on Delivery
        </label>
        
        <label style={{ display: 'block', marginBottom: '10px' }}>
          <input 
            type="radio" 
            value="razorpay" 
            checked={selectedMethod === 'razorpay'}
            onChange={(e) => setSelectedMethod(e.target.value)}
          />
          💳 Razorpay (Needs Real Keys)
        </label>
      </div>

      <button
        onClick={handlePayment}
        disabled={!selectedMethod}
        style={{
          width: '100%',
          padding: '15px',
          backgroundColor: selectedMethod ? '#16a34a' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: selectedMethod ? 'pointer' : 'not-allowed'
        }}
      >
        Pay ₹599
      </button>

      {paymentResult && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#f0f9ff',
          border: '1px solid #bfdbfe',
          borderRadius: '8px'
        }}>
          <h4>Payment Success!</h4>
          <pre>{JSON.stringify(paymentResult, null, 2)}</pre>
        </div>
      )}

      <div style={{ marginTop: '30px', fontSize: '14px', color: '#666' }}>
        <h4>To enable Razorpay:</h4>
        <ol>
          <li>Sign up at dashboard.razorpay.com</li>
          <li>Get test API keys</li>
          <li>Update .env.local file</li>
          <li>Restart the server</li>
        </ol>
      </div>
    </div>
  )
}