import { useState, useEffect } from 'react'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, where } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { getCurrentUser, requireAuth } from '../../lib/auth'
import ImageUpload from '../../components/ImageUpload'

export default function ContentManagement() {
  const [bannerAds, setBannerAds] = useState([])
  const [categoryCards, setCategoryCards] = useState([])
  const [brandSettings, setBrandSettings] = useState({})
  const [activeTab, setActiveTab] = useState('banners')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({})
  const [currentUser, setCurrentUser] = useState(null)
  const [userVerticals, setUserVerticals] = useState([])
  const [mounted, setMounted] = useState(false)
  const [saveStatus, setSaveStatus] = useState('')

  useEffect(() => {
    // Check authentication and get user verticals
    const user = requireAuth(['admin', 'super_admin'])
    if (!user) return
    
    setCurrentUser(user)
    setUserVerticals(user.verticals || [])
    setMounted(true)
    loadData(user)
  }, [])

  const loadData = async (user) => {
    try {
      if (user.role === 'super_admin') {
        // Super admin can see all content
        const bannerSnap = await getDocs(collection(db, 'bannerAds'))
        setBannerAds(bannerSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })))

        const categorySnap = await getDocs(collection(db, 'categoryCards'))
        setCategoryCards(categorySnap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
        
        // Load brand settings
        const brandSnap = await getDocs(collection(db, 'brandSettings'))
        if (brandSnap.docs.length > 0) {
          setBrandSettings({ id: brandSnap.docs[0].id, ...brandSnap.docs[0].data() })
        }
      } else {
        // Vertical admin can only see content for their verticals
        const bannerQuery = query(
          collection(db, 'bannerAds'),
          where('vertical', 'in', user.verticals || ['freshcuts'])
        )
        const bannerSnap = await getDocs(bannerQuery)
        setBannerAds(bannerSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })))

        const categoryQuery = query(
          collection(db, 'categoryCards'),
          where('vertical', 'in', user.verticals || ['freshcuts'])
        )
        const categorySnap = await getDocs(categoryQuery)
        setCategoryCards(categorySnap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      }
    } catch (error) {
      console.error('Error loading data:', error)
      // Fallback to load all if query fails
      const bannerSnap = await getDocs(collection(db, 'bannerAds'))
      setBannerAds(bannerSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      const categorySnap = await getDocs(collection(db, 'categoryCards'))
      setCategoryCards(categorySnap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    }
  }

  const handleSave = async () => {
    try {
      const collectionName = activeTab === 'banners' ? 'bannerAds' : 'categoryCards'
      
      // Add vertical information to the data
      const dataWithVertical = {
        ...formData,
        vertical: currentUser.role === 'super_admin' ? (formData.vertical || 'freshcuts') : 'freshcuts'
      }
      
      if (editingItem) {
        await updateDoc(doc(db, collectionName, editingItem.id), {
          ...dataWithVertical,
          updatedAt: serverTimestamp()
        })
      } else {
        await addDoc(collection(db, collectionName), {
          ...dataWithVertical,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        })
      }
      
      setShowAddForm(false)
      setEditingItem(null)
      setFormData({})
      loadData(currentUser)
    } catch (error) {
      console.error('Error saving:', error)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        const collectionName = activeTab === 'banners' ? 'bannerAds' : 'categoryCards'
        await deleteDoc(doc(db, collectionName, id))
        loadData(currentUser)
      } catch (error) {
        console.error('Error deleting:', error)
      }
    }
  }

  const startEdit = (item) => {
    setEditingItem(item)
    setFormData(item)
    setShowAddForm(true)
  }

  const resetForm = () => {
    setShowAddForm(false)
    setEditingItem(null)
    setFormData({})
  }

  if (!mounted) {
    return <div style={{ padding: '20px' }}>Loading...</div>
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ color: '#16a34a', margin: '0' }}>Content Management</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: '5px 0 0 0' }}>
            {currentUser?.name} | Role: <span style={{ 
              backgroundColor: currentUser?.role === 'super_admin' ? '#dc2626' : '#3b82f6',
              color: 'white',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '500',
              textTransform: 'capitalize'
            }}>
              {currentUser?.role === 'super_admin' ? 'Super Admin' : 'FreshCuts Admin'}
            </span>
            {currentUser?.role !== 'super_admin' && (
              <span style={{ marginLeft: '10px', fontSize: '12px' }}>
                Vertical: FreshCuts
              </span>
            )}
          </p>
        </div>
        <a href="/admin/dashboard" style={{ 
          padding: '8px 16px', 
          backgroundColor: '#6b7280', 
          color: 'white', 
          textDecoration: 'none', 
          borderRadius: '6px' 
        }}>
          ← Back to Dashboard
        </a>
      </div>

      {/* Tabs */}
      <div style={{ marginBottom: '30px', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <button
            onClick={() => setActiveTab('banners')}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderBottom: activeTab === 'banners' ? '2px solid #16a34a' : 'none',
              backgroundColor: 'transparent',
              color: activeTab === 'banners' ? '#16a34a' : '#6b7280',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Banner Ads
          </button>

          <button
            onClick={() => setActiveTab('brand')}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderBottom: activeTab === 'brand' ? '2px solid #16a34a' : 'none',
              backgroundColor: 'transparent',
              color: activeTab === 'brand' ? '#16a34a' : '#6b7280',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Brand Settings
          </button>
        </div>
      </div>

      {/* Add Button - Only show for banners and categories */}
      {activeTab !== 'brand' && (
        <button
          onClick={() => setShowAddForm(true)}
          style={{
            padding: '12px 24px',
            backgroundColor: '#16a34a',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginBottom: '20px',
            fontWeight: '600'
          }}
        >
          Add {activeTab === 'banners' ? 'Banner Ad' : 'Category Card'}
        </button>
      )}

      {/* Banner Ads Tab */}
      {activeTab === 'banners' && (
        <div>
          <div style={{ display: 'grid', gap: '15px' }}>
            {bannerAds.map(ad => (
              <div key={ad.id} style={{
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: 'white'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <h3 style={{ margin: '0 0 10px 0' }}>{ad.text}</h3>
                    <p style={{ color: '#6b7280', margin: '0 0 10px 0' }}>Order: {ad.order}</p>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      backgroundColor: ad.active ? '#dcfce7' : '#fee2e2',
                      color: ad.active ? '#166534' : '#dc2626'
                    }}>
                      {ad.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => startEdit(ad)}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(ad.id)}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
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



      {/* Brand Settings Tab */}
      {activeTab === 'brand' && (
        <div>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ color: '#374151', fontSize: '20px', marginBottom: '20px' }}>Logo Management</h3>
            
            {brandSettings.logo && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>Current Logo:</label>
                <img 
                  src={brandSettings.logo} 
                  alt="Current Logo"
                  style={{ 
                    height: '60px', 
                    objectFit: 'contain',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '10px',
                    backgroundColor: '#f9fafb'
                  }}
                />
              </div>
            )}
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>Logo Size:</label>
              <input
                type="range"
                min="30"
                max="80"
                value={brandSettings.logoHeight || 40}
                onChange={async (e) => {
                  const newHeight = parseInt(e.target.value)
                  try {
                    const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore')
                    
                    if (brandSettings.id) {
                      await updateDoc(doc(db, 'brandSettings', brandSettings.id), {
                        ...brandSettings,
                        logoHeight: newHeight,
                        updatedAt: serverTimestamp()
                      })
                    }
                    
                    setBrandSettings(prev => ({ ...prev, logoHeight: newHeight }))
                  } catch (error) {
                    console.error('Error updating logo size:', error)
                  }
                }}
                style={{ width: '100%', marginBottom: '10px' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b7280' }}>
                <span>Small (30px)</span>
                <span>Current: {brandSettings.logoHeight || 40}px</span>
                <span>Large (80px)</span>
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>Upload New Logo:</label>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0]
                    if (!file) return

                    try {
                      const { uploadLogoToCloudinary, convertToBase64 } = await import('../../lib/cloudinary')
                      const { doc, updateDoc, addDoc, serverTimestamp } = await import('firebase/firestore')
                      
                      let imageUrl
                      try {
                        imageUrl = await uploadLogoToCloudinary(file)
                      } catch (error) {
                        console.warn('Cloudinary upload failed, using base64 fallback:', error)
                        imageUrl = await convertToBase64(file)
                      }
                      
                      if (brandSettings.id) {
                        await updateDoc(doc(db, 'brandSettings', brandSettings.id), {
                          ...brandSettings,
                          logo: imageUrl,
                          updatedAt: serverTimestamp()
                        })
                      } else {
                        const docRef = await addDoc(collection(db, 'brandSettings'), {
                          logo: imageUrl,
                          vertical: 'freshcuts',
                          brandName: 'FreshCuts',
                          tagline: 'Fresh Meat, Delivered Daily',
                          createdAt: serverTimestamp(),
                          updatedAt: serverTimestamp()
                        })
                        setBrandSettings({ id: docRef.id, logo: imageUrl, vertical: 'freshcuts', brandName: 'FreshCuts', tagline: 'Fresh Meat, Delivered Daily' })
                      }
                      
                      setBrandSettings(prev => ({ ...prev, logo: imageUrl }))
                      alert('Logo updated successfully!')
                    } catch (error) {
                      console.error('Error updating logo:', error)
                      alert('Failed to update logo')
                    }
                  }}
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '4px'
                  }}
                />
              </div>
            </div>
            
            {brandSettings.logo && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>Logo URL:</label>
                <input
                  type="text"
                  value={brandSettings.logo}
                  readOnly
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '4px',
                    backgroundColor: '#f9fafb',
                    fontSize: '12px',
                    color: '#374151'
                  }}
                  onClick={(e) => e.target.select()}
                />
                <p style={{ fontSize: '11px', color: '#6b7280', margin: '5px 0 0 0' }}>Click to select and copy the URL</p>
              </div>
            )}
            
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: '#374151', fontSize: '18px', marginBottom: '20px' }}>Layout Settings</h3>
              
              <div style={{ marginBottom: '25px', padding: '15px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <h4 style={{ color: '#374151', fontSize: '16px', marginBottom: '15px', margin: '0 0 15px 0' }}>Landing Page Layout</h4>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Category Cards Per Row:</label>
                  <select
                    value={brandSettings.landingCategoryCardsPerRow || 6}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value)
                      setBrandSettings(prev => ({ ...prev, landingCategoryCardsPerRow: newValue }))
                    }}
                    style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                  >
                    <option value={3}>3 per row</option>
                    <option value={4}>4 per row</option>
                    <option value={5}>5 per row</option>
                    <option value={6}>6 per row</option>
                  </select>
                </div>
              </div>
              
              <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                <h4 style={{ color: '#1e40af', fontSize: '16px', marginBottom: '15px', margin: '0 0 15px 0' }}>Product Pages Layout</h4>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Products Per Row:</label>
                  <select
                    value={brandSettings.productsPerRow || 4}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value)
                      setBrandSettings(prev => ({ ...prev, productsPerRow: newValue }))
                    }}
                    style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                  >
                    <option value={2}>2 per row</option>
                    <option value={3}>3 per row</option>
                    <option value={4}>4 per row</option>
                    <option value={5}>5 per row</option>
                    <option value={6}>6 per row</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
              <button
                onClick={async () => {
                  try {
                    setSaveStatus('saving')
                    const { doc, updateDoc, addDoc, serverTimestamp } = await import('firebase/firestore')
                    
                    // Retry logic for network issues
                    let retries = 3
                    while (retries > 0) {
                      try {
                        if (brandSettings.id) {
                          await updateDoc(doc(db, 'brandSettings', brandSettings.id), {
                            ...brandSettings,
                            updatedAt: serverTimestamp()
                          })
                        } else {
                          const docRef = await addDoc(collection(db, 'brandSettings'), {
                            ...brandSettings,
                            vertical: 'freshcuts',
                            createdAt: serverTimestamp(),
                            updatedAt: serverTimestamp()
                          })
                          setBrandSettings(prev => ({ ...prev, id: docRef.id }))
                        }
                        break
                      } catch (retryError) {
                        retries--
                        if (retries === 0) throw retryError
                        await new Promise(resolve => setTimeout(resolve, 1000))
                      }
                    }
                    
                    setSaveStatus('success')
                    setTimeout(() => {
                      setSaveStatus('')
                      window.location.reload()
                    }, 2000)
                  } catch (error) {
                    console.error('Error saving layout settings:', error)
                    setSaveStatus('error')
                    setTimeout(() => setSaveStatus(''), 5000)
                  }
                }}
                style={{
                  padding: '12px 24px',
                  backgroundColor: saveStatus === 'saving' ? '#6b7280' : '#16a34a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: saveStatus === 'saving' ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  minWidth: '120px'
                }}
                disabled={saveStatus === 'saving'}
              >
                {saveStatus === 'saving' ? 'Saving...' : 'Save Layout Settings'}
              </button>
              {saveStatus === 'success' && (
                <p style={{ color: '#16a34a', fontSize: '14px', margin: '10px 0 0 0', fontWeight: '500', backgroundColor: '#dcfce7', padding: '8px 12px', borderRadius: '6px', border: '1px solid #16a34a' }}>
                  ✓ Layout settings saved successfully! Changes will appear after page refresh.
                </p>
              )}
              {saveStatus === 'error' && (
                <p style={{ color: '#ef4444', fontSize: '14px', margin: '10px 0 0 0', fontWeight: '500', backgroundColor: '#fee2e2', padding: '8px 12px', borderRadius: '6px', border: '1px solid #ef4444' }}>
                  ✗ Network error. Please check connection and try again.
                </p>
              )}
            </div>
            
            <div style={{ padding: '15px', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
              <h4 style={{ color: '#1e40af', fontSize: '14px', marginBottom: '8px' }}>Logo Guidelines:</h4>
              <ul style={{ color: '#1e40af', fontSize: '12px', margin: '0', paddingLeft: '20px' }}>
                <li>Recommended size: 200x60px (landscape) or 60x60px (square)</li>
                <li>Format: PNG with transparent background preferred</li>
                <li>File size: Under 100KB for fast loading</li>
                <li>Logo will be displayed at 60px height in navigation</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '12px',
            width: '500px',
            maxWidth: '90vw'
          }}>
            <h2 style={{ marginBottom: '20px' }}>
              {editingItem ? 'Edit' : 'Add'} {activeTab === 'banners' ? 'Banner Ad' : 'Category Card'}
            </h2>

            {activeTab === 'banners' ? (
              <>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Text:</label>
                  <input
                    type="text"
                    value={formData.text || ''}
                    onChange={(e) => setFormData({...formData, text: e.target.value})}
                    style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                  />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Icon SVG Path:</label>
                  <textarea
                    value={formData.icon || ''}
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                    style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                    rows="3"
                    placeholder="<path d='...' />"
                  />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Order:</label>
                  <input
                    type="number"
                    value={formData.order || 0}
                    onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                    style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                  />
                </div>
              </>
            ) : (
              <>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Category ID:</label>
                  <select
                    value={formData.categoryId || ''}
                    onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                    style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                  >
                    <option value="">Select Category</option>
                    <option value="chicken">Chicken</option>
                    <option value="country-chicken">Country Chicken</option>
                    <option value="mutton">Mutton</option>
                    <option value="fish">Fish</option>
                    <option value="prawns">Prawns</option>
                    <option value="crabs">Crabs</option>
                  </select>
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Name:</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                  />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Description:</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                    rows="2"
                  />
                </div>
                <ImageUpload 
                  currentImage={formData.image}
                  onImageUpload={(imageUrl) => setFormData({...formData, image: imageUrl})}
                />
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Display Order:</label>
                  <input
                    type="number"
                    value={formData.order || 0}
                    onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                    style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                    placeholder="0 = first, 1 = second, etc."
                  />
                </div>
              </>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={formData.active || false}
                  onChange={(e) => setFormData({...formData, active: e.target.checked})}
                />
                Active
              </label>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={resetForm}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  backgroundColor: 'white'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#16a34a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}