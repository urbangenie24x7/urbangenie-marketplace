import { useState } from 'react'
import paymentService from '../lib/paymentService'

export default function PaymentMethods({ orderData, onPaymentSuccess, onPaymentFailure }) {
  const [selectedMethod, setSelectedMethod] = useState('')
  const [selectedUPIApp, setSelectedUPIApp] = useState('gpay')
  const [processing, setProcessing] = useState(false)
  const [showUPIOptions, setShowUPIOptions] = useState(false)

  const availableMethods = paymentService.getAvailablePaymentMethods(orderData.amount)

  const handlePayment = async () => {
    if (!selectedMethod) {
      alert('Please select a payment method')
      return
    }

    setProcessing(true)

    try {
      switch (selectedMethod) {
        case 'razorpay':
          await paymentService.processRazorpayPayment(
            orderData,
            onPaymentSuccess,
            (error) => {
              setProcessing(false)
              onPaymentFailure(error)
            }
          )
          break

        case 'upi':
          await paymentService.processUPIPayment(
            orderData,
            selectedUPIApp,
            onPaymentSuccess,
            (error) => {
              setProcessing(false)
              onPaymentFailure(error)
            }
          )
          break

        case 'cod':
          await paymentService.processCODPayment(orderData, onPaymentSuccess)
          break

        default:
          throw new Error('Invalid payment method')
      }
    } catch (error) {
      setProcessing(false)
      onPaymentFailure(error.message)
    }
  }

  const upiApps = [
    { id: 'gpay', name: 'Google Pay', icon: '🟢' },
    { id: 'phonepe', name: 'PhonePe', icon: '🟣' },
    { id: 'paytm', name: 'Paytm', icon: '🔵' },
    { id: 'generic', name: 'Other UPI Apps', icon: '📱' }
  ]

  return (
    <div style={{ marginBottom: '20px' }}>
      <h4 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: '600' }}>
        Select Payment Method
      </h4>

      <div style={{ marginBottom: '20px' }}>
        {availableMethods.map(method => (
          <div
            key={method.id}
            onClick={() => {
              setSelectedMethod(method.id)
              setShowUPIOptions(method.id === 'upi')
            }}
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
      {showUPIOptions && (
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

      {/* Payment Summary */}
      <div style={{ 
        backgroundColor: '#f9fafb', 
        padding: '15px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span>Order Total:</span>
          <span>₹{orderData.amount}</span>
        </div>
        {selectedMethod === 'cod' && availableMethods.find(m => m.id === 'cod')?.processingFee > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span>COD Charges:</span>
            <span>₹{availableMethods.find(m => m.id === 'cod').processingFee}</span>
          </div>
        )}
        <hr style={{ margin: '10px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', fontSize: '16px' }}>
          <span>Total to Pay:</span>
          <span style={{ color: '#16a34a' }}>
            ₹{orderData.amount + (selectedMethod === 'cod' ? (availableMethods.find(m => m.id === 'cod')?.processingFee || 0) : 0)}
          </span>
        </div>
      </div>

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
        {processing && (
          <div style={{
            width: '16px',
            height: '16px',
            border: '2px solid #ffffff40',
            borderTop: '2px solid #ffffff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        )}
        {processing ? 'Processing...' : `Pay ₹${orderData.amount + (selectedMethod === 'cod' ? (availableMethods.find(m => m.id === 'cod')?.processingFee || 0) : 0)}`}
      </button>

      {/* Payment Security Info */}
      <div style={{ 
        textAlign: 'center', 
        fontSize: '11px', 
        color: '#6b7280', 
        marginTop: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px'
      }}>
        <span>🔒</span>
        <span>Your payment information is secure and encrypted</span>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}