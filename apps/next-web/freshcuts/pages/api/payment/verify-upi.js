export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { transactionId } = req.query

    if (!transactionId) {
      return res.status(400).json({ error: 'Transaction ID required' })
    }

    // In a real implementation, you would check with your UPI payment processor
    // For demo purposes, we'll simulate random success/failure
    const isSuccess = Math.random() > 0.3 // 70% success rate for demo

    if (isSuccess) {
      res.status(200).json({
        status: 'success',
        paymentId: `UPI_${transactionId}`,
        transactionId
      })
    } else {
      res.status(200).json({
        status: 'pending',
        transactionId
      })
    }
  } catch (error) {
    console.error('UPI verification error:', error)
    res.status(500).json({
      status: 'failed',
      error: 'Verification failed'
    })
  }
}