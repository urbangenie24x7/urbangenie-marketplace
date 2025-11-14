async function testSMSAlternative() {
  console.log('🧪 Testing SMS Gateway (Alternative Method)...')
  
  const apiKey = 'aa8d2f16f0e772aa3a183d341cc7c686a5be7448'
  const senderId = 'SMSGAT'
  const testPhone = '+91 7396811059'
  const testMessage = 'Your FreshCuts OTP is: 123456. Valid for 5 minutes.'
  
  try {
    // Try different endpoint
    const apiUrl = 'https://www.smsgateway.center/SMSApi/rest/send'
    
    // Try minimal parameters first
    const smsData = {
      apikey: apiKey,
      sender: senderId,
      message: testMessage,
      mobile: testPhone.replace(/[^0-9]/g, '')
    }

    console.log('📡 Sending SMS with minimal params...')
    console.log('Data:', smsData)
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(smsData)
    })

    console.log('Response Status:', response.status)
    const responseText = await response.text()
    console.log('Raw Response:', responseText)
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

testSMSAlternative()