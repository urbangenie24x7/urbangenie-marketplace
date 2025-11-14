import { useState, useEffect } from 'react'
import Head from 'next/head'
import { reportsService } from '../../lib/reportsService'

export default function AdminReports() {
  const [activeReport, setActiveReport] = useState('revenue')
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  })
  const [reportData, setReportData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadReport()
  }, [activeReport, dateRange])

  const loadReport = async () => {
    setLoading(true)
    try {
      const startDate = new Date(dateRange.startDate)
      const endDate = new Date(dateRange.endDate)
      
      let data
      switch (activeReport) {
        case 'revenue':
          data = await reportsService.getRevenueReport(startDate, endDate)
          break
        case 'cashflow':
          data = await reportsService.getCashFlowReport(startDate, endDate)
          break
        case 'performance':
          data = await reportsService.getPerformanceReport(startDate, endDate)
          break
        default:
          data = {}
      }
      
      setReportData(data)
    } catch (error) {
      console.error('Error loading report:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => `₹${amount?.toLocaleString() || 0}`

  return (
    <>
      <Head>
        <title>Business Reports - FreshCuts Admin</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-bold text-gray-900">Business Reports</h1>
              <div className="flex space-x-4">
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Report Tabs */}
          <div className="flex space-x-1 mb-8">
            {[
              { id: 'revenue', label: 'Revenue Report', icon: '💰' },
              { id: 'cashflow', label: 'Cash Flow', icon: '💸' },
              { id: 'performance', label: 'Performance', icon: '📊' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveReport(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeReport === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading report...</p>
            </div>
          ) : (
            <>
              {/* Revenue Report */}
              {activeReport === 'revenue' && reportData && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                      <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(reportData.totalRevenue)}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                      <h3 className="text-sm font-medium text-gray-500">Platform Commission</h3>
                      <p className="text-2xl font-bold text-blue-600">{formatCurrency(reportData.platformCommission)}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                      <h3 className="text-sm font-medium text-gray-500">Vendor Payouts</h3>
                      <p className="text-2xl font-bold text-purple-600">{formatCurrency(reportData.vendorPayouts)}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                      <h3 className="text-sm font-medium text-gray-500">Avg Order Value</h3>
                      <p className="text-2xl font-bold text-orange-600">{formatCurrency(reportData.avgOrderValue)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Category Breakdown</h3>
                      <div className="space-y-2">
                        {Object.entries(reportData.categoryBreakdown || {}).map(([category, amount]) => (
                          <div key={category} className="flex justify-between">
                            <span className="capitalize">{category}</span>
                            <span className="font-medium">{formatCurrency(amount)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Top Vendors</h3>
                      <div className="space-y-2">
                        {Object.entries(reportData.vendorBreakdown || {})
                          .sort(([,a], [,b]) => b.revenue - a.revenue)
                          .slice(0, 5)
                          .map(([vendorId, data]) => (
                            <div key={vendorId} className="flex justify-between">
                              <span>{vendorId.substring(0, 8)}...</span>
                              <span className="font-medium">{formatCurrency(data.revenue)}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Cash Flow Report */}
              {activeReport === 'cashflow' && reportData && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                      <h3 className="text-sm font-medium text-gray-500">Cash Inflow</h3>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(reportData.cashIn)}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                      <h3 className="text-sm font-medium text-gray-500">Cash Outflow</h3>
                      <p className="text-2xl font-bold text-red-600">{formatCurrency(reportData.cashOut)}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                      <h3 className="text-sm font-medium text-gray-500">Net Cash Flow</h3>
                      <p className={`text-2xl font-bold ${reportData.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(reportData.netCashFlow)}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                      <h3 className="text-sm font-medium text-gray-500">Pending Payments</h3>
                      <p className="text-2xl font-bold text-yellow-600">{formatCurrency(reportData.pendingPayments)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Performance Report */}
              {activeReport === 'performance' && reportData && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                      <h3 className="text-sm font-medium text-gray-500">Total Customers</h3>
                      <p className="text-2xl font-bold text-blue-600">{reportData.totalCustomers}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                      <h3 className="text-sm font-medium text-gray-500">Active Vendors</h3>
                      <p className="text-2xl font-bold text-green-600">{reportData.activeVendors}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                      <h3 className="text-sm font-medium text-gray-500">Conversion Rate</h3>
                      <p className="text-2xl font-bold text-purple-600">{reportData.conversionRate?.toFixed(1)}%</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                      <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
                      <p className="text-2xl font-bold text-orange-600">
                        {Object.values(reportData.ordersByStatus || {}).reduce((a, b) => a + b, 0)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Orders by Status</h3>
                      <div className="space-y-2">
                        {Object.entries(reportData.ordersByStatus || {}).map(([status, count]) => (
                          <div key={status} className="flex justify-between">
                            <span className="capitalize">{status}</span>
                            <span className="font-medium">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Orders (Last 7 Days)</h3>
                      <div className="space-y-2">
                        {Object.entries(reportData.dailyOrders || {})
                          .slice(-7)
                          .map(([date, count]) => (
                            <div key={date} className="flex justify-between">
                              <span>{new Date(date).toLocaleDateString()}</span>
                              <span className="font-medium">{count}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}