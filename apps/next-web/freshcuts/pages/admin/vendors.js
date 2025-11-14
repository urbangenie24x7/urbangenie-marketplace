import { useState, useEffect } from 'react'
import { collection, getDocs, updateDoc, doc, deleteDoc, addDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'

export default function AdminVendors() {
  const [currentUser, setCurrentUser] = useState(null)
  const [mounted, setMounted] = useState(false)
  const [vendors, setVendors] = useState([])
  const [categories, setCategories] = useState([])
  const [editingVendor, setEditingVendor] = useState(null)
  const [tempCategories, setTempCategories] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    categories: []
  })

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser')
    if (!savedUser) {
      window.location.href = '/admin/login'
      return
    }
    
    const user = JSON.parse(savedUser)
    if (user.role !== 'admin') {
      window.location.href = '/admin/login'
      return
    }
    
    setCurrentUser(user)
    setMounted(true)
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Load vendors
      const vendorsSnap = await getDocs(collection(db, 'vendors'))
      const vendorsData = vendorsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setVendors(vendorsData)
      
      // Load products to get categories
      const productsSnap = await getDocs(collection(db, 'products'))
      const productsData = productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      const uniqueCategories = [...new Set(productsData.map(p => p.category).filter(Boolean))].sort()
      setCategories(uniqueCategories)
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const startEditingCategories = (vendor) => {
    setEditingVendor(vendor.id)
    setTempCategories(vendor.categories || vendor.products || [])
  }

  const updateVendorCategories = async (vendorId) => {
    try {
      await updateDoc(doc(db, 'vendors', vendorId), {
        categories: tempCategories
      })
      setEditingVendor(null)
      setTempCategories([])
      loadData()
    } catch (error) {
      console.error('Error updating vendor categories:', error)
    }
  }

  const toggleCategory = (category) => {
    setTempCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const handleDelete = async (vendorId) => {
    if (confirm('Are you sure you want to delete this vendor?')) {
      try {
        await deleteDoc(doc(db, 'vendors', vendorId))
        loadData()
      } catch (error) {
        console.error('Error deleting vendor:', error)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await addDoc(collection(db, 'vendors'), {
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      
      setFormData({ name: '', email: '', phone: '', address: '', categories: [] })
      setShowAddForm(false)
      loadData()
    } catch (error) {
      console.error('Error adding vendor:', error)
    }
  }

  const toggleFormCategory = (category) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }))
  }

  if (!mounted) {
    return <div style={{ padding: '20px' }}>Loading...</div>
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', padding: '20px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ color: '#1f2937', margin: '0 0 4px 0', fontSize: '28px', fontWeight: '700' }}>Vendor Master</h1>
            <p style={{ color: '#6b7280', margin: '0', fontSize: '16px' }}>Manage vendors and their categories</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => window.location.href = '/admin/dashboard'}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => {
                setShowAddForm(true)
                setFormData({ name: '', email: '', phone: '', address: '', categories: [] })
              }}
              style={{
                padding: '10px 20px',
                backgroundColor: '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              Add Vendor
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
        {/* Add Vendor Form */}
        {showAddForm && (
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '30px' }}>
            <h3 style={{ color: '#1f2937', fontSize: '18px', margin: '0 0 20px 0', fontWeight: '600' }}>Add New Vendor</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Vendor Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Categories</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {categories.map(category => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => toggleFormCategory(category)}
                      style={{
                        padding: '8px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '16px',
                        backgroundColor: formData.categories.includes(category) ? '#16a34a' : 'white',
                        color: formData.categories.includes(category) ? 'white' : '#374151',
                        cursor: 'pointer',
                        fontSize: '12px',
                        textTransform: 'capitalize'
                      }}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="submit"
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#16a34a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  Add Vendor
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Vendors List */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ color: '#1f2937', fontSize: '18px', margin: '0', fontWeight: '600' }}>
              Vendors ({vendors.length})
            </h3>
          </div>
          
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
              {vendors.map(vendor => (
                <div key={vendor.id} style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '20px',
                  backgroundColor: 'white',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h4 style={{ color: '#1f2937', fontSize: '18px', margin: '0', fontWeight: '600' }}>
                      {vendor.name || vendor.businessName}
                    </h4>
                    <button
                      onClick={() => handleDelete(vendor.id)}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                  
                  <div style={{ marginBottom: '12px' }}>
                    <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 4px 0' }}>
                      <strong>Phone:</strong> {vendor.phone || 'Not provided'}
                    </p>
                    <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 4px 0' }}>
                      <strong>Email:</strong> {vendor.email || 'Not provided'}
                    </p>
                    <p style={{ color: '#6b7280', fontSize: '14px', margin: '0' }}>
                      <strong>Address:</strong> {vendor.address || 'Not provided'}
                    </p>
                  </div>
                  
                  {/* Categories Management */}
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Categories:</span>
                      <button
                        onClick={() => startEditingCategories(vendor)}
                        style={{
                          padding: '4px 8px',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        Edit
                      </button>
                    </div>
                    
                    {editingVendor === vendor.id ? (
                      <div style={{ padding: '12px', backgroundColor: '#f9fafb', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                          {categories.map(category => (
                            <button
                              key={category}
                              onClick={() => toggleCategory(category)}
                              style={{
                                padding: '6px 12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '16px',
                                backgroundColor: tempCategories.includes(category) ? '#16a34a' : 'white',
                                color: tempCategories.includes(category) ? 'white' : '#374151',
                                cursor: 'pointer',
                                fontSize: '12px',
                                textTransform: 'capitalize'
                              }}
                            >
                              {category}
                            </button>
                          ))}
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => updateVendorCategories(vendor.id)}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: '#16a34a',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '12px',
                              cursor: 'pointer'
                            }}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingVendor(null)}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: '#6b7280',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '12px',
                              cursor: 'pointer'
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {(vendor.categories || vendor.products || []).length > 0 ? (
                          (vendor.categories || vendor.products || []).map(category => (
                            <span key={category} style={{
                              backgroundColor: '#dcfce7',
                              color: '#16a34a',
                              padding: '4px 8px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '500',
                              textTransform: 'capitalize'
                            }}>
                              {category}
                            </span>
                          ))
                        ) : (
                          <span style={{ color: '#9ca3af', fontSize: '12px' }}>No categories assigned</span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div style={{ fontSize: '12px', color: '#9ca3af', borderTop: '1px solid #f3f4f6', paddingTop: '8px' }}>
                    ID: {vendor.id}
                  </div>
                </div>
              ))}
            </div>
            
            {vendors.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                <p style={{ fontSize: '16px', margin: '0' }}>No vendors found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}