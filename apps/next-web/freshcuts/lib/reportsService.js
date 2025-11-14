import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy,
  startAt,
  endAt
} from 'firebase/firestore'
import { db } from './firebase'

export const reportsService = {
  // Revenue Report
  async getRevenueReport(startDate, endDate) {
    const ordersQuery = query(
      collection(db, 'orders'),
      where('status', '==', 'delivered'),
      where('createdAt', '>=', startDate),
      where('createdAt', '<=', endDate)
    )
    
    const ordersSnap = await getDocs(ordersQuery)
    let totalRevenue = 0
    let platformCommission = 0
    let vendorPayouts = 0
    let orderCount = 0
    const categoryBreakdown = {}
    const vendorBreakdown = {}
    
    ordersSnap.docs.forEach(doc => {
      const order = doc.data()
      const revenue = order.subtotal || 0
      const commission = revenue * 0.15
      
      totalRevenue += revenue
      platformCommission += commission
      vendorPayouts += (revenue - commission)
      orderCount += 1
      
      // Category breakdown
      order.items?.forEach(item => {
        const category = item.category || 'unknown'
        categoryBreakdown[category] = (categoryBreakdown[category] || 0) + (item.price * item.quantity)
      })
      
      // Vendor breakdown
      const vendorId = order.vendorId
      if (!vendorBreakdown[vendorId]) {
        vendorBreakdown[vendorId] = { revenue: 0, orders: 0, commission: 0 }
      }
      vendorBreakdown[vendorId].revenue += revenue
      vendorBreakdown[vendorId].orders += 1
      vendorBreakdown[vendorId].commission += commission
    })
    
    return {
      totalRevenue,
      platformCommission,
      vendorPayouts,
      orderCount,
      avgOrderValue: orderCount > 0 ? totalRevenue / orderCount : 0,
      categoryBreakdown,
      vendorBreakdown
    }
  },

  // Cash Flow Report
  async getCashFlowReport(startDate, endDate) {
    const [ordersSnap, refundsSnap, claimsSnap] = await Promise.all([
      getDocs(query(collection(db, 'orders'), where('createdAt', '>=', startDate), where('createdAt', '<=', endDate))),
      getDocs(query(collection(db, 'refunds'), where('createdAt', '>=', startDate), where('createdAt', '<=', endDate))),
      getDocs(query(collection(db, 'claims'), where('createdAt', '>=', startDate), where('createdAt', '<=', endDate)))
    ])
    
    let cashIn = 0
    let cashOut = 0
    let pendingPayments = 0
    
    // Cash inflow from orders
    ordersSnap.docs.forEach(doc => {
      const order = doc.data()
      if (order.paymentStatus === 'paid') {
        cashIn += order.total || 0
      } else {
        pendingPayments += order.total || 0
      }
    })
    
    // Cash outflow from refunds
    refundsSnap.docs.forEach(doc => {
      const refund = doc.data()
      if (refund.status === 'approved') {
        cashOut += refund.amount || 0
      }
    })
    
    // Cash outflow from claims
    claimsSnap.docs.forEach(doc => {
      const claim = doc.data()
      if (claim.status === 'approved') {
        cashOut += claim.compensationAmount || 0
      }
    })
    
    return {
      cashIn,
      cashOut,
      netCashFlow: cashIn - cashOut,
      pendingPayments
    }
  },

  // Performance Analytics
  async getPerformanceReport(startDate, endDate) {
    const [ordersSnap, usersSnap, vendorsSnap] = await Promise.all([
      getDocs(query(collection(db, 'orders'), where('createdAt', '>=', startDate), where('createdAt', '<=', endDate))),
      getDocs(collection(db, 'users')),
      getDocs(collection(db, 'vendors'))
    ])
    
    const ordersByStatus = {}
    const dailyOrders = {}
    let totalCustomers = 0
    let activeVendors = 0
    
    ordersSnap.docs.forEach(doc => {
      const order = doc.data()
      const status = order.status || 'unknown'
      const date = order.createdAt?.toDate?.()?.toDateString() || 'unknown'
      
      ordersByStatus[status] = (ordersByStatus[status] || 0) + 1
      dailyOrders[date] = (dailyOrders[date] || 0) + 1
    })
    
    usersSnap.docs.forEach(doc => {
      const user = doc.data()
      if (user.role === 'customer') totalCustomers += 1
    })
    
    vendorsSnap.docs.forEach(doc => {
      const vendor = doc.data()
      if (vendor.active) activeVendors += 1
    })
    
    return {
      ordersByStatus,
      dailyOrders,
      totalCustomers,
      activeVendors,
      conversionRate: totalCustomers > 0 ? (ordersSnap.docs.length / totalCustomers) * 100 : 0
    }
  }
}