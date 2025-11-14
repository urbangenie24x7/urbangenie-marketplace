async function testDefaultTemplate() {
  console.log('🧪 Testing default DLT template...')
  
  const userid = 'santo'
  const password = 'f08VyduJ'
  const senderId = 'SMSGAT'
  const testPhone = '917396811059'
  const otp = '123456'
  const message = `Your SMSGatewayCenter OTP code is ${otp} Please use the code within 5 minutes. - Popular SoftTech`
  
  try {
    const params = new URLSearchParams({
      sendMethod: 'quick',
      userid: userid,
      password: password,
      msg: message,
      mobile: testPhone,
      msgType: 'text',
      senderid: senderId,
      dltTemplateId: '1607100000000279073',
      output: 'json'
    })
    
    const apiUrl = `https://unify.smsgateway.center/SMSApi/send?${params}`
    
    console.log('📡 Sending SMS with default template...')
    console.log('Message:', message)
    
    const response = await fetch(apiUrl, {
      method: 'GET'
    })

    const responseText = await response.text()
    console.log('Response:', responseText)
    
    try {
      const result = JSON.parse(responseText)
      if (result.status === 'success') {
        console.log('✅ SMS sent successfully!')
        console.log('📱 Transaction ID:', result.transactionId)
        console.log('📱 Check phone +91 7396811059 for OTP')
      } else {
        console.log('❌ SMS failed:', result.reason)
      }
    } catch (e) {
      console.log('Response parsing error:', e.message)
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

testDefaultTemplate()