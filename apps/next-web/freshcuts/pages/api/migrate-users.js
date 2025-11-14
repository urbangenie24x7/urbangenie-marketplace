import { collection, getDocs, updateDoc, doc } from 'firebase/firestore'
import { db } from '../../lib/firebase'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Get all users
    const usersSnap = await getDocs(collection(db, 'users'))
    let updatedCount = 0
    let totalCount = usersSnap.docs.length

    for (const userDoc of usersSnap.docs) {
      const userData = userDoc.data()
      
      // Check if user has no role or invalid role
      if (!userData.role || !['customer', 'admin', 'super_admin'].includes(userData.role)) {
        await updateDoc(doc(db, 'users', userDoc.id), {
          role: 'customer', // Default to customer
          status: userData.status || 'active',
          permissions: userData.permissions || ['read']
        })
        updatedCount++
      }
    }

    res.status(200).json({
      success: true,
      message: `Migration completed. Updated ${updatedCount} out of ${totalCount} users.`,
      updatedCount,
      totalCount
    })
  } catch (error) {
    console.error('Migration error:', error)
    res.status(500).json({ error: 'Migration failed', details: error.message })
  }
}