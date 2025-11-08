import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Navigation from '../../components/Navigation'
import SEOHead from '../../components/SEOHead'
import LocationPicker from '../../components/LocationPicker'
import { getCurrentUser, logout } from '../../lib/auth'

export default function CustomerProfile() {
  const [mounted, setMounted] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [editing, setEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('personal') // 'personal', 'addresses', 'preferences'
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    gender: ''
  })
  const [addresses, setAddresses] = useState([])
  const [preferences, setPreferences] = useState({
    notifications: {
      orderUpdates: true,
      promotions: false,
      newProducts: true
    },
    dietary: {
      vegetarian: false,
      halal: false,
      organic: false
    }
  })
  const [newAddress, setNewAddress] = useState({
    type: 'home',
    name: '',
    address: '',
    landmark: '',
    city: '',
    pincode: '',
    location: { lat: null, lng: null, address: '' },
    isDefault: false
  })
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      router.push('/login')
      return
    }
    
    setCurrentUser(user)
    setMounted(true)
    loadCustomerProfile(user)
  }, [])

  const loadCustomerProfile = async (user) => {
    try {
      const { collection, getDocs, query, where } = await import('firebase/firestore')
      const { db } = await import('../../lib/firebase')
      
      // Load user profile
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || ''
      })
      
      // Load addresses
      const addressesRef = collection(db, 'customerAddresses')
      const q = query(addressesRef, where('customerId', '==', user.id))
      const addressesSnap = await getDocs(q)
      
      if (!addressesSnap.empty) {
        setAddresses(addressesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      } else {
        // Create demo address
        setAddresses([{
          id: 'demo1',
          type: 'home',
          name: 'Home',
          address: '123 Main Street, Apartment 4B',
          landmark: 'Near City Mall',
          city: 'Mumbai',
          pincode: '400001',
          isDefault: true,
          customerId: user.id
        }])
      }
      
      // Load preferences (demo data)
      setPreferences({
        notifications: {
          orderUpdates: true,
          promotions: false,
          newProducts: true
        },
        dietary: {
          vegetarian: false,
          halal: false,
          organic: false
        }
      })
      
    } catch (error) {
      console.error('Error loading customer profile:', error)
    }
  }

  const updateProfile = async () => {
    setLoading(true)
    try {
      const { doc, updateDoc } = await import('firebase/firestore')
      const { db } = await import('../../lib/firebase')
      
      await updateDoc(doc(db, 'users', currentUser.id), {
        name: formData.name,
        email: formData.email,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender
      })
      
      // Update local storage
      const updatedUser = { ...currentUser, ...formData }
      localStorage.setItem('currentUser', JSON.stringify(updatedUser))
      setCurrentUser(updatedUser)
      
      setEditing(false)
      alert('Profile updated successfully!')
    } catch (error) {
      alert('Error updating profile: ' + error.message)
    }
    setLoading(false)
  }

  const addAddress = async () => {
    if (!newAddress.name || !newAddress.address || !newAddress.city || !newAddress.pincode) {
      alert('Please fill all required fields')
      return
    }

    try {
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore')
      const { db } = await import('../../lib/firebase')
      
      const addressData = {
        ...newAddress,
        customerId: currentUser.id,
        createdAt: serverTimestamp()
      }
      
      const docRef = await addDoc(collection(db, 'customerAddresses'), addressData)
      
      setAddresses(prev => [...prev, { id: docRef.id, ...addressData }])
      setNewAddress({
        type: 'home',
        name: '',
        address: '',
        landmark: '',
        city: '',
        pincode: '',
        location: { lat: null, lng: null, address: '' },
        isDefault: false
      })
      setShowAddressForm(false)
      alert('Address added successfully!')
    } catch (error) {
      alert('Error adding address: ' + error.message)
    }
  }

  const deleteAddress = async (addressId) => {
    if (!confirm('Delete this address?')) return
    
    try {
      const { doc, deleteDoc } = await import('firebase/firestore')
      const { db } = await import('../../lib/firebase')
      
      await deleteDoc(doc(db, 'customerAddresses', addressId))
      setAddresses(prev => prev.filter(addr => addr.id !== addressId))
      alert('Address deleted successfully!')
    } catch (error) {
      alert('Error deleting address: ' + error.message)
    }
  }

  const setDefaultAddress = async (addressId) => {
    setAddresses(prev => 
      prev.map(addr => ({ 
        ...addr, 
        isDefault: addr.id === addressId 
      }))
    )
  }

  if (!mounted) {
    return <div style={{ padding: '20px' }}>Loading...</div>
  }

  if (!currentUser) {
    return (
      <>
        <Navigation />
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1 style={{ color: '#dc2626' }}>Please Login</h1>
          <p>You need to login to access your profile.</p>
        </div>
      </>
    )
  }

  return (
    <>
      <SEOHead 
        title="My Profile | FreshCuts"
        description="Manage your profile, addresses and preferences"
        url="https://freshcuts.com/customer/profile"
      />
      <Navigation />
      <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#16a34a', fontSize: '32px', margin: '0' }}>My Profile</h1>
          <button
            onClick={() => router.push('/')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Back to Shop
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{ marginBottom: '30px', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', gap: '30px' }}>
            {[
              { key: 'personal', label: '👤 Personal Info', icon: '👤' },
              { key: 'addresses', label: '📍 Addresses', icon: '📍' },
              { key: 'preferences', label: '⚙️ Preferences', icon: '⚙️' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: '15px 0',
                  backgroundColor: 'transparent',
                  color: activeTab === tab.key ? '#16a34a' : '#6b7280',
                  border: 'none',
                  borderBottom: activeTab === tab.key ? '2px solid #16a34a' : '2px solid transparent',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Personal Info Tab */}
        {activeTab === 'personal' && (
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            {!editing ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ color: '#374151', fontSize: '24px', margin: '0' }}>Personal Information</h2>
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
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Full Name</label>
                    <p style={{ fontSize: '16px', color: '#6b7280', margin: '5px 0 0 0' }}>{currentUser.name}</p>
                  </div>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Phone</label>
                    <p style={{ fontSize: '16px', color: '#6b7280', margin: '5px 0 0 0' }}>{currentUser.phone}</p>
                  </div>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Email</label>
                    <p style={{ fontSize: '16px', color: '#6b7280', margin: '5px 0 0 0' }}>{currentUser.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Date of Birth</label>
                    <p style={{ fontSize: '16px', color: '#6b7280', margin: '5px 0 0 0' }}>{formData.dateOfBirth || 'Not provided'}</p>
                  </div>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Gender</label>
                    <p style={{ fontSize: '16px', color: '#6b7280', margin: '5px 0 0 0' }}>{formData.gender || 'Not specified'}</p>
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
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                      Full Name
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
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
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
                      Gender
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({...formData, gender: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
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
        )}

        {/* Addresses Tab */}
        {activeTab === 'addresses' && (
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#374151', fontSize: '24px', margin: '0' }}>Delivery Addresses</h2>
              <button
                onClick={() => setShowAddressForm(!showAddressForm)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#16a34a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                {showAddressForm ? 'Cancel' : 'Add New Address'}
              </button>
            </div>

            {showAddressForm && (
              <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px', backgroundColor: '#f9fafb', marginBottom: '20px' }}>
                <h3 style={{ color: '#374151', fontSize: '18px', marginBottom: '15px' }}>Add New Address</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                      Address Type
                    </label>
                    <select
                      value={newAddress.type}
                      onChange={(e) => setNewAddress({...newAddress, type: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    >
                      <option value="home">Home</option>
                      <option value="work">Work</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                      Address Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Home, Office"
                      value={newAddress.name}
                      onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
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
                    Full Address
                  </label>
                  <textarea
                    placeholder="House/Flat No, Building, Street"
                    value={newAddress.address}
                    onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                    rows="2"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      resize: 'vertical'
                    }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                      Landmark
                    </label>
                    <input
                      type="text"
                      placeholder="Near..."
                      value={newAddress.landmark}
                      onChange={(e) => setNewAddress({...newAddress, landmark: e.target.value})}
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
                      City
                    </label>
                    <input
                      type="text"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
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
                      Pincode
                    </label>
                    <input
                      type="text"
                      value={newAddress.pincode}
                      onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})}
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
                  <LocationPicker
                    onLocationSelect={(location) => setNewAddress({...newAddress, location})}
                    initialLocation={newAddress.location}
                  />
                </div>
                
                <button
                  onClick={addAddress}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#16a34a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '500'
                  }}
                >
                  Add Address
                </button>
              </div>
            )}

            <div style={{ display: 'grid', gap: '15px' }}>
              {addresses.map(address => (
                <div key={address.id} style={{ 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px', 
                  padding: '20px',
                  backgroundColor: address.isDefault ? '#f0f9ff' : 'white'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                        <h3 style={{ color: '#374151', fontSize: '18px', margin: '0' }}>{address.name}</h3>
                        <span style={{ 
                          padding: '2px 8px', 
                          backgroundColor: '#f3f4f6', 
                          color: '#6b7280', 
                          borderRadius: '12px', 
                          fontSize: '12px',
                          textTransform: 'capitalize'
                        }}>
                          {address.type}
                        </span>
                        {address.isDefault && (
                          <span style={{ 
                            padding: '2px 8px', 
                            backgroundColor: '#dcfce7', 
                            color: '#166534', 
                            borderRadius: '12px', 
                            fontSize: '12px'
                          }}>
                            Default
                          </span>
                        )}
                      </div>
                      <p style={{ color: '#6b7280', fontSize: '14px', margin: '0', lineHeight: '1.5' }}>
                        {address.address}
                        {address.landmark && <><br/>Near {address.landmark}</>}
                        <br/>{address.city} - {address.pincode}
                        {address.location?.lat && address.location?.lng && (
                          <><br/><span style={{ fontSize: '12px', color: '#9ca3af' }}>📍 {address.location.lat.toFixed(4)}, {address.location.lng.toFixed(4)}</span></>
                        )}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {!address.isDefault && (
                        <button
                          onClick={() => setDefaultAddress(address.id)}
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
                          Set Default
                        </button>
                      )}
                      <button
                        onClick={() => deleteAddress(address.id)}
                        style={{
                          padding: '6px 12px',
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <h2 style={{ color: '#374151', fontSize: '24px', marginBottom: '20px' }}>Preferences</h2>
            
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: '#374151', fontSize: '18px', marginBottom: '15px' }}>Notification Preferences</h3>
              <div style={{ display: 'grid', gap: '10px' }}>
                {Object.entries(preferences.notifications).map(([key, value]) => (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setPreferences(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, [key]: e.target.checked }
                      }))}
                      style={{ width: '16px', height: '16px' }}
                    />
                    <span style={{ fontSize: '14px', color: '#374151', textTransform: 'capitalize' }}>
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <h3 style={{ color: '#374151', fontSize: '18px', marginBottom: '15px' }}>Dietary Preferences</h3>
              <div style={{ display: 'grid', gap: '10px' }}>
                {Object.entries(preferences.dietary).map(([key, value]) => (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setPreferences(prev => ({
                        ...prev,
                        dietary: { ...prev.dietary, [key]: e.target.checked }
                      }))}
                      style={{ width: '16px', height: '16px' }}
                    />
                    <span style={{ fontSize: '14px', color: '#374151', textTransform: 'capitalize' }}>
                      {key}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            
            <button
              onClick={() => alert('Preferences saved!')}
              style={{
                marginTop: '20px',
                padding: '12px 24px',
                backgroundColor: '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              Save Preferences
            </button>
          </div>
        )}
      </div>
    </>
  )
}