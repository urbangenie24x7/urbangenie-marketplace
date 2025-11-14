// Test customer SMS login functionality
const testPhone = '9876543210' // Replace with your test phone number

async function testCustomerSMS() {
  try {
    console.log('🧪 Testing Customer SMS Login...')
    console.log('Phone:', testPhone)
    
    // Test OTP sending
    console.log('\n📱 Step 1: Sending OTP...')
    const otpResponse = await fetch('http://localhost:3000/api/send-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        phone: testPhone, 
        message: `Your FreshCuts OTP is: 123456. Valid for 5 minutes. Do not share with anyone.`
      })
    })
    
    const otpResult = await otpResponse.json()
    console.log('OTP Response:', otpResult)
    
    if (otpResult.success) {
      console.log('✅ SMS sent successfully!')
      console.log('Message ID:', otpResult.messageId)
    } else {
      console.log('❌ SMS sending failed:', otpResult.error)
    }
    
    // Test SMS Gateway configuration
    console.log('\n🔧 SMS Gateway Configuration:')
    console.log('API Key:', process.env.SMS_GATEWAY_API_KEY ? '✅ Set' : '❌ Missing')
    console.log('Sender ID:', process.env.SMS_GATEWAY_SENDER_ID || 'SMSGAT')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

// Check environment variables
require('dotenv').config({ path: '.env.local' })
console.log('Environment check:')
console.log('SMS_GATEWAY_API_KEY:', process.env.SMS_GATEWAY_API_KEY ? 'Set' : 'Missing')
console.log('SMS_GATEWAY_SENDER_ID:', process.env.SMS_GATEWAY_SENDER_ID || 'Default: SMSGAT')

testCustomerSMS()