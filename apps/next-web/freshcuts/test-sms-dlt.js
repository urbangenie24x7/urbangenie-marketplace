async function testSMSDLT() {
  console.log('🧪 Testing SMS with DLT template...')
  
  const userid = 'santo'
  const password = 'f08VyduJ'
  const senderId = 'SMSGAT'
  const testPhone = '917396811059'
  const otp = '123456'
  const testMessage = `Your SMSGatewayCenter OTP code is ${otp} Please use the code within 5 minutes. - Popular SoftTech`
  
  try {
    const params = new URLSearchParams({
      sendMethod: 'quick',
      userid: userid,
      password: password,
      msg: testMessage,
      mobile: testPhone,
      msgType: 'text',
      senderid: senderId,
      dltTemplateId: '1607100000000279073',
      output: 'json'
    })
    
    const apiUrl = `https://unify.smsgateway.center/SMSApi/send?${params}`
    
    console.log('📡 Sending SMS with DLT template...')
    console.log('Message:', testMessage)
    
    const response = await fetch(apiUrl, {
      method: 'GET'
    })

    console.log('Response Status:', response.status)
    const responseText = await response.text()
    console.log('Raw Response:', responseText)
    
    if (responseText.includes('status=success')) {
      console.log('✅ SMS sent successfully!')
      console.log('📱 Check phone +91 7396811059 for OTP')
    } else {
      console.log('❌ SMS sending failed')
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

testSMSDLT()