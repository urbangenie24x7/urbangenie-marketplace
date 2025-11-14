import { useState } from 'react'

export default function CheckoutTest() {
  const [paymentMethod, setPaymentMethod] = useState('')
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState(null)

  const handlePayment = async () => {
    setProcessing(true)
    
    // Simulate payment processing
    setTimeout(() => {
      setResult({
        success: true,
        paymentId: `${paymentMethod.toUpperCase()}_${Date.now()}`,
        method: paymentMethod,
        amount: 599
      })
      setProcessing(false)
    }, 2000)
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', fontFamily: 'Arial' }}>
      <h1>Checkout Test (No KYC Required)</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Order Summary:</h3>
        <p>Fresh Chicken - 1kg: ₹599</p>
        <hr />
        <p><strong>Total: ₹599</strong></p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Payment Methods:</h3>
        
        <label style={{ display: 'block', marginBottom: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
          <input 
            type="radio" 
            value="upi" 
            checked={paymentMethod === 'upi'}
            onChange={(e) => setPaymentMethod(e.target.value)}
            style={{ marginRight: '10px' }}
          />
          📱 UPI Payment (GPay, PhonePe, Paytm)
        </label>
        
        <label style={{ display: 'block', marginBottom: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
          <input 
            type="radio" 
            value="cod" 
            checked={paymentMethod === 'cod'}
            onChange={(e) => setPaymentMethod(e.target.value)}
            style={{ marginRight: '10px' }}
          />
          💵 Cash on Delivery (+₹25 handling)
        </label>
        
        <label style={{ display: 'block', marginBottom: '10px', padding: '10px', border: '1px solid #eee', borderRadius: '5px', opacity: 0.5 }}>
          <input 
            type="radio" 
            value="card" 
            disabled
            style={{ marginRight: '10px' }}
          />
          💳 Credit/Debit Card (Requires KYC)
        </label>
      </div>

      <button
        onClick={handlePayment}
        disabled={!paymentMethod || processing}
        style={{
          width: '100%',
          padding: '15px',
          backgroundColor: paymentMethod && !processing ? '#16a34a' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: paymentMethod && !processing ? 'pointer' : 'not-allowed'
        }}
      >
        {processing ? 'Processing...' : `Pay ₹${paymentMethod === 'cod' ? '624' : '599'}`}
      </button>

      {result && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#f0f9ff',
          border: '1px solid #bfdbfe',
          borderRadius: '8px'
        }}>
          <h4 style={{ color: '#16a34a' }}>✅ Payment Successful!</h4>
          <p><strong>Payment ID:</strong> {result.paymentId}</p>
          <p><strong>Method:</strong> {result.method.toUpperCase()}</p>
          <p><strong>Amount:</strong> ₹{result.amount}</p>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
            Order will be processed and you'll receive confirmation shortly.
          </p>
        </div>
      )}

      <div style={{ marginTop: '30px', fontSize: '12px', color: '#666', backgroundColor: '#fffbeb', padding: '15px', borderRadius: '8px' }}>
        <h4>💡 About Payment Methods:</h4>
        <ul style={{ paddingLeft: '20px' }}>
          <li><strong>UPI:</strong> Works instantly, no KYC needed</li>
          <li><strong>COD:</strong> Pay when delivered, small handling fee</li>
          <li><strong>Cards:</strong> Requires business KYC verification</li>
        </ul>
      </div>
    </div>
  )
}