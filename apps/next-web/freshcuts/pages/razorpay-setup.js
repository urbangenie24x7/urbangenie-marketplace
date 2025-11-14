export default function RazorpaySetup() {
  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', fontFamily: 'Arial' }}>
      <h1>🚀 Razorpay Test Account Setup</h1>
      
      <div style={{ backgroundColor: '#f0f9ff', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>✅ Good News: Test Account Needs NO KYC!</h2>
        <p>You can create a Razorpay test account and get API keys immediately without any documents.</p>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3>📋 Step-by-Step Setup:</h3>
        
        <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h4>1. Sign Up (2 minutes)</h4>
          <p>Go to: <a href="https://dashboard.razorpay.com/signup" target="_blank" style={{ color: '#16a34a' }}>dashboard.razorpay.com/signup</a></p>
          <ul>
            <li>Business Name: "FreshCuts Test"</li>
            <li>Business Type: "Individual/Proprietorship"</li>
            <li>Category: "Food & Beverages"</li>
            <li>Use your personal phone & email</li>
          </ul>
        </div>

        <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h4>2. Get Test API Keys</h4>
          <p>After signup:</p>
          <ul>
            <li>Go to Settings → API Keys</li>
            <li>Click "Generate Test Key"</li>
            <li>Copy Key ID (starts with rzp_test_)</li>
            <li>Copy Key Secret</li>
          </ul>
        </div>

        <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h4>3. Update .env.local File</h4>
          <pre style={{ backgroundColor: '#f3f4f6', padding: '10px', borderRadius: '4px', fontSize: '12px' }}>
{`NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YOUR_ACTUAL_KEY
RAZORPAY_KEY_SECRET=YOUR_ACTUAL_SECRET`}
          </pre>
        </div>

        <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h4>4. Restart Server</h4>
          <pre style={{ backgroundColor: '#f3f4f6', padding: '10px', borderRadius: '4px', fontSize: '12px' }}>
{`npm run dev`}
          </pre>
        </div>
      </div>

      <div style={{ backgroundColor: '#fef3c7', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>💡 Test Card Details:</h3>
        <ul>
          <li><strong>Card Number:</strong> 4111 1111 1111 1111</li>
          <li><strong>Expiry:</strong> Any future date</li>
          <li><strong>CVV:</strong> Any 3 digits</li>
          <li><strong>Name:</strong> Any name</li>
        </ul>
      </div>

      <div style={{ backgroundColor: '#dcfce7', padding: '15px', borderRadius: '8px' }}>
        <h3>✅ What Works in Test Mode:</h3>
        <ul>
          <li>All payment methods (Cards, UPI, Net Banking)</li>
          <li>Webhooks and notifications</li>
          <li>Payment verification</li>
          <li>Refunds and settlements</li>
        </ul>
        <p><strong>No KYC needed for testing!</strong></p>
      </div>

      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <a 
          href="https://dashboard.razorpay.com/signup" 
          target="_blank"
          style={{
            display: 'inline-block',
            padding: '15px 30px',
            backgroundColor: '#16a34a',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600'
          }}
        >
          Create Test Account Now →
        </a>
      </div>

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666', textAlign: 'center' }}>
        <p>Takes 2-3 minutes • No documents required • Instant API keys</p>
      </div>
    </div>
  )
}