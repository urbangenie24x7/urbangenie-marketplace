# Firebase Emulator Setup for UrbanGenie

## Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

## Step 2: Login to Firebase

```bash
firebase login
```

## Step 3: Initialize Firebase Project

```bash
firebase init
```

Select:
- [x] Firestore
- [x] Authentication  
- [x] Storage
- [x] Emulators

Configuration:
- **Firestore Rules**: `firestore.rules` (default)
- **Firestore Indexes**: `firestore.indexes.json` (default)
- **Storage Rules**: `storage.rules` (default)
- **Emulators**: Select Authentication, Firestore, Storage
- **Ports**: Use defaults (Auth: 9099, Firestore: 8080, Storage: 9199)

## Step 4: Update Environment Variables

```env
# Firebase Emulator Configuration
VITE_FIREBASE_API_KEY=demo-api-key
VITE_FIREBASE_AUTH_DOMAIN=demo-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=demo-urbangenie
VITE_FIREBASE_STORAGE_BUCKET=demo-urbangenie.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:demo
VITE_USE_EMULATORS=true
```

## Step 5: Start Emulators

```bash
firebase emulators:start
```

## Step 6: Seed Data

```bash
npm run seed:firestore
```

## Step 7: Test Application

1. Start dev server: `npm run dev`
2. Go to `/admin/services`
3. Test adding services with dropdowns