import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Navigation from '../../components/Navigation'
import SEOHead from '../../components/SEOHead'
import { getCurrentUser, logout, requireAuth } from '../../lib/auth'

export default function Admin() {
  const [mounted, setMounted] = useState(false)
  const [settings, setSettings] = useState({ marginPercentage: 15 })
  const [vendors, setVendors] = useState([])
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const [orders, setOrders] = useState([])
  const [vendorProducts, setVendorProducts] = useState([])
  const [categoryCards, setCategoryCards] = useState([])
  const [categories, setCategories] = useState(['chicken', 'mutton', 'fish', 'prawns', 'crabs', 'eggs'])
  const [editingVendor, setEditingVendor] = useState(null)
  const [editVendorCategories, setEditVendorCategories] = useState([])
  const [expandedSections, setExpandedSections] = useState({
    vendors: false,
    products: false,
    users: false,
    orders: false
  })
  const [showVendorForm, setShowVendorForm] = useState(false)
  const [newVendor, setNewVendor] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    categories: []
  })
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin',
    verticals: []
  })
  const [showAdminForm, setShowAdminForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [editImageUrl, setEditImageUrl] = useState('')
  const [editingVariations, setEditingVariations] = useState(null)
  const [variationsData, setVariationsData] = useState([])
  const [editingPrice, setEditingPrice] = useState(null)
  const [editPriceValue, setEditPriceValue] = useState('')
  const [uploadingImage, setUploadingImage] = useState(null)
  const [editingDetails, setEditingDetails] = useState(null)
  const [editNameValue, setEditNameValue] = useState('')
  const [editCategoryValue, setEditCategoryValue] = useState('')
  const [showNewProductForm, setShowNewProductForm] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'chicken',
    default_price: '',
    unit: 'kg',
    image_url: '',
    available: true,
    variations: [],
    defaultDeliveryOptions: {
      pickup: { available: true, charges: 0 },
      normal: { available: true, charges: 0, time: '3-4 hours', minOrderForFree: 0 },
      express: { available: false, charges: 50, time: '1 hour', minOrderForFree: 0 }
    }
  })
  const [currentUser, setCurrentUser] = useState(null)
  const [currentUserRole, setCurrentUserRole] = useState('admin')
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    const user = requireAuth(['admin', 'super_admin'])
    if (!user) return
    
    setCurrentUser(user)
    setCurrentUserRole(user.role)
    setMounted(true)
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const { collection, getDocs } = await import('firebase/firestore')
      const { db } = await import('../../lib/firebase')
      
      const settingsSnap = await getDocs(collection(db, 'settings'))
      if (settingsSnap.docs.length > 0) {
        setSettings(settingsSnap.docs[0].data())
      }
      
      const vendorsSnap = await getDocs(collection(db, 'vendors'))
      setVendors(vendorsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      
      const productsSnap = await getDocs(collection(db, 'products'))
      setProducts(productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      
      const usersSnap = await getDocs(collection(db, 'users'))
      setUsers(usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      
      const ordersSnap = await getDocs(collection(db, 'orders'))
      setOrders(ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      
      const vendorProductsSnap = await getDocs(collection(db, 'vendorProducts'))
      setVendorProducts(vendorProductsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      
      const categoryCardsSnap = await getDocs(collection(db, 'categoryCards'))
      setCategoryCards(categoryCardsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    } catch (error) {
      console.error('Error loading admin data:', error)
    }
  }

  const updateMargin = async () => {
    try {
      const { collection, getDocs, addDoc, updateDoc, doc } = await import('firebase/firestore')
      const { db } = await import('../../lib/firebase')
      
      const settingsSnap = await getDocs(collection(db, 'settings'))
      if (settingsSnap.docs.length > 0) {
        await updateDoc(doc(db, 'settings', settingsSnap.docs[0].id), settings)
      } else {
        await addDoc(collection(db, 'settings'), settings)
      }
      alert('Margin updated successfully!')
    } catch (error) {
      alert('Error updating margin: ' + error.message)
    }
  }

  const fixVendorProducts = async () => {
    if (!confirm('This will reset all vendor-product associations. Continue?')) return
    
    try {
      const { fixVendorProducts } = await import('../../lib/fixVendorProducts')
      await fixVendorProducts()
      alert('Vendor products fixed successfully!')
      loadData()
    } catch (error) {
      alert('Error fixing vendor products: ' + error.message)
    }
  }



  const startEditingVendor = (vendor) => {
    setEditingVendor(vendor.id)
    setEditVendorCategories(vendor.products || [])
  }

  const updateVendorCategories = async (vendorId) => {
    try {
      const { doc, updateDoc } = await import('firebase/firestore')
      const { db } = await import('../../lib/firebase')
      
      await updateDoc(doc(db, 'vendors', vendorId), {
        products: editVendorCategories
      })
      
      setEditingVendor(null)
      setEditVendorCategories([])
      loadData()
      alert('Vendor categories updated successfully!')
    } catch (error) {
      alert('Error updating vendor categories: ' + error.message)
    }
  }

  const toggleVendorCategory = (category) => {
    setEditVendorCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const getVendorOrderCount = (vendorId) => {
    return orders.filter(order => order.vendorId === vendorId).length
  }

  const getVendorProductCount = (vendorId) => {
    return vendorProducts.filter(vp => vp.vendorId === vendorId).length
  }

  const onboardVendor = async () => {
    try {
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore')
      const { db } = await import('../../lib/firebase')
      
      await addDoc(collection(db, 'vendors'), {
        name: newVendor.name,
        email: newVendor.email,
        phone: newVendor.phone,
        address: newVendor.address,
        products: newVendor.categories,
        location: { lat: -1.2921, lng: 36.8219 },
        createdAt: serverTimestamp()
      })
      
      await addDoc(collection(db, 'users'), {
        name: newVendor.name,
        email: newVendor.email,
        password: newVendor.password,
        role: 'vendor',
        shopName: newVendor.name,
        createdAt: serverTimestamp()
      })
      
      alert(`Vendor onboarded successfully!\nEmail: ${newVendor.email}\nPassword: ${newVendor.password}`)
      setNewVendor({ name: '', email: '', password: '', phone: '', address: '', categories: [] })
      setShowVendorForm(false)
      loadData()
    } catch (error) {
      alert('Error onboarding vendor: ' + error.message)
    }
  }

  const toggleCategory = (category) => {
    setNewVendor(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }))
  }

  const onboardAdmin = async () => {
    try {
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore')
      const { db } = await import('../../lib/firebase')
      
      await addDoc(collection(db, 'users'), {
        name: newAdmin.name,
        email: newAdmin.email,
        password: newAdmin.password,
        role: newAdmin.role,
        verticals: newAdmin.verticals,
        createdAt: serverTimestamp()
      })
      
      alert(`Admin created successfully!\nEmail: ${newAdmin.email}\nPassword: ${newAdmin.password}\nRole: ${newAdmin.role}\nVerticals: ${newAdmin.verticals.join(', ')}`)
      setNewAdmin({ name: '', email: '', password: '', role: 'admin', verticals: [] })
      setShowAdminForm(false)
      loadData()
    } catch (error) {
      alert('Error creating admin: ' + error.message)
    }
  }

  const toggleAdminVertical = (vertical) => {
    setNewAdmin(prev => ({
      ...prev,
      verticals: prev.verticals.includes(vertical)
        ? prev.verticals.filter(v => v !== vertical)
        : [...prev.verticals, vertical]
    }))
  }

  // Product Management Functions
  const addNewProduct = async () => {
    try {
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore')
      const { db } = await import('../../lib/firebase')
      
      await addDoc(collection(db, 'products'), {
        ...newProduct,
        default_price: parseFloat(newProduct.default_price),
        createdAt: serverTimestamp()
      })
      
      setNewProduct({ name: '', category: 'chicken', default_price: '', unit: 'kg', image_url: '', available: true, variations: [] })
      setShowNewProductForm(false)
      loadData()
      alert('Product added successfully!')
    } catch (error) {
      alert('Error adding product: ' + error.message)
    }
  }

  const startEditingImage = (product) => {
    setEditingProduct(product.id)
    setEditImageUrl(product.image_url || '')
  }

  const updateProductImage = async (productId) => {
    try {
      const { doc, updateDoc } = await import('firebase/firestore')
      const { db } = await import('../../lib/firebase')
      
      await updateDoc(doc(db, 'products', productId), {
        image_url: editImageUrl
      })
      
      setEditingProduct(null)
      setEditImageUrl('')
      loadData()
      alert('Product image updated successfully!')
    } catch (error) {
      alert('Error updating image: ' + error.message)
    }
  }

  const startEditingVariations = (product) => {
    setEditingVariations(product.id)
    setVariationsData(product.variations || [])
  }

  const updateProductVariations = async (productId) => {
    try {
      const { doc, updateDoc } = await import('firebase/firestore')
      const { db } = await import('../../lib/firebase')
      
      await updateDoc(doc(db, 'products', productId), {
        variations: variationsData
      })
      
      setEditingVariations(null)
      setVariationsData([])
      loadData()
      alert('Product variations updated successfully!')
    } catch (error) {
      alert('Error updating variations: ' + error.message)
    }
  }

  const addVariation = () => {
    setVariationsData([...variationsData, { weight: '', priceMultiplier: 1 }])
  }

  const updateVariation = (index, field, value) => {
    const updated = [...variationsData]
    updated[index] = { ...updated[index], [field]: value }
    setVariationsData(updated)
  }

  const removeVariation = (index) => {
    setVariationsData(variationsData.filter((_, i) => i !== index))
  }

  const startEditingPrice = (product) => {
    setEditingPrice(product.id)
    setEditPriceValue(product.default_price || '')
  }

  const updateProductPrice = async (productId) => {
    try {
      const { doc, updateDoc } = await import('firebase/firestore')
      const { db } = await import('../../lib/firebase')
      
      await updateDoc(doc(db, 'products', productId), {
        default_price: parseFloat(editPriceValue)
      })
      
      setEditingPrice(null)
      setEditPriceValue('')
      loadData()
      alert('Product price updated successfully!')
    } catch (error) {
      alert('Error updating price: ' + error.message)
    }
  }

  const startEditingDetails = (product) => {
    setEditingDetails(product.id)
    setEditNameValue(product.name || '')
    setEditCategoryValue(product.category || '')
  }

  const updateProductDetails = async (productId) => {
    try {
      const { doc, updateDoc } = await import('firebase/firestore')
      const { db } = await import('../../lib/firebase')
      
      await updateDoc(doc(db, 'products', productId), {
        name: editNameValue,
        category: editCategoryValue
      })
      
      setEditingDetails(null)
      setEditNameValue('')
      setEditCategoryValue('')
      loadData()
      alert('Product details updated successfully!')
    } catch (error) {
      alert('Error updating product details: ' + error.message)
    }
  }

  const deleteProduct = async (productId, productName) => {
    if (!confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      return
    }
    
    try {
      const { doc, deleteDoc } = await import('firebase/firestore')
      const { db } = await import('../../lib/firebase')
      
      await deleteDoc(doc(db, 'products', productId))
      loadData()
      alert('Product deleted successfully!')
    } catch (error) {
      alert('Error deleting product: ' + error.message)
    }
  }

  const duplicateProduct = async (product) => {
    try {
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore')
      const { db } = await import('../../lib/firebase')
      
      const duplicatedProduct = {
        ...product,
        name: `${product.name} (Copy)`,
        createdAt: serverTimestamp()
      }
      
      delete duplicatedProduct.id
      await addDoc(collection(db, 'products'), duplicatedProduct)
      loadData()
      alert('Product duplicated successfully!')
    } catch (error) {
      alert('Error duplicating product: ' + error.message)
    }
  }

  if (!mounted) {
    return <div style={{ padding: '20px' }}>Loading...</div>
  }

  return (
    <>
      <SEOHead 
        title="Admin Dashboard | FreshCuts"
        description="Manage FreshCuts marketplace. Vendor onboarding, product management, and platform settings."
        url="https://freshcuts.com/admin"
      />
      <Navigation />
      <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ color: '#16a34a', fontSize: '32px', margin: '0' }}>Admin Dashboard</h1>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: '5px 0 0 0' }}>
              Welcome, {currentUser?.name} | Role: <span style={{ 
                backgroundColor: currentUserRole === 'super_admin' ? '#dc2626' : '#3b82f6',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500',
                textTransform: 'capitalize'
              }}>
                {currentUserRole === 'super_admin' ? 'Super Admin' : 'Vertical Admin'}
              </span>
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              onClick={logout}
              style={{
                padding: '8px 16px',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Logout
            </button>

          </div>
        </div>
        


        {/* Dashboard Tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          {/* Stats Tiles */}



          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <h3 style={{ color: '#374151', fontSize: '16px', margin: '0' }}>Total Orders</h3>
              <div style={{ backgroundColor: '#fef3c7', padding: '8px', borderRadius: '8px' }}>
                <span style={{ fontSize: '20px' }}>📋</span>
              </div>
            </div>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', margin: '0' }}>{orders.length}</p>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '5px 0 0 0' }}>All time orders</p>
          </div>

          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <h3 style={{ color: '#374151', fontSize: '16px', margin: '0' }}>Platform Margin</h3>
              <div style={{ backgroundColor: '#fce7f3', padding: '8px', borderRadius: '8px' }}>
                <span style={{ fontSize: '20px' }}>💰</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <input
                type="number"
                value={settings.marginPercentage}
                onChange={(e) => setSettings({ ...settings, marginPercentage: parseFloat(e.target.value) })}
                style={{
                  padding: '6px 10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  width: '80px',
                  textAlign: 'center'
                }}
              />
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>%</span>
            </div>
            <button
              onClick={updateMargin}
              style={{
                padding: '8px 16px',
                backgroundColor: '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                width: '100%'
              }}
            >
              Update Margin
            </button>
          </div>
        </div>

        {/* Quick Actions Tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' }}>
          <a
            href="/admin/products"
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              textDecoration: 'none',
              textAlign: 'center',
              display: 'block',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🥩</div>
            <h3 style={{ color: '#374151', fontSize: '16px', margin: '0 0 5px 0' }}>Product Master</h3>
            <p style={{ color: '#6b7280', fontSize: '12px', margin: '0' }}>{products.length} products</p>
          </a>

          <a
            href="/admin/vendors"
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              textDecoration: 'none',
              textAlign: 'center',
              display: 'block',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🏪</div>
            <h3 style={{ color: '#374151', fontSize: '16px', margin: '0 0 5px 0' }}>Vendor Master</h3>
            <p style={{ color: '#6b7280', fontSize: '12px', margin: '0' }}>{vendors.length} vendors</p>
          </a>

          <a
            href="/admin/categories"
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              textDecoration: 'none',
              textAlign: 'center',
              display: 'block',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>📋</div>
            <h3 style={{ color: '#374151', fontSize: '16px', margin: '0 0 5px 0' }}>Category Master</h3>
            <p style={{ color: '#6b7280', fontSize: '12px', margin: '0' }}>{categoryCards.length} categories</p>
          </a>

          <a
            href="/admin/content"
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              textDecoration: 'none',
              textAlign: 'center',
              display: 'block',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🎨</div>
            <h3 style={{ color: '#374151', fontSize: '16px', margin: '0 0 5px 0' }}>Content</h3>
            <p style={{ color: '#6b7280', fontSize: '12px', margin: '0' }}>Manage content</p>
          </a>

          <a
            href="/admin/vendor-applications"
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              textDecoration: 'none',
              textAlign: 'center',
              display: 'block',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>📝</div>
            <h3 style={{ color: '#374151', fontSize: '16px', margin: '0 0 5px 0' }}>Applications</h3>
            <p style={{ color: '#6b7280', fontSize: '12px', margin: '0' }}>Review vendors</p>
          </a>
        </div>

        {/* Management Sections */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
        
        {/* Admin Management - Super Admin Only */}
        {currentUserRole === 'super_admin' && (
        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '24px', color: '#374151', margin: '0' }}>Admin Management</h2>
            <button
              onClick={() => setShowAdminForm(!showAdminForm)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#8b5cf6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              {showAdminForm ? 'Cancel' : 'Add New Admin'}
            </button>
          </div>
          
          {showAdminForm && (
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px', backgroundColor: '#f9fafb', marginBottom: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <input
                  type="text"
                  placeholder="Admin Name"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                  style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                  style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                  style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                />
                <select
                  value={newAdmin.role}
                  onChange={(e) => setNewAdmin({...newAdmin, role: e.target.value})}
                  style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                >
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Assigned Verticals:</label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {['food', 'grocery', 'freshcuts', 'health', 'services'].map(vertical => (
                    <button
                      key={vertical}
                      onClick={() => toggleAdminVertical(vertical)}
                      disabled={newAdmin.role === 'super_admin'}
                      style={{
                        padding: '8px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        backgroundColor: newAdmin.role === 'super_admin' ? '#e5e7eb' : (newAdmin.verticals.includes(vertical) ? '#8b5cf6' : 'white'),
                        color: newAdmin.role === 'super_admin' ? '#6b7280' : (newAdmin.verticals.includes(vertical) ? 'white' : '#374151'),
                        cursor: newAdmin.role === 'super_admin' ? 'not-allowed' : 'pointer',
                        textTransform: 'capitalize'
                      }}
                    >
                      {vertical}
                    </button>
                  ))}
                </div>
                {newAdmin.role === 'super_admin' && (
                  <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '5px' }}>Super Admins have access to all verticals</p>
                )}
              </div>
              <button
                onClick={onboardAdmin}
                disabled={!newAdmin.name || !newAdmin.email || !newAdmin.password || (newAdmin.role === 'admin' && newAdmin.verticals.length === 0)}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#8b5cf6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  opacity: (!newAdmin.name || !newAdmin.email || !newAdmin.password || (newAdmin.role === 'admin' && newAdmin.verticals.length === 0)) ? 0.5 : 1
                }}
              >
                Create Admin
              </button>
            </div>
          )}
          
          <div style={{ padding: '15px', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
            <h3 style={{ color: '#1e40af', fontSize: '16px', marginBottom: '10px' }}>Access Control Summary</h3>
            <ul style={{ color: '#1e40af', fontSize: '14px', margin: '0', paddingLeft: '20px' }}>
              <li><strong>Customers:</strong> Anonymous browsing across all verticals, authentication required only at checkout</li>
              <li><strong>Vendors:</strong> Access only to assigned vertical(s) and own vendor data (orders, products, payouts)</li>
              <li><strong>Admins:</strong> Vertical-scoped access to manage assigned vertical(s) only</li>
              <li><strong>Super Admins:</strong> Full platform access across all verticals</li>
            </ul>
          </div>
        </div>
        )}
        
        </div>
      </div>
    </>
  )
}