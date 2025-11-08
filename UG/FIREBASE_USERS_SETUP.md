# Firebase Authentication Users Setup

## Problem
Firebase Authentication users cannot be created from the frontend. You need to create them manually or use Firebase Admin SDK.

## Solution Options

### Option 1: Manual Creation (Recommended for Testing)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `urbangenie24x7`
3. Go to Authentication > Users
4. Click "Add user" and create these test users:

**Admin Users:**
- Email: `admin@urbangenie.com` | Password: `Admin123!`
- Email: `manager@urbangenie.com` | Password: `Manager123!`

**Vendor Users:**
- Email: `rajesh.plumber@gmail.com` | Password: `Vendor123!`
- Email: `priya.cleaner@gmail.com` | Password: `Vendor123!`
- Email: `mohammed.ac@gmail.com` | Password: `Vendor123!`

**Customer Users:**
- Email: `anita.customer@gmail.com` | Password: `Customer123!`
- Email: `vikram.customer@gmail.com` | Password: `Customer123!`
- Email: `sarah.customer@gmail.com` | Password: `Customer123!`
- Email: `amit.customer@gmail.com` | Password: `Customer123!`

### Option 2: Automated Creation (Backend Required)

1. **Install Firebase Admin SDK:**
   ```bash
   npm install firebase-admin
   ```

2. **Download Service Account Key:**
   - Go to Firebase Console > Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save as `src/utils/serviceAccountKey.json`

3. **Run the creation script:**
   ```bash
   node src/utils/createFirebaseUsers.js
   ```

### Option 3: Enable Phone Authentication

1. Go to Firebase Console > Authentication > Sign-in method
2. Enable "Phone" provider
3. Add your domain to authorized domains if needed

## Current Login Methods

### Phone Authentication
- Use any phone number from the test data
- OTP: `123456` (in development mode)

### Email/Password Authentication  
- Use the emails and passwords listed above
- Username lookup is supported (searches Firestore for username)

### Google Authentication
- Enabled automatically when users sign in with Google
- No additional setup required

## Testing the Login

1. Go to `/login` in your app
2. Try different authentication methods:
   - **Phone Tab**: Use `+919876543210` with OTP `123456`
   - **Username Tab**: Use `admin@urbangenie.com` with password `Admin123!`
   - **Google Tab**: Sign in with any Google account

## Troubleshooting

**"No users in Firebase Authentication"**
- Users must be created manually in Firebase Console or via Admin SDK
- Frontend cannot create Firebase Auth users directly

**"Invalid credentials"**
- Make sure you created the users in Firebase Console first
- Check that email and password match exactly

**"Phone authentication not working"**
- Enable Phone provider in Firebase Console
- Add your domain to authorized domains

**"Google sign-in not working"**
- Google provider is enabled by default
- Make sure your domain is authorized in Firebase Console