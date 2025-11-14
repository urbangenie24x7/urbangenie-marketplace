import { useState } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../lib/firebase'

export default function VendorOnboarding() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    phone: '',
    email: '',
    address: '',
    pincode: '',
    businessType: '',
    categories: [],
    experience: '',
    documents: {
      businessLicense: '',
      foodLicense: '',
      gstNumber: ''
    }
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const categories = ['chicken', 'country-chicken', 'mutton', 'fish', 'prawns', 'crabs']

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await addDoc(collection(db, 'vendorApplications'), {
        ...formData,
        status: 'pending',
        appliedAt: serverTimestamp(),
        createdAt: serverTimestamp()
      })
      setSubmitted(true)
    } catch (error) {
      console.error('Error submitting application:', error)
      alert('Failed to submit application. Please try again.')
    }
    setIsSubmitting(false)
  }

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb', padding: '20px' }}>
        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '16px', textAlign: 'center', maxWidth: '500px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
          <div style={{ width: '80px', height: '80px', backgroundColor: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
              <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/>
            </svg>
          </div>
          <h2 style={{ color: '#1f2937', fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>Application Submitted!</h2>
          <p style={{ color: '#6b7280', marginBottom: '24px', lineHeight: '1.6' }}>
            Thank you for your interest in joining FreshCuts. Our team will review your application and contact you within 2-3 business days.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            style={{ backgroundColor: '#16a34a', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '20px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
        
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', padding: '30px', color: 'white', textAlign: 'center' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Join FreshCuts</h1>
          <p style={{ opacity: '0.9', fontSize: '16px' }}>Become a trusted vendor partner</p>
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ width: '30px', height: '4px', backgroundColor: step >= i ? 'white' : 'rgba(255,255,255,0.3)', borderRadius: '2px' }} />
            ))}
          </div>
        </div>

        <div style={{ padding: '40px' }}>
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#1f2937' }}>Business Information</h2>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>Business Name *</label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                  style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px' }}
                  placeholder="Enter your business name"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>Owner Name *</label>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                  style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px' }}
                  placeholder="Enter owner's full name"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>Phone *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px' }}
                    placeholder="10-digit mobile number"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px' }}
                    placeholder="business@email.com"
                  />
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!formData.businessName || !formData.ownerName || !formData.phone || !formData.email}
                style={{ width: '100%', padding: '12px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', opacity: (!formData.businessName || !formData.ownerName || !formData.phone || !formData.email) ? 0.5 : 1 }}
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#1f2937' }}>Location & Categories</h2>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>Business Address *</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px', minHeight: '80px' }}
                  placeholder="Complete business address"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>Pincode *</label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                  style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px' }}
                  placeholder="6-digit pincode"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500', color: '#374151' }}>Product Categories *</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {categories.map(category => (
                    <label key={category} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.categories.includes(category)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({...formData, categories: [...formData.categories, category]})
                          } else {
                            setFormData({...formData, categories: formData.categories.filter(c => c !== category)})
                          }
                        }}
                      />
                      <span style={{ textTransform: 'capitalize', fontSize: '14px' }}>{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setStep(1)}
                  style={{ flex: 1, padding: '12px', backgroundColor: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!formData.address || !formData.pincode || formData.categories.length === 0}
                  style={{ flex: 2, padding: '12px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', opacity: (!formData.address || !formData.pincode || formData.categories.length === 0) ? 0.5 : 1 }}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#1f2937' }}>Business Details</h2>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>Business Type *</label>
                <select
                  value={formData.businessType}
                  onChange={(e) => setFormData({...formData, businessType: e.target.value})}
                  style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px' }}
                >
                  <option value="">Select business type</option>
                  <option value="retail-shop">Retail Shop</option>
                  <option value="wholesale">Wholesale</option>
                  <option value="farm">Farm/Producer</option>
                  <option value="processing-unit">Processing Unit</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>Years of Experience *</label>
                <select
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px' }}
                >
                  <option value="">Select experience</option>
                  <option value="0-1">0-1 years</option>
                  <option value="2-5">2-5 years</option>
                  <option value="6-10">6-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>GST Number (Optional)</label>
                <input
                  type="text"
                  value={formData.documents.gstNumber}
                  onChange={(e) => setFormData({...formData, documents: {...formData.documents, gstNumber: e.target.value}})}
                  style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px' }}
                  placeholder="GST registration number"
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setStep(2)}
                  style={{ flex: 1, padding: '12px', backgroundColor: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!formData.businessType || !formData.experience || isSubmitting}
                  style={{ flex: 2, padding: '12px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', opacity: (!formData.businessType || !formData.experience || isSubmitting) ? 0.5 : 1 }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}