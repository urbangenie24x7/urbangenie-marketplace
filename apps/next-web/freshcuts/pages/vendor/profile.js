import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Navigation from '../../components/Navigation'
import SEOHead from '../../components/SEOHead'
import LocationPicker from '../../components/LocationPicker'
import { getCurrentUser, logout, requireAuth } from '../../lib/auth'

export default function VendorProfile() {
  const [mounted, setMounted] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [currentVendor, setCurrentVendor] = useState(null)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    description: '',
    location: { lat: null, lng: null, address: '' },
    businessHours: {
      open: '09:00',
      close: '18:00',
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    }
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const user = requireAuth(['vendor'])
    if (!user) return
    
    if (user.role !== 'vendor') {
      router.push('/unauthorized')
      return
    }
    
    setCurrentUser(user)
    setMounted(true)
    loadVendorProfile(user)
  }, [])

  const loadVendorProfile = async (user) => {
    try {
      const { collection, getDocs, query, where } = await import('firebase/firestore')
      const { db } = await import('../../lib/firebase')
      
      const vendorsRef = collection(db, 'vendors')
      const q = query(vendorsRef, where('phone', '==', user.phone))
      const vendorsSnap = await getDocs(q)
      
      if (!vendorsSnap.empty) {
        const vendorData = vendorsSnap.docs[0].data()
        setCurrentVendor({ id: vendorsSnap.docs[0].id, ...vendorData })
        setFormData({
          name: vendorData.name || '',
          phone: vendorData.phone || '',
          email: vendorData.email || '',
          address: vendorData.address || '',
          description: vendorData.description || '',
          location: vendorData.location || { lat: null, lng: null, address: '' },
          businessHours: vendorData.businessHours || {
            open: '09:00',
            close: '18:00',
            days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
          }
        })
      }
    } catch (error) {
      console.error('Error loading vendor profile:', error)
    }
  }

  const updateProfile = async () => {
    setLoading(true)
    try {
      const { doc, updateDoc } = await import('firebase/firestore')
      const { db } = await import('../../lib/firebase')
      
      await updateDoc(doc(db, 'vendors', currentVendor.id), {
        name: formData.name,
        email: formData.email,
        address: formData.address,
        description: formData.description,
        location: formData.location,
        businessHours: formData.businessHours
      })
      
      setCurrentVendor(prev => ({ ...prev, ...formData }))
      setEditing(false)
      alert('Profile updated successfully!')
    } catch (error) {
      alert('Error updating profile: ' + error.message)
    }
    setLoading(false)
  }

  const toggleDay = (day) => {
    setFormData(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        days: prev.businessHours.days.includes(day)
          ? prev.businessHours.days.filter(d => d !== day)
          : [...prev.businessHours.days, day]
      }
    }))
  }

  if (!mounted) {
    return <div style={{ padding: '20px' }}>Loading...</div>
  }

  if (!currentVendor) {
    return (
      <>
        <Navigation />
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1 style={{ color: '#dc2626' }}>Vendor Profile Not Found</h1>
          <p>Contact admin to set up your vendor account.</p>
        </div>
      </>
    )
  }

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

  return (
    <>
      <SEOHead 
        title="Vendor Profile | FreshCuts"
        description="Manage your vendor profile and business settings"
        url="https://freshcuts.com/vendor/profile"
      />
      <Navigation />
      <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ color: '#16a34a', fontSize: '32px', margin: '0' }}>Vendor Profile</h1>
        </div>

        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
          {!editing ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: '#374151', fontSize: '24px', margin: '0' }}>Business Information</h2>
                <button
                  onClick={() => setEditing(true)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#16a34a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Edit Profile
                </button>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Business Name</label>
                  <p style={{ fontSize: '16px', color: '#6b7280', margin: '5px 0 0 0' }}>{currentVendor.name}</p>
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Phone</label>
                  <p style={{ fontSize: '16px', color: '#6b7280', margin: '5px 0 0 0' }}>{currentVendor.phone}</p>
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Email</label>
                  <p style={{ fontSize: '16px', color: '#6b7280', margin: '5px 0 0 0' }}>{currentVendor.email || 'Not provided'}</p>
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Categories</label>
                  <p style={{ fontSize: '16px', color: '#6b7280', margin: '5px 0 0 0' }}>
                    {currentVendor.products?.map(cat => cat.charAt(0).toUpperCase() + cat.slice(1)).join(', ') || 'None assigned'}
                  </p>
                </div>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Address</label>
                <p style={{ fontSize: '16px', color: '#6b7280', margin: '5px 0 0 0' }}>{currentVendor.address || 'Not provided'}</p>
                {currentVendor.location?.lat && currentVendor.location?.lng && (
                  <p style={{ fontSize: '12px', color: '#9ca3af', margin: '5px 0 0 0' }}>
                    📍 Location: {currentVendor.location.lat.toFixed(4)}, {currentVendor.location.lng.toFixed(4)}
                  </p>
                )}
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Business Description</label>
                <p style={{ fontSize: '16px', color: '#6b7280', margin: '5px 0 0 0' }}>{currentVendor.description || 'No description provided'}</p>
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Business Hours</label>
                <div style={{ marginTop: '10px' }}>
                  <p style={{ fontSize: '16px', color: '#6b7280', margin: '0' }}>
                    {currentVendor.businessHours?.open || '09:00'} - {currentVendor.businessHours?.close || '18:00'}
                  </p>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: '5px 0 0 0' }}>
                    {currentVendor.businessHours?.days?.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(', ') || 'Monday - Saturday'}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: '#374151', fontSize: '24px', margin: '0' }}>Edit Profile</h2>
                <button
                  onClick={() => setEditing(false)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                  Business Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                  placeholder="Describe your business..."
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <LocationPicker
                  onLocationSelect={(location) => setFormData({...formData, location})}
                  initialLocation={formData.location}
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                  Business Hours
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '10px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: '#6b7280' }}>Opening Time</label>
                    <input
                      type="time"
                      value={formData.businessHours.open}
                      onChange={(e) => setFormData({
                        ...formData,
                        businessHours: { ...formData.businessHours, open: e.target.value }
                      })}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: '#6b7280' }}>Closing Time</label>
                    <input
                      type="time"
                      value={formData.businessHours.close}
                      onChange={(e) => setFormData({
                        ...formData,
                        businessHours: { ...formData.businessHours, close: e.target.value }
                      })}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#6b7280' }}>Operating Days</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {days.map(day => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        style={{
                          padding: '6px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '16px',
                          backgroundColor: formData.businessHours.days.includes(day) ? '#16a34a' : 'white',
                          color: formData.businessHours.days.includes(day) ? 'white' : '#374151',
                          cursor: 'pointer',
                          fontSize: '12px',
                          textTransform: 'capitalize'
                        }}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <button
                onClick={updateProfile}
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  backgroundColor: loading ? '#9ca3af' : '#16a34a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  )
}