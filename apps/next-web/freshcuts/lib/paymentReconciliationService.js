import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  runTransaction
} from 'firebase/firestore'
import { db } from './firebase'

export const reconciliationService = {
  // Calculate weekly earnings for a vendor
  async calculateVendorEarnings(vendorId, startDate, endDate) {
    const ordersQuery = query(
      collection(db, 'orders'),
      where('vendorId', '==', vendorId),
      where('status', '==', 'delivered'),
      where('createdAt', '>=', startDate),
      where('createdAt', '<=', endDate)
    )
    
    const ordersSnap = await getDocs(ordersQuery)
    let totalRevenue = 0
    let totalOrders = 0
    let platformCommission = 0
    const commissionRate = 0.15 // 15% platform commission
    
    ordersSnap.docs.forEach(doc => {
      const order = doc.data()
      totalRevenue += order.subtotal || 0
      totalOrders += 1
      platformCommission += (order.subtotal || 0) * commissionRate
    })
    
    return {
      vendorId,
      period: { startDate, endDate },
      totalRevenue,
      totalOrders,
      platformCommission,
      netEarnings: totalRevenue - platformCommission,
      commissionRate
    }
  },

  // Generate weekly reconciliation for all vendors
  async generateWeeklyReconciliation(weekStartDate) {
    const weekEndDate = new Date(weekStartDate)
    weekEndDate.setDate(weekEndDate.getDate() + 6)
    
    // Get all active vendors
    const vendorsQuery = query(collection(db, 'vendors'), where('active', '==', true))
    const vendorsSnap = await getDocs(vendorsQuery)
    
    const reconciliations = []
    
    for (const vendorDoc of vendorsSnap.docs) {
      const vendorId = vendorDoc.id
      const earnings = await this.calculateVendorEarnings(vendorId, weekStartDate, weekEndDate)
      
      if (earnings.totalOrders > 0) {
        const reconciliation = {
          ...earnings,
          vendorName: vendorDoc.data().businessName,
          status: 'pending',
          createdAt: serverTimestamp(),
          weekNumber: this.getWeekNumber(weekStartDate)
        }
        
        const reconciliationRef = await addDoc(collection(db, 'paymentReconciliations'), reconciliation)
        reconciliations.push({ id: reconciliationRef.id, ...reconciliation })
      }
    }
    
    return reconciliations
  },

  // Get vendor payment history
  async getVendorPayments(vendorId) {
    const paymentsQuery = query(
      collection(db, 'paymentReconciliations'),
      where('vendorId', '==', vendorId),
      orderBy('createdAt', 'desc')
    )
    
    const paymentsSnap = await getDocs(paymentsQuery)
    return paymentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  },

  // Process payment to vendor
  async processVendorPayment(reconciliationId, paymentDetails) {
    return runTransaction(db, async (transaction) => {
      const reconciliationRef = doc(db, 'paymentReconciliations', reconciliationId)
      
      transaction.update(reconciliationRef, {
        status: 'paid',
        paidAt: serverTimestamp(),
        paymentMethod: paymentDetails.method,
        transactionId: paymentDetails.transactionId,
        bankDetails: paymentDetails.bankDetails
      })
      
      // Log payment transaction
      const paymentLogRef = doc(collection(db, 'paymentLogs'))
      transaction.set(paymentLogRef, {
        reconciliationId,
        vendorId: paymentDetails.vendorId,
        amount: paymentDetails.amount,
        method: paymentDetails.method,
        transactionId: paymentDetails.transactionId,
        processedBy: paymentDetails.processedBy,
        processedAt: serverTimestamp()
      })
    })
  },

  // Get pending payments for admin
  async getPendingPayments() {
    const pendingQuery = query(
      collection(db, 'paymentReconciliations'),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    )
    
    const pendingSnap = await getDocs(pendingQuery)
    return pendingSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  },

  // Helper function to get week number
  getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    const dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
  }
}