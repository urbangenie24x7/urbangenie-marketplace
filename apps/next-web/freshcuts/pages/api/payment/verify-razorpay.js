import crypto from 'crypto'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body
    const secret = process.env.RAZORPAY_KEY_SECRET || 'test_secret_1234567890'

    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex')

    const isAuthentic = expectedSignature === razorpay_signature

    if (isAuthentic) {
      res.status(200).json({
        success: true,
        message: 'Payment verified successfully'
      })
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      })
    }
  } catch (error) {
    console.error('Payment verification error:', error)
    res.status(500).json({
      success: false,
      error: 'Verification failed'
    })
  }
}