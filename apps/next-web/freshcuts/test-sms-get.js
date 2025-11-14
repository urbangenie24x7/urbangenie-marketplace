async function testSMSGet() {
  console.log('🧪 Testing SMS Gateway (GET Method)...')
  
  const apiKey = 'aa8d2f16f0e772aa3a183d341cc7c686a5be7448'
  const senderId = 'SMSGAT'
  const testPhone = '917396811059'
  const testMessage = 'Your FreshCuts OTP is: 123456. Valid for 5 minutes.'
  
  try {
    // Try GET method with query parameters
    const params = new URLSearchParams({
      apikey: apiKey,
      sender: senderId,
      message: testMessage,
      mobile: testPhone,
      output: 'json'
    })
    
    const apiUrl = `https://www.smsgateway.center/SMSApi/rest/send?${params}`
    
    console.log('📡 Sending SMS via GET...')
    console.log('URL:', apiUrl.replace(apiKey, 'API_KEY_HIDDEN'))
    
    const response = await fetch(apiUrl, {
      method: 'GET'
    })

    console.log('Response Status:', response.status)
    const responseText = await response.text()
    console.log('Raw Response:', responseText)
    
    // Also try different endpoint
    console.log('\n📡 Trying different endpoint...')
    const altUrl = `https://www.smsgateway.center/SMSApi/send?${params}`
    
    const altResponse = await fetch(altUrl, {
      method: 'GET'
    })
    
    console.log('Alt Response Status:', altResponse.status)
    const altResponseText = await altResponse.text()
    console.log('Alt Raw Response:', altResponseText)
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

testSMSGet()