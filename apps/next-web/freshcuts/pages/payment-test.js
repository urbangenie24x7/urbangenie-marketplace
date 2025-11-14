import { useState } from 'react'
import Head from 'next/head'

export default function PaymentTest() {
  const [selectedMethod, setSelectedMethod] = useState('')
  const [selectedUPIApp, setSelectedUPIApp] = useState('gpay')
  const [processing, setProcessing] = useState(false)
  const [paymentResult, setPaymentResult] = useState(null)

  const testOrderData = {
    amount: 599,
    customerId: 'test_customer_123',
    customerName: 'Test Customer',
    customerEmail: 'test@example.com',
    customerPhone: '+919876543210'
  }

  const availableMethods = [
    {
      id: 'razorpay',
      name: 'Credit/Debit Card',
      description: 'Pay securely with your card',
      icon: '💳',
      available: true,
      processingFee: 0
    },
    {
      id: 'upi',
      name: 'UPI Payment',
      description: 'Pay with GPay, PhonePe, Paytm',
      icon: '📱',
      available: true,
      processingFee: 0
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay when you receive',
      icon: '💵',
      available: testOrderData.amount <= 2000,
      processingFee: testOrderData.amount > 500 ? 25 : 0
    }
  ]

  const upiApps = [
    { id: 'gpay', name: 'Google Pay', icon: '🟢' },
    { id: 'phonepe', name: 'PhonePe', icon: '🟣' },
    { id: 'paytm', name: 'Paytm', icon: '🔵' },
    { id: 'generic', name: 'Other UPI Apps', icon: '📱' }
  ]

  const handleRazorpayPayment = async () => {
    try {
      setProcessing(true)
      
      // Load Razorpay script
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => {
        const options = {
          key: 'rzp_test_1234567890', // Replace with your actual test key
          amount: testOrderData.amount * 100,
          currency: 'INR',
          name: 'FreshCuts',
          description: 'Fresh Meat Delivery',
          handler: (response) => {
            setPaymentResult({
              success: true,
              method: 'razorpay',
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id
            })
            setProcessing(false)
          },
          prefill: {
            name: testOrderData.customerName,
            email: testOrderData.customerEmail,
            contact: testOrderData.customerPhone
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

  const handleUPIPayment = () => {
    const merchantId = 'freshcuts@upi'
    const merchantName = 'FreshCuts'
    const transactionId = `FC${Date.now()}`
    
    const upiLinks = {
      gpay: `upi://pay?pa=${merchantId}&pn=${merchantName}&am=${testOrderData.amount}&cu=INR&tn=Order Payment&tr=${transactionId}`,
      phonepe: `phonepe://pay?pa=${merchantId}&pn=${merchantName}&am=${testOrderData.amount}&cu=INR&tn=Order Payment&tr=${transactionId}`,
      paytm: `paytmmp://pay?pa=${merchantId}&pn=${merchantName}&am=${testOrderData.amount}&cu=INR&tn=Order Payment&tr=${transactionId}`,
      generic: `upi://pay?pa=${merchantId}&pn=${merchantName}&am=${testOrderData.amount}&cu=INR&tn=Order Payment&tr=${transactionId}`
    }
    
    const link = upiLinks[selectedUPIApp] || upiLinks.generic
    window.location.href = link
    
    // Simulate payment success after 3 seconds
    setTimeout(() => {
      setPaymentResult({
        success: true,
        method: 'upi',
        transactionId,
        app: selectedUPIApp
      })
    }, 3000)
  }

  const handleCODPayment = () => {
    setPaymentResult({
      success: true,
      method: 'cod',
      paymentId: `COD_${Date.now()}`,
      status: 'pending'
    })
  }

  const handlePayment = () => {
    if (!selectedMethod) {
      alert('Please select a payment method')
      return
    }

    switch (selectedMethod) {
      case 'razorpay':
        handleRazorpayPayment()
        break
      case 'upi':
        handleUPIPayment()
        break
      case 'cod':
        handleCODPayment()
        break
      default:
        alert('Invalid payment method')
    }
  }

  return (
    <>
      <Head>
        <title>Payment Gateway Test - FreshCuts</title>
      </Head>
      
      <div style={{ 
        maxWidth: '500px', 
        margin: '50px auto', 
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#16a34a' }}>
          Payment Gateway Test
        </h1>
        
        <div style={{ 
          backgroundColor: '#f8fafc', 
          padding: '15px', 
          borderRadius: '8px', 
          marginBottom: '20px' 
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Test Order Details</h3>
          <p style={{ margin: '5px 0' }}>Amount: ₹{testOrderData.amount}</p>
          <p style={{ margin: '5px 0' }}>Customer: {testOrderData.customerName}</p>
          <p style={{ margin: '5px 0' }}>Email: {testOrderData.customerEmail}</p>
          <p style={{ margin: '5px 0' }}>Phone: {testOrderData.customerPhone}</p>
        </div>

        <h4 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: '600' }}>
          Select Payment Method
        </h4>

        <div style={{ marginBottom: '20px' }}>
          {availableMethods.map(method => (
            <div
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              style={{
                border: selectedMethod === method.id ? '2px solid #16a34a' : '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '10px',
                cursor: 'pointer',
                backgroundColor: selectedMethod === method.id ? '#f0f9ff' : 'white',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: '24px', marginRight: '12px' }}>{method.icon}</span>
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '2px' }}>{method.name}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{method.description}</div>
                    {method.processingFee > 0 && (
                      <div style={{ fontSize: '11px', color: '#f59e0b', marginTop: '2px' }}>
                        + ₹{method.processingFee} processing fee
                      </div>
                    )}
                  </div>
                </div>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: '2px solid #e5e7eb',
                  backgroundColor: selectedMethod === method.id ? '#16a34a' : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {selectedMethod === method.id && (
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'white' }} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* UPI App Selection */}
        {selectedMethod === 'upi' && (
          <div style={{ 
            backgroundColor: '#f8fafc', 
            padding: '15px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            border: '1px solid #e2e8f0'
          }}>
            <h5 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: '600' }}>
              Choose UPI App
            </h5>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {upiApps.map(app => (
                <div
                  key={app.id}
                  onClick={() => setSelectedUPIApp(app.id)}
                  style={{
                    border: selectedUPIApp === app.id ? '2px solid #16a34a' : '1px solid #e5e7eb',
                    borderRadius: '6px',
                    padding: '10px',
                    cursor: 'pointer',
                    backgroundColor: selectedUPIApp === app.id ? '#f0f9ff' : 'white',
                    textAlign: 'center',
                    fontSize: '12px'
                  }}
                >
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>{app.icon}</div>
                  <div>{app.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          disabled={!selectedMethod || processing}
          style={{
            width: '100%',
            padding: '15px',
            backgroundColor: selectedMethod && !processing ? '#16a34a' : '#9ca3af',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: selectedMethod && !processing ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          {processing ? 'Processing...' : `Pay ₹${testOrderData.amount}`}
        </button>

        {/* Payment Result */}
        {paymentResult && (
          <div style={{ 
            marginTop: '20px', 
            padding: '15px', 
            backgroundColor: paymentResult.success ? '#f0f9ff' : '#fef2f2',
            border: `1px solid ${paymentResult.success ? '#bfdbfe' : '#fecaca'}`,
            borderRadius: '8px'
          }}>
            <h4 style={{ color: paymentResult.success ? '#1e40af' : '#dc2626', margin: '0 0 10px 0' }}>
              Payment {paymentResult.success ? 'Success' : 'Failed'}
            </h4>
            <pre style={{ fontSize: '12px', overflow: 'auto', margin: 0 }}>
              {JSON.stringify(paymentResult, null, 2)}
            </pre>
          </div>
        )}

        {/* Test Instructions */}
        <div style={{ 
          marginTop: '30px', 
          padding: '15px', 
          backgroundColor: '#fffbeb',
          border: '1px solid #fbbf24',
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          <h4 style={{ color: '#92400e', marginBottom: '10px', margin: '0 0 10px 0' }}>Test Instructions:</h4>
          <ul style={{ color: '#92400e', paddingLeft: '20px', margin: 0 }}>
            <li><strong>Razorpay:</strong> Use test card 4111 1111 1111 1111, any future date, any CVV</li>
            <li><strong>UPI:</strong> Will simulate payment flow (demo mode)</li>
            <li><strong>COD:</strong> Will process immediately</li>
          </ul>
        </div>
      </div>
    </>
  )
}