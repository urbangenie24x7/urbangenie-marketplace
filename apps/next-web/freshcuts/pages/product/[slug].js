import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useCart } from '../../lib/CartContext'
import SEOHead from '../../components/SEOHead'
import { generateProductSchema } from '../../components/ProductSchema'

export default function ProductPage() {
  const router = useRouter()
  const { slug } = router.query
  const { addToCart, getCartCount } = useCart()
  const [product, setProduct] = useState(null)
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (slug) {
      loadProduct()
    }
  }, [slug])

  const loadProduct = async () => {
    try {
      const { collection, getDocs } = await import('firebase/firestore')
      const { db } = await import('../../lib/firebase')
      
      const productsSnap = await getDocs(collection(db, 'products'))
      const foundProduct = productsSnap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .find(p => p.name.toLowerCase().replace(/\s+/g, '-') === slug)
      
      if (foundProduct) {
        setProduct(foundProduct)
        
        const vendorProductsSnap = await getDocs(collection(db, 'vendorProducts'))
        const vendorProducts = vendorProductsSnap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(vp => vp.productId === foundProduct.id && vp.available)
        
        const vendorsSnap = await getDocs(collection(db, 'vendors'))
        const allVendors = vendorsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        
        const productVendors = vendorProducts.map(vp => {
          const vendor = allVendors.find(v => v.id === vp.vendorId)
          return { ...vendor, price: vp.price, deliveryTime: vp.deliveryTime }
        })
        
        setVendors(productVendors)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error loading product:', error)
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>
  if (!product) return <div>Product not found</div>

  const structuredData = generateProductSchema(product, vendors, "Hyderabad")

  return (
    <>
      <SEOHead 
        title={`${product.name} - Fresh ${product.category} | Buy Online Hyderabad | FreshCuts`}
        description={`Buy fresh ${product.name} online in Hyderabad. Starting ₹${Math.min(...vendors.map(v => v.price))}. ${product.variations?.length || 0} weight options. Same day delivery.`}
        image={product.image_url}
        url={`https://freshcuts.com/product/${slug}`}
        structuredData={structuredData}
      />
      
      <nav style={{ backgroundColor: '#16a34a', padding: '10px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/customer/marketplace" style={{ color: 'white', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold' }}>FreshCuts</Link>
          <Link href="/customer/cart" style={{ color: 'white', textDecoration: 'none', fontSize: '20px' }}>🛒</Link>
        </div>
      </nav>

      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          <img src={product.image_url} alt={`Fresh ${product.name} - ${product.category} Hyderabad delivery`} style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '12px' }} />
          
          <div>
            <h1 style={{ color: '#16a34a', fontSize: '32px' }}>{product.name}</h1>
            <p style={{ color: '#6b7280', fontSize: '18px', textTransform: 'capitalize' }}>Fresh {product.category} • Premium Quality</p>
            
            <h3 style={{ color: '#374151', marginTop: '20px' }}>Available from {vendors.length} Local Vendors:</h3>
            {vendors.map(vendor => (
              <div key={vendor.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '15px', margin: '10px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h4 style={{ color: '#16a34a' }}>{vendor.name}</h4>
                  <span style={{ color: '#16a34a', fontSize: '20px', fontWeight: 'bold' }}>₹{vendor.price}</span>
                </div>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>🚚 {vendor.deliveryTime} • 📍 2km away</p>
                <button onClick={() => addToCart({ ...product, price: vendor.price, vendorName: vendor.name })} style={{ marginTop: '10px', padding: '8px 16px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                  Add to Cart - ₹{vendor.price}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}