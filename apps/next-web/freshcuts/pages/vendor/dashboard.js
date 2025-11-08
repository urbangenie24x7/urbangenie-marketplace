import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Navigation from '../../components/Navigation'
import SEOHead from '../../components/SEOHead'
import { getCurrentUser, logout, requireAuth } from '../../lib/auth'

export default function VendorDashboard() {
  const [mounted, setMounted] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [currentVendor, setCurrentVendor] = useState(null)
  const router = useRouter()
  const [products, setProducts] = useState([])
  const [vendorProducts, setVendorProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    myProducts: true,
    availableProducts: false
  })
  const [expandedCategories, setExpandedCategories] = useState({})
  const [selectedProducts, setSelectedProducts] = useState(new Set())
  const [newProduct, setNewProduct] = useState({
    productId: '',
    price: '',
    available: true,
    deliveryTime: '2 hours',
    deliveryOption: 'free',
    deliveryCharges: 0,
    minValueForFreeDelivery: 0,
    specialOffer: ''
  })
  const [editingProduct, setEditingProduct] = useState(null)
  const [editForm, setEditForm] = useState({
    price: '',
    available: true,
    quantity: '',
    deliveryTime: '2 hours',
    deliveryOption: 'free',
    deliveryCharges: 0,
    minValueForFreeDelivery: 0,
    specialOffer: '',
    variations: []
  })

  useEffect(() => {
    // Check authentication
    const user = requireAuth(['vendor'])
    if (!user) return
    
    // Only proceed if user is actually a vendor
    if (user.role !== 'vendor') {
      router.push('/unauthorized')
      return
    }
    
    setCurrentUser(user)
    setMounted(true)
    loadVendorData(user)
  }, [])

  const loadVendorData = async (user) => {
    try {
      const { collection, getDocs, query, where } = await import('firebase/firestore')
      const { db } = await import('../../lib/firebase')
      
      // Load products
      const productsSnap = await getDocs(collection(db, 'products'))
      setProducts(productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      
      // Try to find vendor by phone
      const vendorsRef = collection(db, 'vendors')
      const q = query(vendorsRef, where('phone', '==', user.phone))
      const vendorsSnap = await getDocs(q)
      
      if (!vendorsSnap.empty) {
        const vendor = vendorsSnap.docs[0]
        setCurrentVendor({ id: vendor.id, ...vendor.data() })
        
        // Load vendor products
        const vendorProductsSnap = await getDocs(collection(db, 'vendorProducts'))
        const myProducts = vendorProductsSnap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(vp => vp.vendorId === vendor.id)
        setVendorProducts(myProducts)
        
        // Load orders
        const ordersSnap = await getDocs(collection(db, 'orders'))
        const myOrders = ordersSnap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(order => order.vendorId === vendor.id)
        setOrders(myOrders)
      } else {
        // Create a default vendor profile if none exists
        setCurrentVendor({
          id: 'temp',
          name: user.name || 'Vendor',
          phone: user.phone,
          products: []
        })
        setVendorProducts([])
        setOrders([])
      }
    } catch (error) {
      console.error('Error loading vendor data:', error)
      // Set default values on error
      setCurrentVendor({
        id: 'temp',
        name: user.name || 'Vendor',
        phone: user.phone,
        products: []
      })
      setVendorProducts([])
      setOrders([])
    }
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  const toggleProductSelection = (productId) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(productId)) {
        newSet.delete(productId)
      } else {
        newSet.add(productId)
      }
      return newSet
    })
  }

  const selectAllInCategory = (categoryProducts) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev)
      categoryProducts.forEach(product => newSet.add(product.id))
      return newSet
    })
  }

  const deselectAllInCategory = (categoryProducts) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev)
      categoryProducts.forEach(product => newSet.delete(product.id))
      return newSet
    })
  }

  const addSelectedProducts = async () => {
    if (selectedProducts.size === 0) {
      alert('Please select products to add')
      return
    }

    try {
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore')
      const { db } = await import('../../lib/firebase')
      
      for (const productId of selectedProducts) {
        const product = products.find(p => p.id === productId)
        if (product) {
          await addDoc(collection(db, 'vendorProducts'), {
            productId: productId,
            vendorId: currentVendor.id,
            price: product.default_price || 100,
            available: true,
            deliveryTime: '2 hours',
            deliveryOption: 'free',
            deliveryCharges: 0,
            minValueForFreeDelivery: 0,
            specialOffer: '',
            createdAt: serverTimestamp()
          })
        }
      }
      
      alert(`${selectedProducts.size} products added to your store!`)
      setSelectedProducts(new Set())
      loadVendorData(currentUser)
    } catch (error) {
      alert('Error adding products: ' + error.message)
    }
  }

  const addProduct = async () => {
    try {
      const { collection, addDoc, updateDoc, doc, serverTimestamp } = await import('firebase/firestore')
      const { db } = await import('../../lib/firebase')
      
      const existingProduct = vendorProducts.find(vp => vp.productId === newProduct.productId)
      
      if (existingProduct) {
        await updateDoc(doc(db, 'vendorProducts', existingProduct.id), {
          price: parseFloat(newProduct.price),
          available: newProduct.available,
          deliveryTime: newProduct.deliveryTime,
          deliveryOption: newProduct.deliveryOption,
          deliveryCharges: newProduct.deliveryOption === 'charges' ? parseFloat(newProduct.deliveryCharges) : 0,
          minValueForFreeDelivery: newProduct.deliveryOption === 'conditional' ? parseFloat(newProduct.minValueForFreeDelivery) : 0,
          specialOffer: newProduct.specialOffer,
          updatedAt: serverTimestamp()
        })
        alert('Product updated successfully!')
      } else {
        await addDoc(collection(db, 'vendorProducts'), {
          productId: newProduct.productId,
          vendorId: currentVendor.id,
          price: parseFloat(newProduct.price),
          available: newProduct.available,
          deliveryTime: newProduct.deliveryTime,
          deliveryOption: newProduct.deliveryOption,
          deliveryCharges: newProduct.deliveryOption === 'charges' ? parseFloat(newProduct.deliveryCharges) : 0,
          minValueForFreeDelivery: newProduct.deliveryOption === 'conditional' ? parseFloat(newProduct.minValueForFreeDelivery) : 0,
          specialOffer: newProduct.specialOffer,
          createdAt: serverTimestamp()
        })
        alert('Product added successfully!')
      }
      
      setNewProduct({ productId: '', price: '', available: true, deliveryTime: '2 hours', deliveryOption: 'free', deliveryCharges: 0, minValueForFreeDelivery: 0, specialOffer: '' })
      setShowAddProduct(false)
      loadVendorData(currentUser)
    } catch (error) {
      alert('Error saving product: ' + error.message)
    }
  }

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId)
    return product ? product.name : 'Unknown Product'
  }

  const startEditProduct = (vendorProduct) => {
    const product = products.find(p => p.id === vendorProduct.productId)
    setEditingProduct(vendorProduct.id)
    
    // Use vendor's custom variations or fall back to master product variations
    const initialVariations = vendorProduct.vendorVariations || product.variations || []
    
    setEditForm({
      price: vendorProduct.price || '',
      available: vendorProduct.available !== false,
      quantity: vendorProduct.quantity || '',
      deliveryTime: vendorProduct.deliveryTime || '2 hours',
      deliveryOption: vendorProduct.deliveryOption || 'free',
      deliveryCharges: vendorProduct.deliveryCharges || 0,
      minValueForFreeDelivery: vendorProduct.minValueForFreeDelivery || 0,
      specialOffer: vendorProduct.specialOffer || '',
      variations: initialVariations
    })
  }

  const updateProduct = async () => {
    try {
      const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore')
      const { db } = await import('../../lib/firebase')
      
      await updateDoc(doc(db, 'vendorProducts', editingProduct), {
        price: parseFloat(editForm.price),
        available: editForm.available,
        quantity: editForm.quantity ? parseInt(editForm.quantity) : null,
        deliveryTime: editForm.deliveryTime,
        deliveryOption: editForm.deliveryOption,
        deliveryCharges: editForm.deliveryOption === 'charges' ? parseFloat(editForm.deliveryCharges) : 0,
        minValueForFreeDelivery: editForm.deliveryOption === 'conditional' ? parseFloat(editForm.minValueForFreeDelivery) : 0,
        specialOffer: editForm.specialOffer,
        vendorVariations: editForm.variations,
        updatedAt: serverTimestamp()
      })
      
      alert('Product updated successfully!')
      setEditingProduct(null)
      loadVendorData(currentUser)
    } catch (error) {
      alert('Error updating product: ' + error.message)
    }
  }

  const addVariation = () => {
    setEditForm(prev => ({
      ...prev,
      variations: [...prev.variations, { name: '', price: '', unit: '' }]
    }))
  }

  const updateVariation = (index, field, value) => {
    setEditForm(prev => ({
      ...prev,
      variations: prev.variations.map((variation, i) => 
        i === index ? { ...variation, [field]: value } : variation
      )
    }))
  }

  const removeVariation = (index) => {
    setEditForm(prev => ({
      ...prev,
      variations: prev.variations.filter((_, i) => i !== index)
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
          <p>No vendor profile found for phone: {currentUser?.phone}</p>
          <p>Contact admin to set up your vendor account.</p>
          <button onClick={logout} style={{ padding: '10px 20px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '6px' }}>
            Logout
          </button>
        </div>
      </>
    )
  }

  const myProductIds = vendorProducts.map(vp => vp.productId)
  const availableProducts = products.filter(product => 
    currentVendor.products?.includes(product.category) && !myProductIds.includes(product.id)
  )

  return (
    <>
      <SEOHead 
        title={`${currentVendor?.name || 'Vendor'} Dashboard | FreshCuts`}
        description="Manage your meat vendor business. Add products, set prices, manage orders and track sales on FreshCuts marketplace."
        url="https://freshcuts.com/vendor"
      />
      <Navigation />
      <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h1 style={{ color: '#16a34a', fontSize: '32px', margin: '0' }}>{currentVendor.name}</h1>
          </div>
          <p style={{ color: '#666' }}>Welcome, {currentUser?.name} | Manage your products and orders</p>
          <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
            <p style={{ color: '#1e40af', fontSize: '14px', margin: '0' }}>
              <strong>Your Categories:</strong> {currentVendor.products?.length > 0 ? currentVendor.products.map(cat => cat.charAt(0).toUpperCase() + cat.slice(1)).join(', ') : 'No categories assigned'}
            </p>
            {(!currentVendor.products || currentVendor.products.length === 0) && (
              <p style={{ color: '#dc2626', fontSize: '14px', margin: '8px 0 0 0' }}>
                Contact admin to assign product categories to your account.
              </p>
            )}
          </div>
        </header>

        {/* My Products Section */}
        <section style={{ marginBottom: '20px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <div 
            onClick={() => toggleSection('myProducts')}
            style={{ 
              padding: '20px', 
              cursor: 'pointer', 
              borderBottom: expandedSections.myProducts ? '1px solid #e5e7eb' : 'none',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <h2 style={{ fontSize: '24px', color: '#374151', margin: '0' }}>My Products ({vendorProducts.length})</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowAddProduct(!showAddProduct)
                }}
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
                {showAddProduct ? 'Cancel' : 'Add Product'}
              </button>
              <span style={{ fontSize: '20px', color: '#6b7280' }}>{expandedSections.myProducts ? '▼' : '▶'}</span>
            </div>
          </div>
          {expandedSections.myProducts && (
            <div style={{ padding: '20px' }}>
              {showAddProduct && (
                <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px', backgroundColor: '#f9fafb', marginBottom: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Product</label>
                      <select
                        value={newProduct.productId}
                        onChange={(e) => setNewProduct({...newProduct, productId: e.target.value})}
                        style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                      >
                        <option value="">Select Product</option>
                        {products
                          .filter(product => currentVendor.products?.includes(product.category))
                          .map(product => (
                            <option key={product.id} value={product.id}>
                              {product.name} ({product.category}) - Default: ₹{product.default_price || 'N/A'}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Your Price (₹)</label>
                      <input
                        type="number"
                        placeholder="Enter your price"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                        style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                      />
                    </div>
                  </div>
                  <button
                    onClick={addProduct}
                    disabled={!newProduct.productId || !newProduct.price}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#16a34a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      opacity: (!newProduct.productId || !newProduct.price) ? 0.5 : 1
                    }}
                  >
                    Add Product
                  </button>
                </div>
              )}
              
              {vendorProducts.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#6b7280', padding: '40px' }}>
                  <p style={{ marginBottom: '10px' }}>No products added yet.</p>
                  {products.length > 0 ? (
                    <p>Click "Add Product" or check "Available Products" section below.</p>
                  ) : (
                    <div style={{ fontSize: '12px', color: '#dc2626', backgroundColor: '#fef2f2', padding: '10px', borderRadius: '6px' }}>
                      <strong>Issue:</strong> No products in database. Admin needs to add products first.
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                  {vendorProducts.map(vendorProduct => {
                    const product = products.find(p => p.id === vendorProduct.productId)
                    if (!product) return null
                    
                    return (
                      <div key={vendorProduct.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '15px' }}>
                        <div style={{ position: 'relative', marginBottom: '10px' }}>
                          <img 
                            src={product.image_url || 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop'} 
                            alt={product.name}
                            style={{ 
                              width: '100%', 
                              height: '120px', 
                              objectFit: 'cover', 
                              borderRadius: '6px'
                            }}
                          />

                        </div>
                        <h3 style={{ color: '#374151', margin: '0 0 8px 0', fontSize: '16px' }}>{product.name}</h3>
                        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
                          Category: {product.category}
                        </p>
                        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
                          Unit: {product.unit}
                        </p>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <p style={{ color: '#6b7280', fontSize: '14px', margin: '0' }}>
                            Your Price: ₹{vendorProduct.price}
                          </p>
                          <button
                            onClick={() => startEditProduct(vendorProduct)}
                            style={{
                              padding: '2px 6px',
                              backgroundColor: '#f59e0b',
                              color: 'white',
                              border: 'none',
                              borderRadius: '3px',
                              fontSize: '10px',
                              cursor: 'pointer'
                            }}
                          >
                            Edit
                          </button>
                        </div>
                        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
                          Status: {vendorProduct.available ? 'Available' : 'Unavailable'}
                        </p>
                        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
                          Quantity: {vendorProduct.quantity || 'Unlimited'}
                        </p>
                        
                        {product.variations && product.variations.length > 0 && (
                          <div style={{ marginBottom: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                              <p style={{ color: '#374151', fontSize: '13px', fontWeight: '500', margin: '0' }}>Variations:</p>
                              <button
                                onClick={() => startEditProduct(vendorProduct)}
                                style={{
                                  padding: '2px 6px',
                                  backgroundColor: '#3b82f6',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '3px',
                                  fontSize: '10px',
                                  cursor: 'pointer'
                                }}
                              >
                                Edit
                              </button>
                            </div>
                            <div style={{ maxHeight: '80px', overflowY: 'auto' }}>
                              {product.variations.map((variation, index) => {
                                const vendorVariation = vendorProduct.vendorVariations?.find(v => 
                                  v.weight === variation.weight || v.quantity === variation.quantity || v.size === variation.size
                                )
                                const displayPrice = vendorVariation?.vendorPrice || Math.round(vendorProduct.price * variation.priceMultiplier)
                                return (
                                  <p key={index} style={{ color: '#6b7280', fontSize: '12px', marginBottom: '2px' }}>
                                    • {variation.weight && `${variation.weight}g`}
                                    {variation.quantity && `${variation.quantity} pieces`}
                                    {variation.size && ` ${variation.size}`}
                                    {variation.cut && ` - ${variation.cut}`}
                                    {variation.prep && ` - ${variation.prep}`}
                                    {` - ₹${displayPrice}`}
                                  </p>
                                )
                              })}
                            </div>
                          </div>
                        )}
                        
                        {editingProduct === vendorProduct.id ? (
                          <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#f9fafb', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                              <div>
                                <label style={{ display: 'block', marginBottom: '3px', fontSize: '12px', fontWeight: '500', color: '#374151' }}>Price (₹)</label>
                                <input
                                  type="number"
                                  value={editForm.price}
                                  onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                                  style={{ width: '100%', padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px' }}
                                />
                              </div>
                              <div>
                                <label style={{ display: 'block', marginBottom: '3px', fontSize: '12px', fontWeight: '500', color: '#374151' }}>Quantity</label>
                                <input
                                  type="number"
                                  placeholder="Leave empty for unlimited"
                                  value={editForm.quantity}
                                  onChange={(e) => setEditForm({...editForm, quantity: e.target.value})}
                                  style={{ width: '100%', padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px' }}
                                />
                              </div>
                            </div>
                            
                            <div style={{ marginBottom: '10px' }}>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                                <input
                                  type="checkbox"
                                  checked={editForm.available}
                                  onChange={(e) => setEditForm({...editForm, available: e.target.checked})}
                                  style={{ width: '14px', height: '14px' }}
                                />
                                <span style={{ fontSize: '12px', color: '#374151' }}>Available for sale</span>
                              </label>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                              <div>
                                <label style={{ display: 'block', marginBottom: '3px', fontSize: '12px', fontWeight: '500', color: '#374151' }}>Delivery Time</label>
                                <select
                                  value={editForm.deliveryTime}
                                  onChange={(e) => setEditForm({...editForm, deliveryTime: e.target.value})}
                                  style={{ width: '100%', padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px' }}
                                >
                                  <option value="30 minutes">30 minutes</option>
                                  <option value="1 hour">1 hour</option>
                                  <option value="2 hours">2 hours</option>
                                  <option value="Same day">Same day</option>
                                  <option value="Next day">Next day</option>
                                </select>
                              </div>
                              <div>
                                <label style={{ display: 'block', marginBottom: '3px', fontSize: '12px', fontWeight: '500', color: '#374151' }}>Delivery</label>
                                <select
                                  value={editForm.deliveryOption}
                                  onChange={(e) => setEditForm({...editForm, deliveryOption: e.target.value})}
                                  style={{ width: '100%', padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px' }}
                                >
                                  <option value="free">Free</option>
                                  <option value="charges">Fixed Charges</option>
                                  <option value="conditional">Free above amount</option>
                                </select>
                              </div>
                            </div>
                            
                            {editForm.deliveryOption === 'charges' && (
                              <div style={{ marginBottom: '10px' }}>
                                <label style={{ display: 'block', marginBottom: '3px', fontSize: '12px', fontWeight: '500', color: '#374151' }}>Delivery Charges (₹)</label>
                                <input
                                  type="number"
                                  value={editForm.deliveryCharges}
                                  onChange={(e) => setEditForm({...editForm, deliveryCharges: e.target.value})}
                                  style={{ width: '100%', padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px' }}
                                />
                              </div>
                            )}
                            
                            {editForm.deliveryOption === 'conditional' && (
                              <div style={{ marginBottom: '10px' }}>
                                <label style={{ display: 'block', marginBottom: '3px', fontSize: '12px', fontWeight: '500', color: '#374151' }}>Min Value for Free Delivery (₹)</label>
                                <input
                                  type="number"
                                  value={editForm.minValueForFreeDelivery}
                                  onChange={(e) => setEditForm({...editForm, minValueForFreeDelivery: e.target.value})}
                                  style={{ width: '100%', padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px' }}
                                />
                              </div>
                            )}
                            
                            <div style={{ marginBottom: '10px' }}>
                              <label style={{ display: 'block', marginBottom: '3px', fontSize: '12px', fontWeight: '500', color: '#374151' }}>Special Offer</label>
                              <input
                                type="text"
                                placeholder="e.g., Buy 2 Get 1 Free"
                                value={editForm.specialOffer}
                                onChange={(e) => setEditForm({...editForm, specialOffer: e.target.value})}
                                style={{ width: '100%', padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px' }}
                              />
                            </div>
                            
                            <div style={{ marginBottom: '15px', padding: '15px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                              <h4 style={{ color: '#374151', fontSize: '14px', marginBottom: '10px' }}>Edit Variation Multipliers</h4>
                              {editForm.variations.map((variation, index) => (
                                <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                                  <div style={{ fontSize: '12px', color: '#374151', padding: '6px' }}>
                                    {variation.weight && `${variation.weight}g`}
                                    {variation.quantity && `${variation.quantity} pieces`}
                                    {variation.size && ` ${variation.size}`}
                                    {variation.cut && ` - ${variation.cut}`}
                                    {variation.prep && ` - ${variation.prep}`}
                                  </div>
                                  <input
                                    type="number"
                                    step="0.1"
                                    min="0.1"
                                    value={variation.priceMultiplier || 1}
                                    onChange={(e) => updateVariation(index, 'priceMultiplier', parseFloat(e.target.value) || 1)}
                                    style={{ padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px' }}
                                  />
                                  <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: '500', padding: '6px' }}>
                                    ₹{Math.round(editForm.price * (variation.priceMultiplier || 1))}
                                  </div>
                                </div>
                              ))}
                              <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '8px', fontStyle: 'italic' }}>
                                Edit multipliers to adjust variation prices: Your Base Price × Multiplier
                              </p>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                              <button
                                onClick={updateProduct}
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
                                onClick={() => setEditingProduct(null)}
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
                          <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                            <button
                              onClick={() => startEditProduct(vendorProduct)}
                              style={{
                                padding: '6px 12px',
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
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Available Products Section */}
        <section style={{ marginBottom: '20px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <div 
            onClick={() => toggleSection('availableProducts')}
            style={{ 
              padding: '20px', 
              cursor: 'pointer', 
              borderBottom: expandedSections.availableProducts ? '1px solid #e5e7eb' : 'none',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <h2 style={{ fontSize: '24px', color: '#374151', margin: '0' }}>Available Products ({availableProducts.length})</h2>
            <span style={{ fontSize: '20px', color: '#6b7280' }}>{expandedSections.availableProducts ? '▼' : '▶'}</span>
          </div>
          {expandedSections.availableProducts && (
            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '15px' }}>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>
                  Products available for your categories: <strong>{currentVendor.products?.join(', ') || 'None assigned'}</strong>
                </p>
              </div>
              {availableProducts.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#6b7280', padding: '40px' }}>
                  <p style={{ marginBottom: '10px' }}>
                    {!currentVendor.products || currentVendor.products.length === 0 
                      ? 'No categories assigned. Contact admin to assign product categories.'
                      : 'No products available for your categories.'
                    }
                  </p>
                  <div style={{ fontSize: '12px', color: '#9ca3af', textAlign: 'left', backgroundColor: '#f9fafb', padding: '10px', borderRadius: '6px' }}>
                    <p><strong>Debug Info:</strong></p>
                    <p>Total products in database: {products.length}</p>
                    <p>Your categories: {currentVendor.products?.join(', ') || 'None'}</p>
                    <p>Products already added: {myProductIds.length}</p>
                    {products.length > 0 && (
                      <div style={{ marginTop: '10px' }}>
                        <p><strong>Product Categories Found:</strong></p>
                        {[...new Set(products.map(p => p.category))].map(cat => (
                          <span key={cat} style={{ 
                            display: 'inline-block', 
                            margin: '2px', 
                            padding: '2px 6px', 
                            backgroundColor: currentVendor.products?.includes(cat) ? '#dcfce7' : '#fef2f2',
                            color: currentVendor.products?.includes(cat) ? '#166534' : '#dc2626',
                            borderRadius: '4px',
                            fontSize: '11px'
                          }}>
                            {cat || 'undefined'}
                          </span>
                        ))}
                        <p style={{ marginTop: '8px' }}>
                          <strong>Matching products:</strong> {products.filter(p => currentVendor.products?.includes(p.category)).length}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {selectedProducts.size > 0 && (
                    <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ color: '#1e40af', margin: '0' }}>
                          {selectedProducts.size} product(s) selected
                        </p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button
                            onClick={() => setSelectedProducts(new Set())}
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
                            Clear Selection
                          </button>
                          <button
                            onClick={addSelectedProducts}
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
                            Add Selected to Store
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {Object.entries(
                    availableProducts.reduce((acc, product) => {
                      const category = product.category || 'uncategorized'
                      if (!acc[category]) acc[category] = []
                      acc[category].push(product)
                      return acc
                    }, {})
                  ).map(([category, categoryProducts]) => {
                    const allSelected = categoryProducts.every(p => selectedProducts.has(p.id))
                    const someSelected = categoryProducts.some(p => selectedProducts.has(p.id))
                    
                    return (
                      <div key={category} style={{ marginBottom: '20px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                        <div 
                          onClick={() => toggleCategory(category)}
                          style={{ 
                            padding: '15px', 
                            cursor: 'pointer',
                            borderBottom: expandedCategories[category] ? '1px solid #e5e7eb' : 'none',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: '#f9fafb'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <h3 style={{ 
                              color: '#16a34a', 
                              fontSize: '18px', 
                              margin: '0',
                              textTransform: 'capitalize'
                            }}>
                              {category} ({categoryProducts.length})
                            </h3>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                if (allSelected) {
                                  deselectAllInCategory(categoryProducts)
                                } else {
                                  selectAllInCategory(categoryProducts)
                                }
                              }}
                              style={{
                                padding: '4px 8px',
                                backgroundColor: allSelected ? '#dc2626' : '#16a34a',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '11px',
                                cursor: 'pointer'
                              }}
                            >
                              {allSelected ? 'Deselect All' : someSelected ? 'Select All' : 'Select All'}
                            </button>
                          </div>
                          <span style={{ fontSize: '16px', color: '#6b7280' }}>
                            {expandedCategories[category] ? '▼' : '▶'}
                          </span>
                        </div>
                        
                        {expandedCategories[category] && (
                          <div style={{ padding: '15px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px' }}>
                              {categoryProducts.map(product => (
                                <div key={product.id} style={{ 
                                  border: '1px solid #e5e7eb', 
                                  borderRadius: '8px', 
                                  padding: '15px',
                                  backgroundColor: selectedProducts.has(product.id) ? '#f0f9ff' : 'white',
                                  position: 'relative'
                                }}>
                                  <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                                    <input
                                      type="checkbox"
                                      checked={selectedProducts.has(product.id)}
                                      onChange={() => toggleProductSelection(product.id)}
                                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                    />
                                  </div>
                                  <img 
                                    src={product.image_url || 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop'} 
                                    alt={product.name}
                                    style={{ 
                                      width: '100%', 
                                      height: '120px', 
                                      objectFit: 'cover', 
                                      borderRadius: '6px',
                                      marginBottom: '10px'
                                    }}
                                  />
                                  <h4 style={{ color: '#16a34a', margin: '0 0 8px 0', fontSize: '16px' }}>{product.name}</h4>
                                  <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>
                                    Default Price: ₹{product.default_price}
                                  </p>
                                  <button
                                    onClick={async () => {
                                      try {
                                        const { collection, addDoc, serverTimestamp } = await import('firebase/firestore')
                                        const { db } = await import('../../lib/firebase')
                                        
                                        await addDoc(collection(db, 'vendorProducts'), {
                                          productId: product.id,
                                          vendorId: currentVendor.id,
                                          price: product.default_price || 100,
                                          available: true,
                                          deliveryTime: '2 hours',
                                          deliveryOption: 'free',
                                          deliveryCharges: 0,
                                          minValueForFreeDelivery: 0,
                                          specialOffer: '',
                                          createdAt: serverTimestamp()
                                        })
                                        
                                        alert(`${product.name} added to your store!`)
                                        loadVendorData(currentUser)
                                      } catch (error) {
                                        alert('Error adding product: ' + error.message)
                                      }
                                    }}
                                    style={{
                                      width: '100%',
                                      padding: '8px 16px',
                                      backgroundColor: '#16a34a',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '4px',
                                      fontSize: '14px',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    Add to Store
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </>
              )}
            </div>
          )}
        </section>

        {/* Orders */}
        <section style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '24px', color: '#374151', marginBottom: '20px' }}>Orders ({orders.length})</h2>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
            {orders.length === 0 ? (
              <p style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>No orders yet</p>
            ) : (
              orders.map(order => (
                <div key={order.id} style={{ 
                  padding: '15px', 
                  borderBottom: '1px solid #f3f4f6',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <p style={{ fontWeight: 'bold' }}>Order #{order.id.slice(-6)}</p>
                    <p style={{ color: '#6b7280', fontSize: '14px' }}>{order.customerName}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: '#16a34a', fontWeight: 'bold' }}>₹ {order.total}</p>
                    <p style={{ color: '#6b7280', fontSize: '14px' }}>{order.status}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </>
  )
}