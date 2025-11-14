import { useState, useEffect } from 'react'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'

export default function ContentManagement() {
  const [bannerAds, setBannerAds] = useState([])
  const [categoryCards, setCategoryCards] = useState([])
  const [activeTab, setActiveTab] = useState('banners')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Load banner ads
      const bannerSnap = await getDocs(collection(db, 'bannerAds'))
      setBannerAds(bannerSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })))

      // Load category cards
      const categorySnap = await getDocs(collection(db, 'categoryCards'))
      setCategoryCards(categorySnap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const handleSave = async () => {
    try {
      const collectionName = activeTab === 'banners' ? 'bannerAds' : 'categoryCards'
      
      if (editingItem) {
        await updateDoc(doc(db, collectionName, editingItem.id), {
          ...formData,
          updatedAt: serverTimestamp()
        })
      } else {
        await addDoc(collection(db, collectionName), {
          ...formData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        })
      }
      
      setShowAddForm(false)
      setEditingItem(null)
      setFormData({})
      loadData()
    } catch (error) {
      console.error('Error saving:', error)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        const collectionName = activeTab === 'banners' ? 'bannerAds' : 'categoryCards'
        await deleteDoc(doc(db, collectionName, id))
        loadData()
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

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#16a34a', marginBottom: '30px' }}>Content Management</h1>

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
            onClick={() => setActiveTab('categories')}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderBottom: activeTab === 'categories' ? '2px solid #16a34a' : 'none',
              backgroundColor: 'transparent',
              color: activeTab === 'categories' ? '#16a34a' : '#6b7280',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Category Cards
          </button>
        </div>
      </div>

      {/* Add Button */}
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

      {/* Category Cards Tab */}
      {activeTab === 'categories' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
            {categoryCards.map(card => (
              <div key={card.id} style={{
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: 'white'
              }}>
                {card.image && (
                  <img 
                    src={card.image} 
                    alt={card.name}
                    style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '15px' }}
                  />
                )}
                <h3 style={{ margin: '0 0 10px 0' }}>{card.name}</h3>
                <p style={{ color: '#6b7280', margin: '0 0 10px 0', fontSize: '14px' }}>{card.description}</p>
                <p style={{ color: '#6b7280', margin: '0 0 10px 0', fontSize: '12px' }}>Category: {card.categoryId}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    backgroundColor: card.active ? '#dcfce7' : '#fee2e2',
                    color: card.active ? '#166534' : '#dc2626'
                  }}>
                    {card.active ? 'Active' : 'Inactive'}
                  </span>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => startEdit(card)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(card.id)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
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
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Image URL:</label>
                  <input
                    type="url"
                    value={formData.image || ''}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
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