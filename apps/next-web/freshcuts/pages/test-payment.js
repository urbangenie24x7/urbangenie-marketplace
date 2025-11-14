import { useState } from 'react'
import PaymentMethods from '../components/PaymentMethods'

export default function TestPayment() {
  const [paymentResult, setPaymentResult] = useState(null)

  const testOrderData = {
    amount: 599,
    customerId: 'test_customer_123',
    customerName: 'Test Customer',
    customerEmail: 'test@example.com',
    customerPhone: '+919876543210'
  }

  return (
    <div style={{ 
      maxWidth: '500px', 
      margin: '50px auto', 
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Payment Gateway Test</h1>
      
      <div style={{ 
        backgroundColor: '#f8fafc', 
        padding: '15px', 
        borderRadius: '8px', 
        marginBottom: '20px' 
      }}>
        <h3>Test Order Details</h3>
        <p>Amount: ₹{testOrderData.amount}</p>
        <p>Customer: {testOrderData.customerName}</p>
        <p>Email: {testOrderData.customerEmail}</p>
        <p>Phone: {testOrderData.customerPhone}</p>
      </div>

      <PaymentMethods
        orderData={testOrderData}
        onPaymentSuccess={(result) => {
          console.log('Payment Success:', result)
          setPaymentResult({ success: true, ...result })
          alert('Payment Successful! Check console for details.')
        }}
        onPaymentFailure={(error) => {
          console.error('Payment Failed:', error)
          setPaymentResult({ success: false, error })
          alert(`Payment Failed: ${error}`)
        }}
      />

      {paymentResult && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: paymentResult.success ? '#f0f9ff' : '#fef2f2',
          border: `1px solid ${paymentResult.success ? '#bfdbfe' : '#fecaca'}`,
          borderRadius: '8px'
        }}>
          <h4 style={{ color: paymentResult.success ? '#1e40af' : '#dc2626' }}>
            Payment {paymentResult.success ? 'Success' : 'Failed'}
          </h4>
          <pre style={{ fontSize: '12px', overflow: 'auto' }}>
            {JSON.stringify(paymentResult, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ 
        marginTop: '30px', 
        padding: '15px', 
        backgroundColor: '#fffbeb',
        border: '1px solid #fbbf24',
        borderRadius: '8px',
        fontSize: '14px'
      }}>
        <h4 style={{ color: '#92400e', marginBottom: '10px' }}>Test Instructions:</h4>
        <ul style={{ color: '#92400e', paddingLeft: '20px' }}>
          <li><strong>Razorpay:</strong> Use test card 4111 1111 1111 1111, any future date, any CVV</li>
          <li><strong>UPI:</strong> Will simulate payment flow (demo mode)</li>
          <li><strong>COD:</strong> Will process immediately</li>
        </ul>
      </div>
    </div>
  )
}