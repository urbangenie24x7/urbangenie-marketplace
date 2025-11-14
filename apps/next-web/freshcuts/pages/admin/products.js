import { useState, useEffect } from 'react'
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'

export default function AdminProducts() {
  const [currentUser, setCurrentUser] = useState(null)
  const [mounted, setMounted] = useState(false)
  const [products, setProducts] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [categories, setCategories] = useState([])
  const [units, setUnits] = useState([])
  const [collapsedCategories, setCollapsedCategories] = useState({})
  const [editingPrice, setEditingPrice] = useState(null)
  const [editingImage, setEditingImage] = useState(null)
  const [editingVariations, setEditingVariations] = useState(null)
  const [tempPrice, setTempPrice] = useState('')
  const [tempImageUrl, setTempImageUrl] = useState('')
  const [tempVariations, setTempVariations] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    baseUnit: '',
    image_url: '',
    default_price: ''
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
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const productsSnap = await getDocs(collection(db, 'products'))
      const productsData = productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setProducts(productsData)
      
      // Extract unique categories and units from existing products
      const uniqueCategories = [...new Set(productsData.map(p => p.category).filter(Boolean))].sort()
      const uniqueUnits = [...new Set(productsData.map(p => p.baseUnit || p.unit).filter(Boolean))].sort()
      
      setCategories(uniqueCategories)
      setUnits(uniqueUnits.length > 0 ? uniqueUnits : ['kg', 'nos', 'ltr', 'gm', 'dozen', 'pack'])
      
      // Set default values for form if not already set
      if (!formData.category && uniqueCategories.length > 0) {
        setFormData(prev => ({ ...prev, category: uniqueCategories[0] }))
      }
      if (!formData.baseUnit && uniqueUnits.length > 0) {
        setFormData(prev => ({ ...prev, baseUnit: uniqueUnits[0] }))
      }
    } catch (error) {
      console.error('Error loading products:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), {
          ...formData,
          updatedAt: new Date()
        })
      } else {
        await addDoc(collection(db, 'products'), {
          ...formData,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
      
      setFormData({ name: '', description: '', category: categories[0] || '', baseUnit: units[0] || 'kg', image_url: '', default_price: '' })
      setShowAddForm(false)
      setEditingProduct(null)
      loadProducts()
    } catch (error) {
      console.error('Error saving product:', error)
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name || '',
      description: product.description || '',
      category: product.category || '',
      baseUnit: product.baseUnit || 'kg',
      image_url: product.image_url || '',
      default_price: product.default_price || ''
    })
    setShowAddForm(true)
  }

  const handleDelete = async (productId) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteDoc(doc(db, 'products', productId))
        loadProducts()
      } catch (error) {
        console.error('Error deleting product:', error)
      }
    }
  }

  const toggleCategory = (category) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  const startEditingPrice = (product) => {
    setEditingPrice(product.id)
    setTempPrice(product.default_price || '')
  }

  const updatePrice = async (productId) => {
    try {
      await updateDoc(doc(db, 'products', productId), {
        default_price: parseFloat(tempPrice)
      })
      setEditingPrice(null)
      setTempPrice('')
      loadProducts()
    } catch (error) {
      console.error('Error updating price:', error)
    }
  }

  const startEditingImage = (product) => {
    setEditingImage(product.id)
    setTempImageUrl(product.image_url || '')
  }

  const updateImage = async (productId) => {
    try {
      await updateDoc(doc(db, 'products', productId), {
        image_url: tempImageUrl
      })
      setEditingImage(null)
      setTempImageUrl('')
      loadProducts()
    } catch (error) {
      console.error('Error updating image:', error)
    }
  }

  const startEditingVariations = (product) => {
    setEditingVariations(product.id)
    setTempVariations(product.variations || [])
  }

  const updateVariations = async (productId) => {
    try {
      await updateDoc(doc(db, 'products', productId), {
        variations: tempVariations
      })
      setEditingVariations(null)
      setTempVariations([])
      loadProducts()
    } catch (error) {
      console.error('Error updating variations:', error)
    }
  }

  const addVariation = () => {
    setTempVariations([...tempVariations, { weight: '', cut: '', priceMultiplier: 1 }])
  }

  const updateVariation = (index, field, value) => {
    const updated = [...tempVariations]
    updated[index] = { ...updated[index], [field]: value }
    setTempVariations(updated)
  }

  const removeVariation = (index) => {
    setTempVariations(tempVariations.filter((_, i) => i !== index))
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
            <h1 style={{ color: '#1f2937', margin: '0 0 4px 0', fontSize: '28px', fontWeight: '700' }}>Product Master</h1>
            <p style={{ color: '#6b7280', margin: '0', fontSize: '16px' }}>Manage products and their base units</p>
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
                setEditingProduct(null)
                setFormData({ name: '', description: '', category: categories[0] || '', baseUnit: units[0] || 'kg', image_url: '', default_price: '' })
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
              Add Product
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
        {/* Add/Edit Form */}
        {showAddForm && (
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '30px' }}>
            <h3 style={{ color: '#1f2937', fontSize: '18px', margin: '0 0 20px 0', fontWeight: '600' }}>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Product Name</label>
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
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Base Unit</label>
                  <select
                    value={formData.baseUnit}
                    onChange={(e) => setFormData({ ...formData, baseUnit: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  >
                    {units.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Default Price (₹)</label>
                  <input
                    type="number"
                    value={formData.default_price}
                    onChange={(e) => setFormData({ ...formData, default_price: e.target.value })}
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
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Image URL</label>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {formData.image_url && (
                      <img 
                        src={formData.image_url}
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
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
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
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingProduct(null)
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

        {/* Products List - Category Based */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ color: '#1f2937', fontSize: '18px', margin: '0', fontWeight: '600' }}>
              Products ({products.length})
            </h3>
          </div>
          
          {/* Category-based Product Display */}
          <div style={{ padding: '20px' }}>
            {categories.map(category => {
              const categoryProducts = products.filter(product => product.category === category)
              if (categoryProducts.length === 0) return null
              
              return (
                <div key={category} style={{ marginBottom: '30px' }}>
                  <div 
                    onClick={() => toggleCategory(category)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      marginBottom: '16px',
                      padding: '12px 16px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      ':hover': { backgroundColor: '#f1f5f9' }
                    }}
                  >
                    <h4 style={{ 
                      color: '#1f2937', 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      margin: '0',
                      textTransform: 'capitalize',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      {category}
                      <span style={{
                        backgroundColor: '#16a34a',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {categoryProducts.length}
                      </span>
                    </h4>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      color: '#6b7280'
                    }}>
                      <span style={{ fontSize: '12px', fontWeight: '500' }}>
                        {collapsedCategories[category] ? 'Show' : 'Hide'}
                      </span>
                      <span style={{ 
                        fontSize: '16px',
                        transform: collapsedCategories[category] ? 'rotate(-90deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease'
                      }}>
                        ▼
                      </span>
                    </div>
                  </div>
                  
                  {!collapsedCategories[category] && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                    {categoryProducts.map(product => (
                      <div key={product.id} style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '16px',
                        backgroundColor: 'white',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                          <img 
                            src={product.image_url || 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=60&h=60&fit=crop'}
                            alt={product.name}
                            style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }}
                          />
                          <div style={{ flex: 1 }}>
                            <h5 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                              {product.name}
                            </h5>
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
                              <span style={{
                                backgroundColor: '#dbeafe',
                                color: '#2563eb',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                fontSize: '11px',
                                fontWeight: '500'
                              }}>
                                {product.baseUnit || 'kg'}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <p style={{ 
                          margin: '0 0 12px 0', 
                          fontSize: '13px', 
                          color: '#6b7280',
                          lineHeight: '1.4'
                        }}>
                          {product.description || 'No description available'}
                        </p>
                        
                        {/* Default Price */}
                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '500', color: '#374151' }}>Default Price:</span>
                            <button
                              onClick={() => startEditingPrice(product)}
                              style={{
                                padding: '2px 6px',
                                backgroundColor: '#f59e0b',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '10px',
                                cursor: 'pointer'
                              }}
                            >
                              Edit
                            </button>
                          </div>
                          {editingPrice === product.id ? (
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <input
                                type="number"
                                value={tempPrice}
                                onChange={(e) => setTempPrice(e.target.value)}
                                style={{
                                  flex: 1,
                                  padding: '4px 8px',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '4px',
                                  fontSize: '12px'
                                }}
                              />
                              <button
                                onClick={() => updatePrice(product.id)}
                                style={{
                                  padding: '4px 8px',
                                  backgroundColor: '#16a34a',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  fontSize: '10px',
                                  cursor: 'pointer'
                                }}
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingPrice(null)}
                                style={{
                                  padding: '4px 8px',
                                  backgroundColor: '#6b7280',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  fontSize: '10px',
                                  cursor: 'pointer'
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#16a34a' }}>
                              ₹{product.default_price || 'Not set'}
                            </span>
                          )}
                        </div>
                        
                        {/* Image URL */}
                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '500', color: '#374151' }}>Image:</span>
                            <button
                              onClick={() => startEditingImage(product)}
                              style={{
                                padding: '2px 6px',
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '10px',
                                cursor: 'pointer'
                              }}
                            >
                              Edit
                            </button>
                          </div>
                          {editingImage === product.id ? (
                            <div>
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                                <input
                                  type="url"
                                  value={tempImageUrl}
                                  onChange={(e) => setTempImageUrl(e.target.value)}
                                  placeholder="Enter image URL"
                                  style={{
                                    flex: 1,
                                    padding: '4px 8px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '4px',
                                    fontSize: '12px'
                                  }}
                                />
                                <button
                                  onClick={() => updateImage(product.id)}
                                  style={{
                                    padding: '4px 8px',
                                    backgroundColor: '#16a34a',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    fontSize: '10px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingImage(null)}
                                  style={{
                                    padding: '4px 8px',
                                    backgroundColor: '#6b7280',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    fontSize: '10px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                              {tempImageUrl && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ fontSize: '11px', color: '#6b7280' }}>Preview:</span>
                                  <img 
                                    src={tempImageUrl}
                                    alt="Preview"
                                    onError={(e) => {
                                      e.target.style.display = 'none'
                                      e.target.nextSibling.style.display = 'inline'
                                    }}
                                    style={{
                                      width: '40px',
                                      height: '40px',
                                      borderRadius: '4px',
                                      objectFit: 'cover',
                                      border: '1px solid #e5e7eb'
                                    }}
                                  />
                                  <span style={{ fontSize: '11px', color: '#dc2626', display: 'none' }}>Invalid URL</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <span style={{ fontSize: '12px', color: '#6b7280', wordBreak: 'break-all' }}>
                              {product.image_url ? 'Set' : 'Not set'}
                            </span>
                          )}
                        </div>
                        
                        {/* Variations */}
                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '500', color: '#374151' }}>Variations:</span>
                            <button
                              onClick={() => startEditingVariations(product)}
                              style={{
                                padding: '2px 6px',
                                backgroundColor: '#8b5cf6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '10px',
                                cursor: 'pointer'
                              }}
                            >
                              Edit
                            </button>
                          </div>
                          {editingVariations === product.id ? (
                            <div style={{ padding: '8px', backgroundColor: '#f9fafb', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                              {tempVariations.map((variation, index) => (
                                <div key={index} style={{ display: 'flex', gap: '4px', marginBottom: '4px', alignItems: 'center' }}>
                                  <input
                                    type="text"
                                    placeholder="Weight/Size"
                                    value={variation.weight || variation.size || ''}
                                    onChange={(e) => updateVariation(index, 'weight', e.target.value)}
                                    style={{ flex: 1, padding: '2px 4px', fontSize: '11px', border: '1px solid #d1d5db', borderRadius: '3px' }}
                                  />
                                  <input
                                    type="text"
                                    placeholder="Cut/Type"
                                    value={variation.cut || ''}
                                    onChange={(e) => updateVariation(index, 'cut', e.target.value)}
                                    style={{ flex: 1, padding: '2px 4px', fontSize: '11px', border: '1px solid #d1d5db', borderRadius: '3px' }}
                                  />
                                  <input
                                    type="number"
                                    step="0.1"
                                    placeholder="Multiplier"
                                    value={variation.priceMultiplier || ''}
                                    onChange={(e) => updateVariation(index, 'priceMultiplier', parseFloat(e.target.value) || 1)}
                                    style={{ width: '60px', padding: '2px 4px', fontSize: '11px', border: '1px solid #d1d5db', borderRadius: '3px' }}
                                  />
                                  <button
                                    onClick={() => removeVariation(index)}
                                    style={{
                                      padding: '2px 4px',
                                      backgroundColor: '#dc2626',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '3px',
                                      fontSize: '10px',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                              <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
                                <button
                                  onClick={addVariation}
                                  style={{
                                    padding: '4px 8px',
                                    backgroundColor: '#10b981',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    fontSize: '10px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Add
                                </button>
                                <button
                                  onClick={() => updateVariations(product.id)}
                                  style={{
                                    padding: '4px 8px',
                                    backgroundColor: '#16a34a',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    fontSize: '10px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingVariations(null)}
                                  style={{
                                    padding: '4px 8px',
                                    backgroundColor: '#6b7280',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    fontSize: '10px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div style={{ fontSize: '11px', color: '#6b7280' }}>
                              {product.variations && product.variations.length > 0 ? (
                                product.variations.map((variation, index) => (
                                  <div key={index} style={{ marginBottom: '2px' }}>
                                    • {variation.weight || variation.size} - {variation.cut || 'regular'} - ₹{Math.round((product.default_price || 0) * (variation.priceMultiplier || 1))}
                                  </div>
                                ))
                              ) : (
                                'No variations'
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => handleEdit(product)}
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
                            onClick={() => handleDelete(product.id)}
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
                  )}
                </div>
              )
            })}
            
            {products.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                <p style={{ fontSize: '16px', margin: '0' }}>No products found. Add your first product to get started.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}