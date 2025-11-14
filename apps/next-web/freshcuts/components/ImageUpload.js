import { useState } from 'react'
import { uploadToCloudinary, convertToBase64 } from '../lib/cloudinary'

export default function ImageUpload({ onImageUpload, currentImage }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentImage || '')
  const [error, setError] = useState('')

  const validateFile = (file) => {
    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    
    if (file.size > maxSize) {
      return 'File size must be less than 5MB'
    }
    
    if (!allowedTypes.includes(file.type)) {
      return 'Only JPEG, PNG, and WebP images are allowed'
    }
    
    return null
  }

  const handleFileSelect = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setError('')
    
    // Validate file
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    // Show preview
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(file)

    // Upload to Cloudinary with base64 fallback
    setUploading(true)
    try {
      const imageUrl = await uploadToCloudinary(file)
      onImageUpload(imageUrl)
      setError('')
    } catch (error) {
      console.warn('Cloudinary upload failed, using base64 fallback:', error)
      try {
        const base64Url = await convertToBase64(file)
        onImageUpload(base64Url)
        setError('')
        console.log('Image uploaded successfully using fallback method')
      } catch (base64Error) {
        setError('Failed to process image. Please try again.')
        setPreview(currentImage || '')
      }
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ marginBottom: '15px' }}>
      <label style={{ display: 'block', marginBottom: '5px' }}>Category Image:</label>
      
      {preview && (
        <div style={{ marginBottom: '10px', position: 'relative', display: 'inline-block' }}>
          <img 
            src={preview} 
            alt="Preview" 
            style={{ 
              width: '100px', 
              height: '100px', 
              objectFit: 'cover', 
              borderRadius: '8px',
              border: '1px solid #d1d5db'
            }} 
          />
          <button
            type="button"
            onClick={() => {
              setPreview('')
              onImageUpload('')
              setError('')
            }}
            style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold'
            }}
          >
            ×
          </button>
        </div>
      )}
      
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={uploading}
        style={{ 
          width: '100%', 
          padding: '8px', 
          border: '1px solid #d1d5db', 
          borderRadius: '4px',
          backgroundColor: uploading ? '#f3f4f6' : 'white'
        }}
      />
      
      {uploading && (
        <p style={{ color: '#3b82f6', fontSize: '14px', margin: '5px 0 0 0' }}>
          Uploading image...
        </p>
      )}
      
      {error && (
        <p style={{ color: '#ef4444', fontSize: '14px', margin: '5px 0 0 0' }}>
          {error}
        </p>
      )}
    </div>
  )
}