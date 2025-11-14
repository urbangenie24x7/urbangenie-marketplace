import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp 
} from 'firebase/firestore'
import { db } from './firebase'

export const refundService = {
  // Create refund request
  async createRefund(refundData) {
    const refund = {
      orderId: refundData.orderId,
      vendorId: refundData.vendorId,
      customerId: refundData.customerId,
      amount: refundData.amount,
      reason: refundData.reason,
      status: 'pending',
      createdAt: serverTimestamp(),
      items: refundData.items || []
    }
    
    const refundRef = await addDoc(collection(db, 'refunds'), refund)
    return { id: refundRef.id, ...refund }
  },

  // Process refund (approve/reject)
  async processRefund(refundId, status, adminNotes = '') {
    await updateDoc(doc(db, 'refunds', refundId), {
      status,
      adminNotes,
      processedAt: serverTimestamp()
    })
  },

  // Get refunds by vendor
  async getVendorRefunds(vendorId) {
    const refundsQuery = query(
      collection(db, 'refunds'),
      where('vendorId', '==', vendorId)
    )
    
    const refundsSnap = await getDocs(refundsQuery)
    return refundsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }
}