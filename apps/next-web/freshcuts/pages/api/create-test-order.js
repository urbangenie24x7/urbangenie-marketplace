import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../lib/firebase'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { userId } = req.body

  if (!userId) {
    return res.status(400).json({ error: 'userId required' })
  }

  try {
    // Create a test order
    const testOrder = {
      customerId: userId,
      userId: userId, // Add both fields for compatibility
      vendorId: 'test-vendor-123',
      vendorName: 'Test Meat Shop',
      items: [
        {
          id: 'item-1',
          name: 'Chicken Breast',
          price: 250,
          quantity: 1,
          imageUrl: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=100&h=100&fit=crop'
        }
      ],
      itemsTotal: 250,
      deliveryCharge: 0,
      tax: 13,
      total: 263,
      address: {
        address: 'Test Address, Hyderabad',
        city: 'Hyderabad',
        pincode: '500034'
      },
      email: 'test@example.com',
      deliveryOption: 'pickup',
      timeSlot: '9:00 AM - 11:00 AM',
      status: 'confirmed',
      createdAt: serverTimestamp(),
      statusHistory: [{
        status: 'confirmed',
        timestamp: new Date(),
        note: 'Test order created'
      }]
    }

    const orderRef = await addDoc(collection(db, 'orders'), testOrder)

    res.status(200).json({
      success: true,
      orderId: orderRef.id,
      message: 'Test order created successfully'
    })
  } catch (error) {
    console.error('Error creating test order:', error)
    res.status(500).json({ error: error.message })
  }
}