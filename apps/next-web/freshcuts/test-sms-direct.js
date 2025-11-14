require('dotenv').config({ path: '.env.local' })

async function testSMSDirect() {
  console.log('🧪 Testing SMS Gateway Direct...')
  
  const apiKey = process.env.SMS_GATEWAY_API_KEY
  const senderId = process.env.SMS_GATEWAY_SENDER_ID || 'SMSGAT'
  const testPhone = '9876543210' // Replace with your phone number
  const testMessage = 'Your FreshCuts OTP is: 123456. Valid for 5 minutes. Do not share with anyone.'
  
  console.log('API Key:', apiKey ? '✅ Set' : '❌ Missing')
  console.log('Sender ID:', senderId)
  console.log('Test Phone:', testPhone)
  
  if (!apiKey) {
    console.log('❌ SMS_GATEWAY_API_KEY not found in .env.local')
    return
  }
  
  try {
    const apiUrl = 'https://www.smsgateway.center/SMSApi/rest/send'
    
    const smsData = {
      apikey: apiKey,
      senderId: senderId,
      message: testMessage,
      mobile: testPhone,
      msgType: 'text',
      duplicatecheck: 'true',
      output: 'json'
    }

    console.log('\n📡 Sending SMS...')
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(smsData)
    })

    const result = await response.json()
    console.log('SMS Gateway Response:', result)
    
    if (result.status === 'success') {
      console.log('✅ SMS sent successfully!')
      console.log('Message ID:', result.messageId)
    } else {
      console.log('❌ SMS sending failed:', result.message)
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

testSMSDirect()