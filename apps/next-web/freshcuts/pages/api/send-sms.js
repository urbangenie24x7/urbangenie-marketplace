export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { phone, message } = req.body

  if (!phone || !message) {
    return res.status(400).json({ error: 'Phone and message required' })
  }

  try {
    const smsData = {
      userid: process.env.SMS_GATEWAY_USERID,
      password: process.env.SMS_GATEWAY_PASSWORD,
      sendMethod: 'quick',
      mobile: phone.replace('+91', ''),
      msg: message,
      senderid: process.env.SMS_GATEWAY_SENDER_ID,
      msgType: 'text',
      duplicatecheck: 'true'
    }

    const params = new URLSearchParams(smsData)
    const response = await fetch(`https://www.smsgateway.center/SMSApi/rest/send?${params}`)
    const result = await response.text()

    if (result.includes('success') || result.includes('Success')) {
      res.status(200).json({ success: true, result })
    } else {
      res.status(500).json({ success: false, error: result })
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}