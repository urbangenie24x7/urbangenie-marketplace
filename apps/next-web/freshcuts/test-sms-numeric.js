async function testSMSNumeric() {
  console.log('🧪 Testing SMS Gateway (Numeric Sender)...')
  
  const apiKey = 'aa8d2f16f0e772aa3a183d341cc7c686a5be7448'
  const testPhone = '917396811059'
  const testMessage = 'Your FreshCuts OTP is: 123456. Valid for 5 minutes.'
  
  // Try different sender IDs
  const senderIds = ['SMSGAT', '123456', 'FRESHCUTS', 'SMSGTW']
  
  for (const senderId of senderIds) {
    try {
      console.log(`\n📡 Testing with sender: ${senderId}`)
      
      const params = new URLSearchParams({
        apikey: apiKey,
        sender: senderId,
        message: testMessage,
        mobile: testPhone,
        output: 'json'
      })
      
      const apiUrl = `https://www.smsgateway.center/SMSApi/rest/send?${params}`
      
      const response = await fetch(apiUrl, { method: 'GET' })
      const responseText = await response.text()
      
      console.log(`Response for ${senderId}:`, responseText)
      
      if (!responseText.includes('Invalid sendMethod')) {
        console.log(`✅ Success with sender: ${senderId}`)
        break
      }
      
    } catch (error) {
      console.error(`❌ Error with ${senderId}:`, error.message)
    }
  }
}

testSMSNumeric()