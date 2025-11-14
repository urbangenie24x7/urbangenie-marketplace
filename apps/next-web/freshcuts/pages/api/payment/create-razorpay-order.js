import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_OEt8U0bOaGgn9k',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret_key'
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { amount, currency, receipt, notes } = req.body

    const options = {
      amount: parseInt(amount),
      currency: currency || 'INR',
      receipt: receipt || `receipt_${Date.now()}`,
      notes: notes || {}
    }

    const order = await razorpay.orders.create(options)
    
    res.status(200).json({
      success: true,
      order
    })
  } catch (error) {
    console.error('Razorpay order creation error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to create order'
    })
  }
}