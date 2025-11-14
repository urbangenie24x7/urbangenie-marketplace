import { useState, useEffect } from 'react'
import { collection, getDocs, updateDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { requireAuth } from '../../lib/auth'

export default function VendorApplications() {
  const [applications, setApplications] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [filter, setFilter] = useState('all')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const user = requireAuth(['admin', 'super_admin'])
    if (!user) return
    
    setCurrentUser(user)
    setMounted(true)
    loadApplications()
  }, [])

  const loadApplications = async () => {
    try {
      const appsSnap = await getDocs(collection(db, 'vendorApplications'))
      const apps = appsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setApplications(apps.sort((a, b) => b.appliedAt?.seconds - a.appliedAt?.seconds))
    } catch (error) {
      console.error('Error loading applications:', error)
    }
  }

  const handleApprove = async (application) => {
    try {
      // Generate temporary password
      const tempPassword = Math.random().toString(36).slice(-8)
      
      // Create vendor record with role field
      await addDoc(collection(db, 'vendors'), {
        name: application.ownerName,
        businessName: application.businessName,
        phone: application.phone,
        email: application.email,
        password: tempPassword,
        role: 'vendor',
        address: application.address,
        pincode: application.pincode,
        businessType: application.businessType,
        categories: application.categories,
        experience: application.experience,
        gstNumber: application.documents?.gstNumber || '',
        status: 'active',
        joinedAt: serverTimestamp(),
        createdAt: serverTimestamp()
      })

      // Send SMS with credentials
      const smsMessage = `Welcome to FreshCuts! Your vendor account is approved.\n\nBusiness: ${application.businessName}\nLogin: ${application.email}\nPassword: ${tempPassword}\n\nVisit: freshcuts.com/vendor\nChange password after first login.`
      
      const smsResult = await fetch('/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: application.phone,
          message: smsMessage
        })
      })

      // Update application status
      await updateDoc(doc(db, 'vendorApplications', application.id), {
        status: 'approved',
        approvedAt: serverTimestamp(),
        approvedBy: currentUser.name,
        tempPassword: tempPassword,
        smsSent: smsResult.ok
      })

      const smsStatus = smsResult.ok ? 'SMS sent successfully!' : 'SMS failed to send.'
      alert(`Vendor approved successfully!\n\nLogin Credentials:\nEmail: ${application.email}\nPassword: ${tempPassword}\n\n${smsStatus}`)
      loadApplications()
    } catch (error) {
      console.error('Error approving vendor:', error)
      alert('Failed to approve vendor')
    }
  }

  const handleReject = async (application) => {
    if (confirm('Are you sure you want to reject this application?')) {
      try {
        await updateDoc(doc(db, 'vendorApplications', application.id), {
          status: 'rejected',
          rejectedAt: serverTimestamp(),
          rejectedBy: currentUser.name
        })
        alert('Application rejected')
        loadApplications()
      } catch (error) {
        console.error('Error rejecting application:', error)
        alert('Failed to reject application')
      }
    }
  }

  const filteredApplications = applications.filter(app => 
    filter === 'all' || app.status === filter
  )

  const getStatusCounts = () => {
    return {
      all: applications.length,
      pending: applications.filter(app => app.status === 'pending').length,
      approved: applications.filter(app => app.status === 'approved').length,
      rejected: applications.filter(app => app.status === 'rejected').length
    }
  }

  if (!mounted) {
    return <div style={{ padding: '20px' }}>Loading...</div>
  }

  const statusCounts = getStatusCounts()

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', padding: '20px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ color: '#1f2937', margin: '0 0 4px 0', fontSize: '28px', fontWeight: '700' }}>Vendor Applications</h1>
            <p style={{ color: '#6b7280', margin: '0', fontSize: '16px' }}>Review and manage vendor partnership requests</p>
          </div>
          <a href="/admin/dashboard" style={{ 
            padding: '10px 20px', 
            backgroundColor: '#374151', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/>
            </svg>
            Dashboard
          </a>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          {[
            { key: 'all', label: 'Total Applications', count: statusCounts.all, color: '#3b82f6' },
            { key: 'pending', label: 'Pending Review', count: statusCounts.pending, color: '#f59e0b' },
            { key: 'approved', label: 'Approved', count: statusCounts.approved, color: '#10b981' },
            { key: 'rejected', label: 'Rejected', count: statusCounts.rejected, color: '#ef4444' }
          ].map(stat => (
            <div 
              key={stat.key}
              onClick={() => setFilter(stat.key)}
              style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '12px',
                border: filter === stat.key ? `2px solid ${stat.color}` : '1px solid #e2e8f0',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: filter === stat.key ? `0 4px 12px ${stat.color}20` : '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 4px 0', fontWeight: '500' }}>{stat.label}</p>
                  <p style={{ color: '#1f2937', fontSize: '24px', margin: '0', fontWeight: '700' }}>{stat.count}</p>
                </div>
                <div style={{ width: '40px', height: '40px', backgroundColor: `${stat.color}15`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '8px', height: '8px', backgroundColor: stat.color, borderRadius: '50%' }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Applications List */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          {filteredApplications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ width: '80px', height: '80px', backgroundColor: '#f3f4f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="#9ca3af">
                  <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z"/>
                </svg>
              </div>
              <h3 style={{ color: '#374151', fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>No applications found</h3>
              <p style={{ color: '#6b7280', margin: '0' }}>No vendor applications match the current filter.</p>
            </div>
          ) : (
            filteredApplications.map((app, index) => (
              <div key={app.id} style={{
                padding: '24px',
                borderBottom: index < filteredApplications.length - 1 ? '1px solid #f1f5f9' : 'none'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{ color: '#1f2937', fontSize: '20px', fontWeight: '700', margin: '0 0 6px 0' }}>
                      {app.businessName}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#6b7280' }}>
                      <span>Applied {app.appliedAt?.toDate?.()?.toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{app.ownerName}</span>
                      <span>•</span>
                      <span>{app.pincode}</span>
                    </div>
                  </div>
                  <span style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    backgroundColor: app.status === 'pending' ? '#fef3c7' : 
                                   app.status === 'approved' ? '#dcfce7' : '#fee2e2',
                    color: app.status === 'pending' ? '#92400e' : 
                           app.status === 'approved' ? '#166534' : '#dc2626'
                  }}>
                    {app.status?.toUpperCase()}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <h4 style={{ color: '#374151', fontSize: '14px', fontWeight: '600', margin: '0 0 8px 0' }}>Contact Information</h4>
                    <p style={{ color: '#6b7280', margin: '0 0 4px 0', fontSize: '14px' }}>{app.phone}</p>
                    <p style={{ color: '#6b7280', margin: '0', fontSize: '14px' }}>{app.email}</p>
                  </div>
                  <div>
                    <h4 style={{ color: '#374151', fontSize: '14px', fontWeight: '600', margin: '0 0 8px 0' }}>Business Details</h4>
                    <p style={{ color: '#6b7280', margin: '0 0 4px 0', fontSize: '14px', textTransform: 'capitalize' }}>{app.businessType}</p>
                    <p style={{ color: '#6b7280', margin: '0', fontSize: '14px' }}>{app.experience} experience</p>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#374151', fontSize: '14px', fontWeight: '600', margin: '0 0 8px 0' }}>Product Categories</h4>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {app.categories?.map(category => (
                      <span key={category} style={{
                        backgroundColor: '#f0f9ff',
                        color: '#1e40af',
                        padding: '4px 12px',
                        borderRadius: '16px',
                        fontSize: '12px',
                        fontWeight: '500',
                        textTransform: 'capitalize'
                      }}>
                        {category}
                      </span>
                    ))}
                  </div>
                </div>

                {app.status === 'pending' && (
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => handleApprove(app)}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/>
                      </svg>
                      Approve & Send SMS
                    </button>
                    <button
                      onClick={() => handleReject(app)}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: 'white',
                        color: '#ef4444',
                        border: '1px solid #ef4444',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}
                    >
                      Reject
                    </button>
                  </div>
                )}

                {app.status === 'approved' && (
                  <div style={{ padding: '12px 16px', backgroundColor: '#dcfce7', borderRadius: '8px', border: '1px solid #10b981' }}>
                    <p style={{ color: '#166534', fontSize: '14px', fontWeight: '600', margin: '0 0 8px 0' }}>
                      ✓ Approved by {app.approvedBy} on {app.approvedAt?.toDate?.()?.toLocaleDateString()}
                    </p>
                    {app.tempPassword && (
                      <div style={{ backgroundColor: '#f0f9ff', padding: '8px 12px', borderRadius: '6px', border: '1px solid #3b82f6' }}>
                        <p style={{ color: '#1e40af', fontSize: '12px', fontWeight: '600', margin: '0 0 4px 0' }}>Vendor Login Credentials:</p>
                        <p style={{ color: '#1e40af', fontSize: '12px', margin: '0', fontFamily: 'monospace' }}>Email: {app.email}</p>
                        <p style={{ color: '#1e40af', fontSize: '12px', margin: '0 0 4px 0', fontFamily: 'monospace' }}>Password: {app.tempPassword}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ fontSize: '12px' }}>{app.smsSent ? '📱' : '❌'}</span>
                          <span style={{ color: app.smsSent ? '#10b981' : '#ef4444', fontSize: '11px', fontWeight: '500' }}>
                            {app.smsSent ? 'SMS sent to vendor' : 'SMS failed'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {app.status === 'rejected' && (
                  <div style={{ padding: '12px 16px', backgroundColor: '#fee2e2', borderRadius: '8px', border: '1px solid #ef4444' }}>
                    <p style={{ color: '#dc2626', fontSize: '14px', fontWeight: '600', margin: '0' }}>
                      ✗ Rejected by {app.rejectedBy} on {app.rejectedAt?.toDate?.()?.toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}