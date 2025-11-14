import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../lib/firebase'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { userId } = req.query

  if (!userId) {
    return res.status(400).json({ error: 'userId required' })
  }

  try {
    // Check orders with customerId field
    const customerIdQuery = query(
      collection(db, 'orders'),
      where('customerId', '==', userId)
    )
    const customerIdSnap = await getDocs(customerIdQuery)
    const customerIdOrders = customerIdSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))

    // Check orders with userId field
    const userIdQuery = query(
      collection(db, 'orders'),
      where('userId', '==', userId)
    )
    const userIdSnap = await getDocs(userIdQuery)
    const userIdOrders = userIdSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))

    // Get all orders for debugging
    const allOrdersSnap = await getDocs(collection(db, 'orders'))
    const allOrders = allOrdersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))

    res.status(200).json({
      userId,
      customerIdOrders: customerIdOrders.length,
      userIdOrders: userIdOrders.length,
      totalOrders: allOrders.length,
      sampleOrders: allOrders.slice(0, 3).map(order => ({
        id: order.id,
        customerId: order.customerId,
        userId: order.userId,
        vendorName: order.vendorName,
        total: order.total,
        createdAt: order.createdAt
      }))
    })
  } catch (error) {
    console.error('Error testing orders:', error)
    res.status(500).json({ error: error.message })
  }
}