# Cloudinary Setup Guide

## Quick Setup (5 minutes)

1. **Create Cloudinary Account**: Go to https://cloudinary.com/users/register/free

2. **Get Your Cloud Name**: 
   - After signup, go to Dashboard
   - Copy your "Cloud name" (e.g., `dxyz123abc`)

3. **Create Upload Preset**:
   - Go to Settings > Upload
   - Click "Add upload preset"
   - Set Signing Mode to "Unsigned"
   - Set Preset name to `freshcuts_preset`
   - Save

4. **Configure Environment**:
   ```bash
   # Create .env.local file
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name-here
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=freshcuts_preset
   ```

5. **Test Upload**: Try uploading an image in the admin panel

## Fallback Mode
If Cloudinary is not configured, images will be stored as base64 data URLs (works locally but not recommended for production).