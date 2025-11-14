import { useState, useEffect } from 'react'

export default function PincodeManagement() {
  const [pincodes, setPincodes] = useState([])
  const [newPincode, setNewPincode] = useState('')
  const [newArea, setNewArea] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadPincodes()
  }, [])

  const loadPincodes = async () => {
    try {
      const { collection, getDocs } = await import('firebase/firestore')
      const { db } = await import('../../lib/firebase')
      
      const pincodeSnap = await getDocs(collection(db, 'serviceable_pincodes'))
      const pincodeData = pincodeSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setPincodes(pincodeData)
    } catch (error) {
      console.error('Error loading pincodes:', error)
    }
  }

  const addPincode = async () => {
    if (!newPincode || !newArea) {
      alert('Please enter both pincode and area name')
      return
    }

    setLoading(true)
    try {
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore')
      const { db } = await import('../../lib/firebase')
      
      await addDoc(collection(db, 'serviceable_pincodes'), {
        pincode: newPincode,
        area: newArea,
        active: true,
        created_at: serverTimestamp()
      })
      
      setNewPincode('')
      setNewArea('')
      loadPincodes()
      alert('Pincode added successfully!')
    } catch (error) {
      alert('Error adding pincode: ' + error.message)
    }
    setLoading(false)
  }

  const togglePincode = async (id, currentStatus) => {
    try {
      const { doc, updateDoc } = await import('firebase/firestore')
      const { db } = await import('../../lib/firebase')
      
      await updateDoc(doc(db, 'serviceable_pincodes', id), {
        active: !currentStatus
      })
      
      loadPincodes()
    } catch (error) {
      alert('Error updating pincode: ' + error.message)
    }
  }

  const deletePincode = async (id) => {
    if (!confirm('Delete this pincode?')) return
    
    try {
      const { doc, deleteDoc } = await import('firebase/firestore')
      const { db } = await import('../../lib/firebase')
      
      await deleteDoc(doc(db, 'serviceable_pincodes', id))
      loadPincodes()
      alert('Pincode deleted successfully!')
    } catch (error) {
      alert('Error deleting pincode: ' + error.message)
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#16a34a', fontSize: '28px', margin: '0' }}>Pincode Management</h1>
        <a href="/admin/dashboard" style={{ 
          padding: '8px 16px', 
          backgroundColor: '#6b7280', 
          color: 'white', 
          textDecoration: 'none', 
          borderRadius: '6px' 
        }}>
          Back to Dashboard
        </a>
      </div>

      {/* Add New Pincode */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '25px', 
        borderRadius: '12px', 
        border: '1px solid #e5e7eb',
        marginBottom: '30px'
      }}>
        <h2 style={{ fontSize: '20px', marginBottom: '20px', color: '#374151' }}>Add New Serviceable Pincode</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '15px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
              Pincode
            </label>
            <input
              type="text"
              value={newPincode}
              onChange={(e) => setNewPincode(e.target.value)}
              placeholder="e.g., 500034"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
              Area Name
            </label>
            <input
              type="text"
              value={newArea}
              onChange={(e) => setNewArea(e.target.value)}
              placeholder="e.g., Banjara Hills"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
          
          <button
            onClick={addPincode}
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: loading ? '#9ca3af' : '#16a34a',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {loading ? 'Adding...' : 'Add Pincode'}
          </button>
        </div>
      </div>

      {/* Pincodes List */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        border: '1px solid #e5e7eb',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '20px', margin: '0', color: '#374151' }}>
            Serviceable Pincodes ({pincodes.length})
          </h2>
        </div>
        
        {pincodes.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
            No pincodes added yet. Add your first serviceable pincode above.
          </div>
        ) : (
          <div style={{ overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f9fafb' }}>
                <tr>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Pincode
                  </th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Area
                  </th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Status
                  </th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {pincodes.map(pincode => (
                  <tr key={pincode.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '15px 20px', fontSize: '14px', color: '#374151', fontWeight: '500' }}>
                      {pincode.pincode}
                    </td>
                    <td style={{ padding: '15px 20px', fontSize: '14px', color: '#6b7280' }}>
                      {pincode.area}
                    </td>
                    <td style={{ padding: '15px 20px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: pincode.active ? '#dcfce7' : '#fef2f2',
                        color: pincode.active ? '#166534' : '#dc2626'
                      }}>
                        {pincode.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '15px 20px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => togglePincode(pincode.id, pincode.active)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: pincode.active ? '#f59e0b' : '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          {pincode.active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => deletePincode(pincode.id)}
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}