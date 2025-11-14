async function testSMSFinal() {
  console.log('🧪 Testing SMS with correct credentials...')
  
  const userid = 'santo'
  const password = 'f08VyduJ'
  const senderId = 'SMSGAT'
  const testPhone = '917396811059'
  const testMessage = 'Your FreshCuts OTP is: 123456. Valid for 5 minutes.'
  
  try {
    const params = new URLSearchParams({
      sendMethod: 'quick',
      userid: userid,
      password: password,
      msg: testMessage,
      mobile: testPhone,
      msgType: 'text',
      senderid: senderId,
      output: 'json'
    })
    
    const apiUrl = `https://unify.smsgateway.center/SMSApi/send?${params}`
    
    console.log('📡 Sending SMS...')
    
    const response = await fetch(apiUrl, {
      method: 'GET'
    })

    console.log('Response Status:', response.status)
    const responseText = await response.text()
    console.log('Raw Response:', responseText)
    
    if (responseText.includes('status=success')) {
      console.log('✅ SMS sent successfully!')
    } else {
      console.log('❌ SMS sending failed')
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

testSMSFinal()