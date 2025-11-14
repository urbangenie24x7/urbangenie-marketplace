export default function GetRazorpayKeys() {
  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', fontFamily: 'Arial' }}>
      <h1>🔑 Get Your Razorpay Test Keys</h1>
      
      <div style={{ backgroundColor: '#fef3c7', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>⚠️ Important: You Need Real Test Keys</h3>
        <p>The credentials in the code are placeholders. You need to get actual test keys from Razorpay.</p>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3>📋 Step-by-Step Process:</h3>
        
        <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h4>1. Create Razorpay Account (2 minutes)</h4>
          <p>Go to: <a href="https://dashboard.razorpay.com/signup" target="_blank" style={{ color: '#16a34a' }}>dashboard.razorpay.com/signup</a></p>
          <ul>
            <li>Enter your email and phone</li>
            <li>Business name: "FreshCuts" (or any name)</li>
            <li>Business type: "Individual"</li>
            <li>No documents needed for test mode</li>
          </ul>
        </div>

        <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h4>2. Generate Test API Keys</h4>
          <p>After login:</p>
          <ol>
            <li>Go to Settings → API Keys</li>
            <li>Click "Generate Test Key"</li>
            <li>Copy the Key ID (starts with rzp_test_)</li>
            <li>Copy the Key Secret</li>
          </ol>
        </div>

        <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h4>3. Update Your .env.local File</h4>
          <pre style={{ backgroundColor: '#f3f4f6', padding: '10px', borderRadius: '4px', fontSize: '12px' }}>
{`NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YOUR_ACTUAL_KEY
RAZORPAY_KEY_SECRET=YOUR_ACTUAL_SECRET`}
          </pre>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
            Replace YOUR_ACTUAL_KEY and YOUR_ACTUAL_SECRET with the keys from step 2
          </p>
        </div>

        <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h4>4. Restart Development Server</h4>
          <pre style={{ backgroundColor: '#f3f4f6', padding: '10px', borderRadius: '4px', fontSize: '12px' }}>
{`npm run dev`}
          </pre>
        </div>
      </div>

      <div style={{ backgroundColor: '#dcfce7', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>✅ What You Get:</h3>
        <ul>
          <li>Instant test API keys (no KYC required)</li>
          <li>All payment methods work (Cards, UPI, Net Banking)</li>
          <li>Full dashboard access</li>
          <li>Webhook testing</li>
          <li>Transaction history</li>
        </ul>
      </div>

      <div style={{ backgroundColor: '#f0f9ff', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>💳 Test Card Details (After Setup):</h3>
        <ul>
          <li><strong>Card:</strong> 4111 1111 1111 1111</li>
          <li><strong>Expiry:</strong> Any future date</li>
          <li><strong>CVV:</strong> Any 3 digits</li>
          <li><strong>OTP:</strong> 123456</li>
        </ul>
      </div>

      <div style={{ backgroundColor: '#fef2f2', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>❌ Alternative: Skip Razorpay for Now</h3>
        <p>If you don't want to create an account, you can:</p>
        <ul>
          <li>Use UPI and COD payments (already working)</li>
          <li>Test with <a href="/checkout-test" style={{ color: '#16a34a' }}>mock payments</a></li>
          <li>Add Razorpay later when ready</li>
        </ul>
      </div>

      <div style={{ textAlign: 'center', marginTop: '30px' }}>
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
            fontWeight: '600',
            marginRight: '15px'
          }}
        >
          Create Razorpay Account →
        </a>
        
        <a 
          href="/checkout-test"
          style={{
            display: 'inline-block',
            padding: '15px 30px',
            backgroundColor: '#6b7280',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600'
          }}
        >
          Skip & Use Mock Payments
        </a>
      </div>

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666', textAlign: 'center' }}>
        <p>Account creation takes 2-3 minutes • Test keys available immediately</p>
      </div>
    </div>
  )
}