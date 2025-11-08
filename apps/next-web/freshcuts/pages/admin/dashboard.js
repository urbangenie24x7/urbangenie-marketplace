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
  const [categories, setCategories] = useState(['chicken', 'mutton', 'fish', 'prawns', 'crabs', 'eggs'])
  const [newCategory, setNewCategory] = useState('')
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
    variations: []
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

  const addCategory = () => {
    if (newCategory && !categories.includes(newCategory.toLowerCase())) {
      setCategories([...categories, newCategory.toLowerCase()])
      setNewCategory('')
    }
  }

  const deleteCategory = (categoryToDelete) => {
    if (confirm(`Delete category "${categoryToDelete}"? This will remove it from all vendors.`)) {
      setCategories(categories.filter(cat => cat !== categoryToDelete))
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
            <button
              onClick={async () => {
                const { seedTestData } = await import('../../lib/seedData')
                const result = await seedTestData()
                alert(result ? 'Seed data added successfully!' : 'Seed data failed!')
              }}
              style={{
                padding: '10px 20px',
                backgroundColor: '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Seed Database
            </button>
            <button
              onClick={fixVendorProducts}
              style={{
                padding: '10px 20px',
                backgroundColor: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Fix Vendor Products
            </button>
          </div>
        </div>
        
        {/* Category Management */}
        <section style={{ marginBottom: '40px', backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#374151' }}>Product Categories</h2>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="New category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
            <button
              onClick={addCategory}
              style={{
                padding: '8px 16px',
                backgroundColor: '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Add Category
            </button>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map(category => (
              <div key={category} style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#f3f4f6',
                padding: '6px 12px',
                borderRadius: '20px',
                border: '1px solid #d1d5db'
              }}>
                <span style={{ textTransform: 'capitalize', marginRight: '8px' }}>{category}</span>
                <button
                  onClick={() => deleteCategory(category)}
                  style={{
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Margin Settings */}
        <section style={{ marginBottom: '40px', backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#374151' }}>Margin Settings</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <label style={{ fontSize: '16px', color: '#374151' }}>Platform Margin:</label>
            <input
              type="number"
              value={settings.marginPercentage}
              onChange={(e) => setSettings({ ...settings, marginPercentage: parseFloat(e.target.value) })}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '16px',
                width: '100px'
              }}
            />
            <span style={{ fontSize: '16px', color: '#374151' }}>%</span>
            <button
              onClick={updateMargin}
              style={{
                padding: '8px 16px',
                backgroundColor: '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Update
            </button>
          </div>
        </section>

        {/* Admin Management - Super Admin Only */}
        {currentUserRole === 'super_admin' && (
        <section style={{ marginBottom: '20px', backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
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
        </section>
        )}

        {/* Vendor Onboarding */}
        <section style={{ marginBottom: '20px', backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '24px', color: '#374151', margin: '0' }}>Vendor Onboarding</h2>
            <button
              onClick={() => setShowVendorForm(!showVendorForm)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              {showVendorForm ? 'Cancel' : 'Add New Vendor'}
            </button>
          </div>
          
          {showVendorForm && (
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px', backgroundColor: '#f9fafb' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <input
                  type="text"
                  placeholder="Vendor Name"
                  value={newVendor.name}
                  onChange={(e) => setNewVendor({...newVendor, name: e.target.value})}
                  style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newVendor.email}
                  onChange={(e) => setNewVendor({...newVendor, email: e.target.value})}
                  style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={newVendor.password}
                  onChange={(e) => setNewVendor({...newVendor, password: e.target.value})}
                  style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={newVendor.phone}
                  onChange={(e) => setNewVendor({...newVendor, phone: e.target.value})}
                  style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                />
              </div>
              <input
                type="text"
                placeholder="Address"
                value={newVendor.address}
                onChange={(e) => setNewVendor({...newVendor, address: e.target.value})}
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px', marginBottom: '15px' }}
              />
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Product Categories:</label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => toggleCategory(category)}
                      style={{
                        padding: '8px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        backgroundColor: newVendor.categories.includes(category) ? '#16a34a' : 'white',
                        color: newVendor.categories.includes(category) ? 'white' : '#374151',
                        cursor: 'pointer',
                        textTransform: 'capitalize'
                      }}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={onboardVendor}
                disabled={!newVendor.name || !newVendor.email || !newVendor.password}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#16a34a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  opacity: (!newVendor.name || !newVendor.email || !newVendor.password) ? 0.5 : 1
                }}
              >
                Onboard Vendor
              </button>
            </div>
          )}
        </section>

        {/* Products Management */}
        <section style={{ marginBottom: '20px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <div 
            onClick={() => toggleSection('products')}
            style={{ 
              padding: '20px', 
              cursor: 'pointer', 
              borderBottom: expandedSections.products ? '1px solid #e5e7eb' : 'none',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <h2 style={{ fontSize: '24px', color: '#374151', margin: '0' }}>Products ({products.length})</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowNewProductForm(!showNewProductForm)
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                {showNewProductForm ? 'Cancel' : 'Add Product'}
              </button>
              <span style={{ fontSize: '20px', color: '#6b7280' }}>{expandedSections.products ? '▼' : '▶'}</span>
            </div>
          </div>
          {expandedSections.products && (
            <div style={{ padding: '20px' }}>
              {/* Add New Product Form */}
              {showNewProductForm && (
                <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px', backgroundColor: '#f9fafb', marginBottom: '20px' }}>
                  <h3 style={{ color: '#374151', fontSize: '18px', marginBottom: '15px' }}>Add New Product</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                    <input
                      type="text"
                      placeholder="Product Name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                    />
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                    >
                      {categories.map(category => (
                        <option key={category} value={category} style={{ textTransform: 'capitalize' }}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Default Price"
                      value={newProduct.default_price}
                      onChange={(e) => setNewProduct({...newProduct, default_price: e.target.value})}
                      style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                    />
                    <input
                      type="text"
                      placeholder="Unit (e.g., kg, pieces)"
                      value={newProduct.unit}
                      onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
                      style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                    />
                  </div>
                  <input
                    type="url"
                    placeholder="Image URL"
                    value={newProduct.image_url}
                    onChange={(e) => setNewProduct({...newProduct, image_url: e.target.value})}
                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px', marginBottom: '15px' }}
                  />
                  <button
                    onClick={addNewProduct}
                    disabled={!newProduct.name || !newProduct.default_price}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      opacity: (!newProduct.name || !newProduct.default_price) ? 0.5 : 1
                    }}
                  >
                    Add Product
                  </button>
                </div>
              )}
              
              {/* Products by Category */}
              {Object.entries(
                products.reduce((acc, product) => {
                  const category = product.category || 'uncategorized'
                  if (!acc[category]) acc[category] = []
                  acc[category].push(product)
                  return acc
                }, {})
              ).map(([category, categoryProducts]) => (
                <div key={category} style={{ marginBottom: '30px' }}>
                  <h3 style={{ 
                    color: '#16a34a', 
                    fontSize: '18px', 
                    marginBottom: '15px', 
                    textTransform: 'capitalize',
                    borderBottom: '2px solid #16a34a',
                    paddingBottom: '5px'
                  }}>
                    {category} ({categoryProducts.length})
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                    {categoryProducts.map(product => (
                      <div key={product.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '15px' }}>
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
                          <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '4px' }}>
                            <button
                              onClick={() => startEditingImage(product)}
                              style={{
                                backgroundColor: 'rgba(0,0,0,0.7)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '4px 8px',
                                fontSize: '12px',
                                cursor: 'pointer'
                              }}
                            >
                              Edit Image
                            </button>
                          </div>
                          <div style={{ position: 'absolute', top: '8px', left: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <button
                              onClick={() => deleteProduct(product.id, product.name)}
                              style={{
                                backgroundColor: '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '28px',
                                height: '28px',
                                fontSize: '14px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              🗑️
                            </button>
                            <button
                              onClick={() => duplicateProduct(product)}
                              style={{
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '28px',
                                height: '28px',
                                fontSize: '14px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              📋
                            </button>
                          </div>
                        </div>
                        
                        {/* Image URL Editor */}
                        {editingProduct === product.id && (
                          <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                            <input
                              type="url"
                              placeholder="Enter image URL"
                              value={editImageUrl}
                              onChange={(e) => setEditImageUrl(e.target.value)}
                              style={{
                                width: '100%',
                                padding: '8px',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                marginBottom: '8px'
                              }}
                            />
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                onClick={() => updateProductImage(product.id)}
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
                        )}
                        
                        {/* Product Details */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <h3 style={{ color: '#374151', margin: '0', fontSize: '16px' }}>{product.name}</h3>
                          <button
                            onClick={() => startEditingDetails(product)}
                            style={{
                              padding: '2px 6px',
                              backgroundColor: '#8b5cf6',
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
                        
                        {/* Details Editor */}
                        {editingDetails === product.id && (
                          <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                            <input
                              type="text"
                              placeholder="Product name"
                              value={editNameValue}
                              onChange={(e) => setEditNameValue(e.target.value)}
                              style={{
                                width: '100%',
                                padding: '8px',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                marginBottom: '8px'
                              }}
                            />
                            <select
                              value={editCategoryValue}
                              onChange={(e) => setEditCategoryValue(e.target.value)}
                              style={{
                                width: '100%',
                                padding: '8px',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                marginBottom: '8px'
                              }}
                            >
                              {categories.map(category => (
                                <option key={category} value={category} style={{ textTransform: 'capitalize' }}>
                                  {category.charAt(0).toUpperCase() + category.slice(1)}
                                </option>
                              ))}
                            </select>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                onClick={() => updateProductDetails(product.id)}
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
                                onClick={() => setEditingDetails(null)}
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
                        )}
                        
                        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
                          Category: {product.category}
                        </p>
                        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
                          Unit: {product.unit}
                        </p>
                        
                        {/* Price Management */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <p style={{ color: '#6b7280', fontSize: '14px', margin: '0' }}>
                            Default Price: ₹{product.default_price}
                          </p>
                          <button
                            onClick={() => startEditingPrice(product)}
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
                        
                        {/* Price Editor */}
                        {editingPrice === product.id && (
                          <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="Enter default price"
                              value={editPriceValue}
                              onChange={(e) => setEditPriceValue(e.target.value)}
                              style={{
                                width: '100%',
                                padding: '8px',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                marginBottom: '8px'
                              }}
                            />
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                onClick={() => updateProductPrice(product.id)}
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
                                onClick={() => setEditingPrice(null)}
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
                        )}
                        
                        {/* Variations Management */}
                        <div style={{ marginBottom: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <p style={{ color: '#374151', fontSize: '13px', fontWeight: '500', margin: '0' }}>Variations:</p>
                            <button
                              onClick={() => startEditingVariations(product)}
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
                          {product.variations && product.variations.length > 0 ? (
                            <div style={{ maxHeight: '80px', overflowY: 'auto' }}>
                              {product.variations.map((variation, index) => (
                                <p key={index} style={{ color: '#6b7280', fontSize: '12px', marginBottom: '2px' }}>
                                  • {variation.weight && `${variation.weight}g`}
                                  {variation.quantity && `${variation.quantity} pieces`}
                                  {variation.size && ` ${variation.size}`}
                                  {variation.cut && ` - ${variation.cut}`}
                                  {` - ₹${Math.round(product.default_price * variation.priceMultiplier)}`}
                                </p>
                              ))}
                            </div>
                          ) : (
                            <p style={{ color: '#9ca3af', fontSize: '12px' }}>No variations defined</p>
                          )}
                        </div>
                        
                        {/* Variations Editor */}
                        {editingVariations === product.id && (
                          <div style={{ marginBottom: '15px', padding: '15px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                            <h4 style={{ color: '#374151', fontSize: '14px', marginBottom: '10px' }}>Edit Variations</h4>
                            {variationsData.map((variation, index) => (
                              <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                                <input
                                  type="text"
                                  placeholder="Weight/Size/Cut"
                                  value={variation.weight || variation.quantity || variation.size || variation.cut || ''}
                                  onChange={(e) => {
                                    const field = product.category === 'chicken' || product.category === 'mutton' ? 'weight' :
                                                 product.category === 'fish' ? 'cut' :
                                                 product.category === 'prawns' ? 'size' :
                                                 product.category === 'eggs' ? 'quantity' : 'weight'
                                    updateVariation(index, field, e.target.value)
                                  }}
                                  style={{ padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px' }}
                                />
                                <input
                                  type="number"
                                  step="0.1"
                                  min="0.1"
                                  placeholder="Price multiplier"
                                  value={variation.priceMultiplier || ''}
                                  onChange={(e) => {
                                    const value = e.target.value
                                    updateVariation(index, 'priceMultiplier', value === '' ? '' : parseFloat(value))
                                  }}
                                  style={{ padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px' }}
                                />
                                <button
                                  onClick={() => removeVariation(index)}
                                  style={{
                                    padding: '8px 10px',
                                    backgroundColor: '#dc2626',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    fontSize: '16px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    minWidth: '30px'
                                  }}
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                              <button
                                onClick={addVariation}
                                style={{
                                  padding: '6px 12px',
                                  backgroundColor: '#10b981',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  cursor: 'pointer'
                                }}
                              >
                                Add Variation
                              </button>
                              <button
                                onClick={() => updateProductVariations(product.id)}
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
                                onClick={() => setEditingVariations(null)}
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
                        )}
                        
                        <p style={{ color: product.available ? '#10b981' : '#ef4444', fontSize: '12px' }}>
                          {product.available ? 'Available' : 'Unavailable'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Vendors Management */}
        <section style={{ marginBottom: '20px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <div 
            onClick={() => toggleSection('vendors')}
            style={{ 
              padding: '20px', 
              cursor: 'pointer', 
              borderBottom: expandedSections.vendors ? '1px solid #e5e7eb' : 'none',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <h2 style={{ fontSize: '24px', color: '#374151', margin: '0' }}>Vendors ({vendors.length})</h2>
            <span style={{ fontSize: '20px', color: '#6b7280' }}>{expandedSections.vendors ? '▼' : '▶'}</span>
          </div>
          {expandedSections.vendors && (
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
                {vendors.map(vendor => (
                  <div key={vendor.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <h3 style={{ color: '#16a34a', margin: '0' }}>{vendor.name}</h3>
                      <button
                        onClick={() => startEditingVendor(vendor)}
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
                        Edit Categories
                      </button>
                    </div>
                    
                    {editingVendor === vendor.id ? (
                      <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                        <p style={{ fontSize: '14px', marginBottom: '8px', fontWeight: '500' }}>Select Categories:</p>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                          {categories.map(category => (
                            <button
                              key={category}
                              onClick={() => toggleVendorCategory(category)}
                              style={{
                                padding: '6px 12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '16px',
                                backgroundColor: editVendorCategories.includes(category) ? '#16a34a' : 'white',
                                color: editVendorCategories.includes(category) ? 'white' : '#374151',
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
                      <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
                        Categories: {vendor.products?.join(', ') || 'None'}
                      </p>
                    )}
                    
                    <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
                      Products: {getVendorProductCount(vendor.id)}
                    </p>
                    <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
                      Total Orders: {getVendorOrderCount(vendor.id)}
                    </p>
                    <p style={{ color: '#9ca3af', fontSize: '12px' }}>
                      ID: {vendor.id}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  )
}