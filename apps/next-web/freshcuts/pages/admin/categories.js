import { useState, useEffect } from 'react'
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'

export default function AdminCategories() {
  const [currentUser, setCurrentUser] = useState(null)
  const [mounted, setMounted] = useState(false)
  const [categoryCards, setCategoryCards] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    link: ''
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
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const categoriesSnap = await getDocs(collection(db, 'categoryCards'))
      setCategoryCards(categoriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingCategory) {
        await updateDoc(doc(db, 'categoryCards', editingCategory.id), {
          ...formData,
          updatedAt: new Date()
        })
      } else {
        await addDoc(collection(db, 'categoryCards'), {
          ...formData,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
      
      setFormData({ title: '', description: '', image: '', link: '' })
      setShowAddForm(false)
      setEditingCategory(null)
      loadCategories()
    } catch (error) {
      console.error('Error saving category:', error)
    }
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setFormData({
      title: category.title || '',
      description: category.description || '',
      image: category.image || '',
      link: category.link || ''
    })
    setShowAddForm(true)
  }

  const handleDelete = async (categoryId) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteDoc(doc(db, 'categoryCards', categoryId))
        loadCategories()
      } catch (error) {
        console.error('Error deleting category:', error)
      }
    }
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
            <h1 style={{ color: '#1f2937', margin: '0 0 4px 0', fontSize: '28px', fontWeight: '700' }}>Category Master</h1>
            <p style={{ color: '#6b7280', margin: '0', fontSize: '16px' }}>Manage category cards for the marketplace</p>
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
                setEditingCategory(null)
                setFormData({ title: '', description: '', image: '', link: '' })
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
              Add Category
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
        {/* Add/Edit Form */}
        {showAddForm && (
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '30px' }}>
            <h3 style={{ color: '#1f2937', fontSize: '18px', margin: '0 0 20px 0', fontWeight: '600' }}>
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Link</label>
                  <input
                    type="text"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="e.g., /category/chicken"
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
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Image URL</label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  {formData.image && (
                    <img 
                      src={formData.image}
                      alt="Preview"
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '8px',
                        objectFit: 'cover',
                        border: '1px solid #e5e7eb'
                      }}
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  )}
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    style={{
                      flex: 1,
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                  {editingCategory ? 'Update Category' : 'Add Category'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingCategory(null)
                  }}
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

        {/* Categories Grid */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ color: '#1f2937', fontSize: '18px', margin: '0', fontWeight: '600' }}>
              Categories ({categoryCards.length})
            </h3>
          </div>
          
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {categoryCards.map(category => (
                <div key={category.id} style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '16px',
                  backgroundColor: 'white',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <img 
                      src={category.image || 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=60&h=60&fit=crop'}
                      alt={category.title}
                      style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                        {category.title}
                      </h4>
                      <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
                        {category.link || 'No link set'}
                      </p>
                    </div>
                  </div>
                  
                  <p style={{ 
                    margin: '0 0 12px 0', 
                    fontSize: '13px', 
                    color: '#6b7280',
                    lineHeight: '1.4'
                  }}>
                    {category.description || 'No description'}
                  </p>
                  
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => handleEdit(category)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#2563eb',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {categoryCards.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                <p style={{ fontSize: '16px', margin: '0' }}>No categories found. Add your first category to get started.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}