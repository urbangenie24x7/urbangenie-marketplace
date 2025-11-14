import { useState, useEffect } from 'react'
import Head from 'next/head'
import { reconciliationService } from '../../lib/dbService'

export default function AdminReconciliation() {
  const [pendingPayments, setPendingPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState({})
  const [selectedWeek, setSelectedWeek] = useState('')

  useEffect(() => {
    loadPendingPayments()
  }, [])

  const loadPendingPayments = async () => {
    try {
      setLoading(true)
      const pending = await reconciliationService.getPendingPayments()
      setPendingPayments(pending)
    } catch (error) {
      console.error('Error loading pending payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateWeeklyReconciliation = async () => {
    if (!selectedWeek) {
      alert('Please select a week to generate reconciliation')
      return
    }

    try {
      setLoading(true)
      const weekStart = new Date(selectedWeek)
      await reconciliationService.generateWeeklyReconciliation(weekStart)
      await loadPendingPayments()
      alert('Weekly reconciliation generated successfully!')
    } catch (error) {
      console.error('Error generating reconciliation:', error)
      alert('Error generating reconciliation')
    } finally {
      setLoading(false)
    }
  }

  const processPayment = async (reconciliation) => {
    const transactionId = prompt('Enter transaction ID:')
    if (!transactionId) return

    const paymentMethod = prompt('Enter payment method (NEFT/RTGS/UPI):')
    if (!paymentMethod) return

    try {
      setProcessing(prev => ({ ...prev, [reconciliation.id]: true }))
      
      await reconciliationService.processVendorPayment(reconciliation.id, {
        vendorId: reconciliation.vendorId,
        amount: reconciliation.netEarnings,
        method: paymentMethod,
        transactionId,
        processedBy: 'admin',
        bankDetails: 'As per vendor profile'
      })

      await loadPendingPayments()
      alert('Payment processed successfully!')
    } catch (error) {
      console.error('Error processing payment:', error)
      alert('Error processing payment')
    } finally {
      setProcessing(prev => ({ ...prev, [reconciliation.id]: false }))
    }
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    const d = date.toDate ? date.toDate() : new Date(date)
    return d.toLocaleDateString('en-IN')
  }

  const getTotalPendingAmount = () => {
    return pendingPayments.reduce((sum, payment) => sum + (payment.netEarnings || 0), 0)
  }

  return (
    <>
      <Head>
        <title>Payment Reconciliation - FreshCuts Admin</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-bold text-gray-900">Payment Reconciliation</h1>
              <div className="flex space-x-4">
                <input
                  type="date"
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <button
                  onClick={generateWeeklyReconciliation}
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  Generate Weekly Reconciliation
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Pending Payments</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingPayments.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Pending Amount</p>
                  <p className="text-2xl font-bold text-gray-900">₹{getTotalPendingAmount().toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">This Week</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {pendingPayments.filter(p => p.weekNumber === reconciliationService.getWeekNumber(new Date())).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Payments Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Pending Vendor Payments</h3>
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading...</p>
              </div>
            ) : pendingPayments.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No pending payments</h3>
                <p className="mt-1 text-sm text-gray-500">All vendor payments are up to date.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Refunds</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pendingPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{payment.vendorName}</div>
                          <div className="text-sm text-gray-500">ID: {payment.vendorId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Week {payment.weekNumber}<br/>
                          <span className="text-xs text-gray-500">
                            {formatDate(payment.period?.startDate)} - {formatDate(payment.period?.endDate)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.totalOrders}
                          {payment.refundCount > 0 && <span className="text-xs text-red-500 block">-{payment.refundCount} refunds</span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{payment.totalRevenue?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                          {payment.totalRefunds > 0 ? `-₹${payment.totalRefunds?.toLocaleString()}` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{payment.platformCommission?.toLocaleString()}
                          <span className="text-xs text-gray-500 block">({(payment.commissionRate * 100)}%)</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ₹{payment.netEarnings?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => processPayment(payment)}
                            disabled={processing[payment.id]}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                          >
                            {processing[payment.id] ? 'Processing...' : 'Process Payment'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Reconciliation Process</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Select a week start date and click "Generate Weekly Reconciliation"</li>
                    <li>Review all pending payments in the table below</li>
                    <li>Process payments by clicking "Process Payment" and entering transaction details</li>
                    <li>Vendors will be notified automatically once payments are processed</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}