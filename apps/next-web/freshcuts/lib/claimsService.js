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

export const claimsService = {
  // Create vendor claim
  async createClaim(claimData) {
    const claim = {
      orderId: claimData.orderId,
      vendorId: claimData.vendorId,
      customerId: claimData.customerId,
      type: claimData.type, // 'no_show', 'late_cancellation', 'quality_issue', 'other'
      amount: claimData.amount,
      reason: claimData.reason,
      evidence: claimData.evidence || [],
      status: 'pending',
      createdAt: serverTimestamp(),
      autoResolveAt: claimData.autoResolveAt || null
    }
    
    const claimRef = await addDoc(collection(db, 'claims'), claim)
    return { id: claimRef.id, ...claim }
  },

  // Process claim (approve/reject)
  async processClaim(claimId, decision, adminNotes = '', compensationAmount = 0) {
    await updateDoc(doc(db, 'claims', claimId), {
      status: decision, // 'approved', 'rejected', 'partial'
      adminNotes,
      compensationAmount,
      processedAt: serverTimestamp()
    })
  },

  // Auto-create claims for specific scenarios
  async autoCreateClaim(orderId, type, reason) {
    const claimAmounts = {
      no_show: 50, // Fixed penalty for no-shows
      late_cancellation: 30, // Cancellation within 30 mins
      preparation_loss: 0 // Calculated based on order value
    }

    return this.createClaim({
      orderId,
      type,
      reason,
      amount: claimAmounts[type] || 0,
      autoResolveAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    })
  },

  // Get vendor claims
  async getVendorClaims(vendorId) {
    const claimsQuery = query(
      collection(db, 'claims'),
      where('vendorId', '==', vendorId)
    )
    
    const claimsSnap = await getDocs(claimsQuery)
    return claimsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }
}