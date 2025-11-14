import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function CustomerProfile() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState(null)
  const [brandLogo, setBrandLogo] = useState('')
  const [addresses, setAddresses] = useState([])
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [newAddress, setNewAddress] = useState({
    type: 'Home',
    flatNo: '',
    buildingName: '',
    streetName: '',
    locality: '',
    landmark: '',
    city: 'Hyderabad',
    pincode: '',
    isDefault: false,
    location: null
  })
  const [showMapPicker, setShowMapPicker] = useState(false)
  const [editingProfile, setEditingProfile] = useState(false)
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: ''
  })

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null')
    if (!user) {
      router.push('/customer/marketplace')
      return
    }
    setCurrentUser(user)
    setProfileData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || ''
    })
    loadAddresses(user.id)
    loadBrandSettings()
  }, [])

  const loadBrandSettings = async () => {
    try {
      const { collection, getDocs } = await import('firebase/firestore')
      const { db } = await import('../../lib/firebase')
      
      const brandSnap = await getDocs(collection(db, 'brandSettings'))
      if (brandSnap.docs.length > 0) {
        setBrandLogo(brandSnap.docs[0].data().logo || '')
      }
    } catch (error) {
      console.error('Error loading brand settings:', error)
    }
  }

  const loadAddresses = async (userId) => {
    try {
      const { userService } = await import('../../lib/dbService')
      const profile = await userService.getProfile(userId)
      if (profile && profile.addresses) {
        setAddresses(profile.addresses)
      }
    } catch (error) {
      console.error('Error loading addresses:', error)
    }
  }

  const saveProfile = async () => {
    try {
      const { userService } = await import('../../lib/dbService')
      await userService.updateProfile(currentUser.id, profileData)
      
      // Update localStorage
      const updatedUser = { ...currentUser, ...profileData }
      localStorage.setItem('currentUser', JSON.stringify(updatedUser))
      setCurrentUser(updatedUser)
      setEditingProfile(false)
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Error updating profile. Please try again.')
    }
  }

  const addAddress = async () => {
    if (!newAddress.flatNo || !newAddress.streetName || !newAddress.city || !newAddress.pincode) {
      alert('Please fill all required fields (marked with *)')
      return
    }
    
    try {
      // Construct full address from components
      const fullAddress = [
        newAddress.flatNo,
        newAddress.buildingName,
        newAddress.streetName,
        newAddress.locality,
        newAddress.landmark && `Near ${newAddress.landmark}`,
        newAddress.city,
        newAddress.pincode
      ].filter(Boolean).join(', ')

      const addressData = { ...newAddress, address: fullAddress }
      const { userService } = await import('../../lib/dbService')
      const savedAddress = await userService.addAddress(currentUser.id, addressData)
      
      setAddresses([...addresses, savedAddress])
      setShowAddressForm(false)
      setNewAddress({
        type: 'Home',
        flatNo: '',
        buildingName: '',
        streetName: '',
        locality: '',
        landmark: '',
        city: 'Hyderabad',
        pincode: '',
        isDefault: false,
        location: null
      })
      alert('Address added successfully!')
    } catch (error) {
      console.error('Error adding address:', error)
      alert('Error adding address. Please try again.')
    }
  }

  if (!currentUser) {
    return <div style={{ padding: '20px' }}>Loading...</div>
  }

  return (
    <>
      {/* Navigation */}
      <nav style={{
        backgroundColor: '#ffffff',
        padding: '12px 20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center'
        }}>
          <Link href="/customer/marketplace" style={{ 
            color: '#16a34a', 
            textDecoration: 'none', 
            fontSize: '24px', 
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {brandLogo ? (
              <img src={brandLogo} alt="FreshCuts Logo" style={{ 
                height: '40px', 
                objectFit: 'contain',
                verticalAlign: 'middle'
              }} />
            ) : (
              'FreshCuts'
            )}
          </Link>
        </div>
      </nav>

      <div style={{ padding: '40px 20px', paddingBottom: '100px', maxWidth: '800px', margin: '0 auto', fontFamily: 'system-ui' }}>
        
        {/* Mobile Bottom Tab Bar */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e5e7eb',
          padding: '8px 0',
          zIndex: 100,
          boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
          display: window.innerWidth <= 768 ? 'block' : 'none'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            maxWidth: '400px',
            margin: '0 auto'
          }}>
            <Link href="/customer/marketplace" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              color: '#6b7280',
              padding: '8px',
              fontSize: '10px',
              gap: '4px'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/>
              </svg>
              Home
            </Link>
            
            <Link href="/customer/cart" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              color: '#6b7280',
              padding: '8px',
              fontSize: '10px',
              gap: '4px'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 18C5.9 18 5 18.9 5 20S5.9 22 7 22 9 21.1 9 20 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5H5.21L4.27 3H1M17 18C15.9 18 15 18.9 15 20S15.9 22 17 22 19 21.1 19 20 18.1 18 17 18Z"/>
              </svg>
              Cart
            </Link>
            
            <Link href="/customer/orders" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              color: '#6b7280',
              padding: '8px',
              fontSize: '10px',
              gap: '4px'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5,3C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19H5V5H12V3H5M17.78,4C17.61,4 17.43,4.07 17.3,4.2L16.08,5.41L18.58,7.91L19.8,6.7C20.06,6.44 20.06,6 19.8,5.75L18.25,4.2C18.12,4.07 17.95,4 17.78,4M15.37,6.12L8,13.5V16H10.5L17.87,8.62L15.37,6.12Z"/>
              </svg>
              Orders
            </Link>
            
            <Link href="/customer/profile" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              color: '#16a34a',
              padding: '8px',
              fontSize: '10px',
              gap: '4px'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5V9C15 10.1 14.1 11 13 11H11C9.9 11 9 10.1 9 9V7.5L3 7V9C3 10.1 3.9 11 5 11H7V20C7 21.1 7.9 22 9 22H15C16.1 22 17 21.1 17 20V11H19C20.1 11 21 10.1 21 9Z"/>
              </svg>
              Profile
            </Link>
          </div>
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', marginBottom: '30px' }}>
          Manage Profile
        </h1>

        {/* Profile Information */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '30px', 
          borderRadius: '12px', 
          border: '1px solid #e5e7eb',
          marginBottom: '30px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <h2 style={{ fontSize: '20px', color: '#374151', margin: '0' }}>Personal Information</h2>
            <button
              onClick={() => setEditingProfile(!editingProfile)}
              style={{
                padding: '8px 16px',
                backgroundColor: editingProfile ? '#ef4444' : '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {editingProfile ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {editingProfile ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Name:</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Email:</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Phone:</label>
                <input
                  type="text"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                />
              </div>
              <button
                onClick={saveProfile}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#16a34a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                Save Changes
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <span style={{ color: '#6b7280', fontSize: '14px' }}>Name:</span>
                <div style={{ fontSize: '16px', fontWeight: '500', color: '#374151' }}>{currentUser.name}</div>
              </div>
              <div>
                <span style={{ color: '#6b7280', fontSize: '14px' }}>Email:</span>
                <div style={{ fontSize: '16px', fontWeight: '500', color: '#374151' }}>{currentUser.email || 'Not provided'}</div>
              </div>
              <div>
                <span style={{ color: '#6b7280', fontSize: '14px' }}>Phone:</span>
                <div style={{ fontSize: '16px', fontWeight: '500', color: '#374151' }}>{currentUser.phone}</div>
              </div>
            </div>
          )}
        </div>

        {/* Addresses */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '30px', 
          borderRadius: '12px', 
          border: '1px solid #e5e7eb',
          marginBottom: '30px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <h2 style={{ fontSize: '20px', color: '#374151', margin: '0' }}>Saved Addresses</h2>
            <button
              onClick={() => setShowAddressForm(!showAddressForm)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {showAddressForm ? 'Cancel' : 'Add Address'}
            </button>
          </div>

          {showAddressForm && (
            <div style={{ marginBottom: '25px', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Address Type:</label>
                  <select
                    value={newAddress.type}
                    onChange={(e) => setNewAddress({...newAddress, type: e.target.value})}
                    style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                  >
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Flat/House No *:</label>
                    <input
                      type="text"
                      placeholder="e.g., 4B, 201"
                      value={newAddress.flatNo}
                      onChange={(e) => setNewAddress({...newAddress, flatNo: e.target.value})}
                      style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Building/Block:</label>
                    <input
                      type="text"
                      placeholder="e.g., Tower A, Block 5"
                      value={newAddress.buildingName}
                      onChange={(e) => setNewAddress({...newAddress, buildingName: e.target.value})}
                      style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                    />
                  </div>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Street Name *:</label>
                  <input
                    type="text"
                    placeholder="e.g., MG Road, 1st Main Street"
                    value={newAddress.streetName}
                    onChange={(e) => setNewAddress({...newAddress, streetName: e.target.value})}
                    style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Area/Locality:</label>
                  <input
                    type="text"
                    placeholder="e.g., Banjara Hills, Jubilee Hills"
                    value={newAddress.locality}
                    onChange={(e) => setNewAddress({...newAddress, locality: e.target.value})}
                    style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Landmark:</label>
                  <input
                    type="text"
                    placeholder="Near Metro, Mall, etc."
                    value={newAddress.landmark}
                    onChange={(e) => setNewAddress({...newAddress, landmark: e.target.value})}
                    style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>City *:</label>
                    <input
                      type="text"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                      style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>PIN *:</label>
                    <input
                      type="text"
                      value={newAddress.pincode}
                      onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})}
                      style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                    />
                  </div>
                </div>

                {newAddress.location?.lat && (
                  <div style={{ padding: '8px', backgroundColor: '#f0f9ff', borderRadius: '4px', border: '1px solid #bfdbfe' }}>
                    <p style={{ fontSize: '12px', color: '#1e40af', margin: '0' }}>
                      ✓ Location selected on map
                    </p>
                  </div>
                )}

                <label style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={newAddress.isDefault}
                    onChange={(e) => setNewAddress({...newAddress, isDefault: e.target.checked})}
                    style={{ marginRight: '8px' }}
                  />
                  Set as default address
                </label>
                
                <button
                  onClick={addAddress}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#16a34a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  Save Address
                </button>
              </div>
            </div>
          )}

          {addresses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>📍</div>
              <p>No addresses saved yet. Add your first address!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {addresses.map(address => (
                <div key={address.id} style={{
                  padding: '20px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  border: address.isDefault ? '2px solid #16a34a' : '1px solid #e5e7eb'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <strong style={{ color: '#374151' }}>{address.type}</strong>
                        {address.isDefault && (
                          <span style={{ 
                            backgroundColor: '#16a34a', 
                            color: 'white', 
                            padding: '2px 8px', 
                            borderRadius: '12px', 
                            fontSize: '12px' 
                          }}>
                            Default
                          </span>
                        )}
                      </div>
                      <p style={{ margin: '0', color: '#6b7280', lineHeight: '1.5' }}>
                        {address.address}<br/>
                        {address.city} - {address.pincode}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>


      </div>
    </>
  )
}