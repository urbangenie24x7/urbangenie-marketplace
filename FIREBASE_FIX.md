# Firebase Authentication API Error Fix

## Error
```
GET https://www.googleapis.com/identitytoolkit/v3/relyingparty/getProjectConfig?key=... 403 (Forbidden)
Requests to this API identitytoolkit method are blocked.
```

## Solution Steps

### 1. Enable Identity Toolkit API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project: `freshcuts-5cb4c`
3. Go to **APIs & Services** > **Library**
4. Search for "Identity Toolkit API"
5. Click **Enable**

### 2. Check API Key Restrictions
1. Go to **APIs & Services** > **Credentials**
2. Find your API key: `AIzaSyAR757jp5A9sKg45vqZckfwTCLSLC-PRGk`
3. Click **Edit**
4. Under **API restrictions**:
   - Select "Don't restrict key" (for development)
   - OR add "Identity Toolkit API" to allowed APIs

### 3. Alternative: Create New Unrestricted Key
1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **API Key**
3. Copy the new key
4. Update `.env.local` with new key

### 4. Firebase Console Check
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select `freshcuts-5cb4c` project
3. Go to **Authentication** > **Sign-in method**
4. Ensure Phone authentication is enabled

## Quick Fix
Replace the API key in `.env.local` with an unrestricted one from Google Cloud Console.