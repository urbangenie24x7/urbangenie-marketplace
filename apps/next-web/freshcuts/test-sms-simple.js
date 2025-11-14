async function testSMS() {
  console.log('🧪 Testing SMS Gateway...')
  
  // Using the API key from .env.local
  const apiKey = 'aa8d2f16f0e772aa3a183d341cc7c686a5be7448'
  const senderId = 'SMSGAT'
  const testPhone = '9876543210' // Replace with your phone number
  const testMessage = 'Your FreshCuts OTP is: 123456. Valid for 5 minutes. Do not share with anyone.'
  
  console.log('API Key:', apiKey ? '✅ Set' : '❌ Missing')
  console.log('Sender ID:', senderId)
  console.log('Test Phone:', testPhone)
  
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
      console.log('❌ SMS sending failed:', result.message || result.error)
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

testSMS()