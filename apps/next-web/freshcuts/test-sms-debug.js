async function testSMSDebug() {
  console.log('🧪 Testing SMS Gateway (Debug Mode)...')
  
  const apiKey = 'aa8d2f16f0e772aa3a183d341cc7c686a5be7448'
  const senderId = 'SMSGAT'
  const testPhone = '+91 7396811059'
  const testMessage = 'Your FreshCuts OTP is: 123456. Valid for 5 minutes.'
  
  try {
    const apiUrl = 'https://www.smsgateway.center/SMSApi/rest/send'
    
    const smsData = {
      apikey: apiKey,
      sender: senderId,
      message: testMessage,
      mobile: testPhone.replace(/[^0-9]/g, ''),
      msgtype: 'text',
      duplicatecheck: 'true',
      output: 'json'
    }

    console.log('📡 Sending SMS...')
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(smsData)
    })

    console.log('Response Status:', response.status)
    console.log('Response Headers:', Object.fromEntries(response.headers))
    
    const responseText = await response.text()
    console.log('Raw Response:', responseText)
    
    // Try to parse as JSON
    try {
      const result = JSON.parse(responseText)
      console.log('Parsed JSON:', result)
    } catch (e) {
      console.log('Not valid JSON, raw text response:', responseText)
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

testSMSDebug()