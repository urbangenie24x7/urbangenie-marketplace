import { useState, useEffect } from 'react'

export default function LocationPicker({ onLocationSelect, initialLocation = null }) {
  const [location, setLocation] = useState(initialLocation || { lat: null, lng: null, address: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const getCurrentLocation = () => {
    setLoading(true)
    setError('')
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        
        try {
          // Get address from coordinates using reverse geocoding
          const address = await reverseGeocode(lat, lng)
          const newLocation = { lat, lng, address }
          setLocation(newLocation)
          onLocationSelect(newLocation)
        } catch (error) {
          console.error('Error getting address:', error)
          const newLocation = { lat, lng, address: `${lat.toFixed(6)}, ${lng.toFixed(6)}` }
          setLocation(newLocation)
          onLocationSelect(newLocation)
        }
        setLoading(false)
      },
      (error) => {
        setError('Unable to get your location: ' + error.message)
        setLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
  }

  const reverseGeocode = async (lat, lng) => {
    // Using a simple reverse geocoding service (in production, use Google Maps API)
    try {
      const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`)
      const data = await response.json()
      return data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
    } catch (error) {
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
    }
  }

  const searchLocation = async (query) => {
    if (!query.trim()) return
    
    setLoading(true)
    setError('')
    
    try {
      // Using Nominatim for geocoding (free alternative to Google Maps)
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`)
      const data = await response.json()
      
      if (data && data.length > 0) {
        const result = data[0]
        const newLocation = {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
          address: result.display_name
        }
        setLocation(newLocation)
        onLocationSelect(newLocation)
      } else {
        setError('Location not found')
      }
    } catch (error) {
      setError('Error searching location: ' + error.message)
    }
    
    setLoading(false)
  }

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '15px', backgroundColor: '#f9fafb' }}>
      <h4 style={{ color: '#374151', fontSize: '16px', marginBottom: '15px', margin: '0 0 15px 0' }}>
        📍 Location Details
      </h4>
      
      {/* Current Location Display */}
      {location.lat && location.lng && (
        <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f0f9ff', borderRadius: '6px', border: '1px solid #bfdbfe' }}>
          <p style={{ color: '#1e40af', fontSize: '14px', margin: '0 0 5px 0', fontWeight: '500' }}>
            Selected Location:
          </p>
          <p style={{ color: '#1e40af', fontSize: '12px', margin: '0', wordBreak: 'break-word' }}>
            {location.address}
          </p>
          <p style={{ color: '#6b7280', fontSize: '11px', margin: '5px 0 0 0' }}>
            Coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
          </p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#fef2f2', borderRadius: '6px', border: '1px solid #fecaca' }}>
          <p style={{ color: '#dc2626', fontSize: '14px', margin: '0' }}>
            {error}
          </p>
        </div>
      )}

      {/* Location Actions */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
        <button
          onClick={getCurrentLocation}
          disabled={loading}
          style={{
            padding: '8px 16px',
            backgroundColor: loading ? '#9ca3af' : '#16a34a',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          {loading ? '⏳' : '📍'} {loading ? 'Getting Location...' : 'Use Current Location'}
        </button>
      </div>

      {/* Manual Location Search */}
      <div>
        <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
          Or Search Location:
        </label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Enter address, city, or landmark"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                searchLocation(e.target.value)
              }
            }}
            style={{
              flex: 1,
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
          <button
            onClick={(e) => {
              const input = e.target.previousElementSibling
              searchLocation(input.value)
            }}
            disabled={loading}
            style={{
              padding: '8px 16px',
              backgroundColor: loading ? '#9ca3af' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            🔍 Search
          </button>
        </div>
      </div>

      {/* Manual Coordinates Input */}
      <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #e5e7eb' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
          Or Enter Coordinates Manually:
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '10px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '3px', fontSize: '12px', color: '#6b7280' }}>Latitude</label>
            <input
              type="number"
              step="any"
              placeholder="e.g., 19.0760"
              defaultValue={location.lat || ''}
              style={{
                width: '100%',
                padding: '6px 8px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '13px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '3px', fontSize: '12px', color: '#6b7280' }}>Longitude</label>
            <input
              type="number"
              step="any"
              placeholder="e.g., 72.8777"
              defaultValue={location.lng || ''}
              style={{
                width: '100%',
                padding: '6px 8px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '13px'
              }}
            />
          </div>
          <button
            onClick={(e) => {
              const inputs = e.target.parentElement.querySelectorAll('input')
              const lat = parseFloat(inputs[0].value)
              const lng = parseFloat(inputs[1].value)
              
              if (lat && lng) {
                const newLocation = { lat, lng, address: `${lat.toFixed(6)}, ${lng.toFixed(6)}` }
                setLocation(newLocation)
                onLocationSelect(newLocation)
              }
            }}
            style={{
              padding: '6px 12px',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Set
          </button>
        </div>
      </div>
    </div>
  )
}