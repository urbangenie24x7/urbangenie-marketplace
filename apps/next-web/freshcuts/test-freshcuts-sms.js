async function testFreshCutsSMS() {
  console.log('🥩 Testing FreshCuts branded SMS...')
  
  const userid = 'santo'
  const password = 'f08VyduJ'
  const senderId = 'SMSGAT'
  const testPhone = '917396811059'
  const otp = '123456'
  const message = `Your FreshCuts OTP is ${otp}. Valid for 5 minutes. Fresh meat delivered daily! - UrbanGenie24x7`
  
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
    
    console.log('📡 Sending FreshCuts branded SMS...')
    console.log('Message:', message)
    
    const response = await fetch(apiUrl, {
      method: 'GET'
    })

    const responseText = await response.text()
    console.log('Response:', responseText)
    
    try {
      const result = JSON.parse(responseText)
      if (result.status === 'success') {
        console.log('✅ FreshCuts SMS sent successfully!')
        console.log('📱 Transaction ID:', result.transactionId)
        console.log('📱 Check phone +91 7396811059 for FreshCuts OTP')
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

testFreshCutsSMS()