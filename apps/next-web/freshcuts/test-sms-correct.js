async function testSMSCorrect() {
  console.log('🧪 Testing SMS Gateway (Correct Format)...')
  
  // Based on the Java example, we need userid/password, not apikey
  const userid = 'santo' // You'll need to replace this with your actual userid
  const password = 'xxxxxx' // You'll need to replace this with your actual password
  const senderId = 'TESTSG' // You'll need to replace this with your approved sender ID
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
    
    console.log('📡 Sending SMS with correct format...')
    console.log('URL:', apiUrl.replace(password, 'PASSWORD_HIDDEN'))
    
    const response = await fetch(apiUrl, {
      method: 'GET'
    })

    console.log('Response Status:', response.status)
    const responseText = await response.text()
    console.log('Raw Response:', responseText)
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

console.log('⚠️  You need to update the userid, password, and senderid in the script')
console.log('⚠️  Check your SMS Gateway Center account for these credentials')
testSMSCorrect()