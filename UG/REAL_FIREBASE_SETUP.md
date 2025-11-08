# Real Firebase Setup for UrbanGenie

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
3. Project name: `urbangenie-prod` (or your preferred name)
4. **Enable Google Analytics** (recommended)
5. Click **"Create project"**

## Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Click on **"Phone"** provider
3. Toggle **"Enable"** to ON
4. **SMS Message Template**: `Your UrbanGenie verification code is %LOGIN_CODE%`
5. **Test Phone Numbers** (optional for development):
   - Phone: `+91 9876543210` → Code: `123456`
6. **Authorized Domains**: Add `localhost` and your domain
7. Click **"Save"**

## Step 3: Enable Firestore Database

1. Go to **Firestore Database**
2. Click **"Create database"**
3. **Start in test mode** (we'll add security rules later)
4. **Choose location**: `asia-south1` (Mumbai) or closest to your users
5. Click **"Done"**

## Step 4: Enable Storage

1. Go to **Storage**
2. Click **"Get started"**
3. **Start in test mode**
4. **Choose location**: Same as Firestore
5. Click **"Done"**

## Step 5: Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll to **"Your apps"** section
3. Click **Web app icon** (`</>`)
4. **App nickname**: `UrbanGenie Web`
5. **Enable Firebase Hosting** (optional)
6. Click **"Register app"**
7. **Copy the config object** - it looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "urbangenie-prod.firebaseapp.com",
  projectId: "urbangenie-prod",
  storageBucket: "urbangenie-prod.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789012345678"
};
```

## Step 6: Update Environment Variables

Replace your `.env` file with the real Firebase config:

```env
# Real Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=urbangenie-prod.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=urbangenie-prod
VITE_FIREBASE_STORAGE_BUCKET=urbangenie-prod.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456789012345678
VITE_USE_EMULATORS=false
```

## Step 7: Seed Initial Data

Run these commands to add sample data:

```bash
# Seed categories and services
npm run seed:firestore
npm run seed:services
```

## Step 8: Test the Setup

1. **Restart your dev server**: `npm run dev`
2. **Test phone authentication**: Go to `/login`
3. **Test admin panel**: Go to `/admin/services`
4. **Add a new service** using the dropdown selects

## Step 9: Security Rules (Production)

Update Firestore security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to categories and services
    match /categories/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /services/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // User data - only authenticated users can access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Orders - only authenticated users can access their own orders
    match /orders/{document} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.user_id;
    }
  }
}
```

## Step 10: Enable Billing (Required for Production)

1. Go to **Project Settings** → **Usage and billing**
2. Click **"Modify plan"**
3. Select **"Blaze Plan"** (Pay as you go)
4. Add payment method
5. **Cost**: Usually $0-10/month for small apps

## Troubleshooting

**If you get authentication errors:**
- Check that Phone authentication is enabled
- Verify authorized domains include `localhost`
- Ensure reCAPTCHA is working

**If Firestore connection fails:**
- Verify project ID in `.env` matches Firebase Console
- Check that Firestore is enabled in test mode
- Restart your development server

**If you see "Permission denied" errors:**
- Update Firestore security rules as shown above
- Ensure user is authenticated before accessing protected data

## Production Deployment

When ready for production:
1. Update security rules to be more restrictive
2. Enable Firebase Hosting: `firebase init hosting`
3. Deploy: `npm run build && firebase deploy`
4. Update authorized domains to include your production domain