import { useState } from 'react'

export default function RazorpaySandbox() {
  const [paymentResult, setPaymentResult] = useState(null)
  const [processing, setProcessing] = useState(false)

  const testRazorpayPayment = async () => {
    setProcessing(true)
    
    try {
      // Load Razorpay script
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => {
        const options = {
          key: 'rzp_test_OEt8U0bOaGgn9k', // Official sandbox key
          amount: 59900, // ₹599 in paise
          currency: 'INR',
          name: 'FreshCuts',
          description: 'Test Payment - Fresh Meat Delivery',
          handler: (response) => {
            setPaymentResult({
              success: true,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature
            })
            setProcessing(false)
          },
          prefill: {
            name: 'Test Customer',
            email: 'test@example.com',
            contact: '9999999999'
          },
          theme: {
            color: '#16a34a'
          },
          modal: {
            ondismiss: () => {
              setProcessing(false)
              alert('Payment cancelled')
            }
          }
        }

        const razorpay = new window.Razorpay(options)
        razorpay.open()
      }
      document.body.appendChild(script)
    } catch (error) {
      setProcessing(false)
      alert('Payment failed: ' + error.message)
    }
  }

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', fontFamily: 'Arial' }}>
      <h1>🧪 Razorpay Sandbox Test</h1>
      
      <div style={{ backgroundColor: '#f0f9ff', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>✅ Using Official Sandbox Keys</h3>
        <p>This uses Razorpay's official test environment - no signup required!</p>
        <p><strong>Key:</strong> rzp_test_OEt8U0bOaGgn9k</p>
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
        <h3>Test Order:</h3>
        <p>Fresh Chicken - 1kg</p>
        <p><strong>Amount: ₹599</strong></p>
      </div>

      <button
        onClick={testRazorpayPayment}
        disabled={processing}
        style={{
          width: '100%',
          padding: '15px',
          backgroundColor: processing ? '#9ca3af' : '#16a34a',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: processing ? 'not-allowed' : 'pointer'
        }}
      >
        {processing ? 'Opening Payment...' : 'Pay ₹599 with Razorpay'}
      </button>

      {paymentResult && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#f0f9ff',
          border: '1px solid #bfdbfe',
          borderRadius: '8px'
        }}>
          <h4 style={{ color: '#16a34a' }}>✅ Payment Successful!</h4>
          <div style={{ fontSize: '12px', fontFamily: 'monospace' }}>
            <p><strong>Payment ID:</strong> {paymentResult.paymentId}</p>
            <p><strong>Order ID:</strong> {paymentResult.orderId}</p>
            <p><strong>Signature:</strong> {paymentResult.signature?.substring(0, 20)}...</p>
          </div>
        </div>
      )}

      <div style={{ marginTop: '30px', fontSize: '14px', color: '#666', backgroundColor: '#fffbeb', padding: '15px', borderRadius: '8px' }}>
        <h4>💳 Test Card Details:</h4>
        <ul style={{ paddingLeft: '20px' }}>
          <li><strong>Card:</strong> 4111 1111 1111 1111</li>
          <li><strong>Expiry:</strong> Any future date (e.g., 12/25)</li>
          <li><strong>CVV:</strong> Any 3 digits (e.g., 123)</li>
          <li><strong>Name:</strong> Any name</li>
        </ul>
        
        <h4>🏦 Test UPI ID:</h4>
        <p>success@razorpay (for successful payments)</p>
        
        <h4>📱 Test Net Banking:</h4>
        <p>Select any bank → Success</p>
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <a 
          href="/payment-test" 
          style={{
            display: 'inline-block',
            padding: '10px 20px',
            backgroundColor: '#6b7280',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        >
          ← Back to Full Payment Test
        </a>
      </div>
    </div>
  )
}