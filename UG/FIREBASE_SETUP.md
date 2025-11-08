# Firebase Integration Guide for UrbanGenie

## 🔥 Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Project name: `urbangenie`
4. Enable Google Analytics (recommended)
5. Create project

## 🔥 Step 2: Enable Billing (Required)

**⚠️ IMPORTANT:** Firebase requires Blaze plan for Firestore and SMS

1. **Go to Firebase Console** → Project Settings → Usage and billing
2. **Click "Modify plan"**
3. **Select "Blaze Plan"** (Pay as you go)
4. **Add payment method** (credit/debit card)
5. **Confirm upgrade**
6. **Wait 2-3 minutes** for activation

**💰 Cost:** $0-5/month for development (includes generous free tier)

## 🔥 Step 3: Enable Required Services

### Authentication
1. Go to Authentication → Sign-in method
2. Enable "Phone" provider:
   - Click on "Phone" in the sign-in providers list
   - Toggle "Enable" to ON
   - **SMS Message Template (IMPORTANT):**
     - Use default template: "Your verification code is %LOGIN_CODE%"
     - Or custom: "UrbanGenie verification code: %LOGIN_CODE%"
   - **Test Phone Numbers (Optional):**
     - Add test numbers for development: +91 9876543210 → 123456
   - Click "Save"
3. Add your domain to authorized domains:
   - Scroll to "Authorized domains"
   - Add: `localhost`, `127.0.0.1`, `your-domain.com`
   - Click "Add domain"

### Firestore Database
1. Go to Firestore Database
2. Click "Create database"
3. Start in "test mode" (we'll add security rules later)
4. Choose location (closest to your users)

### Storage
1. Go to Storage
2. Click "Get started"
3. Start in test mode

## 🔥 Step 4: Get Firebase Config

1. Go to Project Settings (gear icon)
2. Scroll to "Your apps"
3. Click "Web app" icon (</>)
4. Register app name: "UrbanGenie Web"
5. Copy the config object

## 🔥 Step 5: Update Environment Variables

Replace the values in `.env` with your Firebase config:

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

## 🔥 Step 6: Deploy Security Rules

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init firestore`
4. Deploy rules: `firebase deploy --only firestore:rules`

## 🔥 Step 7: Seed Initial Data

Run the seeding script:
```bash
npm run seed:firestore
```

## 🔥 Step 8: Fix Phone Auth Issues

### Common Phone Auth Errors:

**"Error updating phone message":**
1. Go to Authentication → Settings → SMS template
2. Use this template: `Your UrbanGenie code is %LOGIN_CODE%`
3. Ensure message is under 160 characters
4. Save changes

**"reCAPTCHA not working":**
1. Add reCAPTCHA site key in Authentication settings
2. Add your domain to reCAPTCHA console
3. Ensure reCAPTCHA container exists in DOM

**"Domain not authorized":**
1. Add `localhost:5173` to authorized domains
2. Add `127.0.0.1:5173` for local testing
3. Add your production domain

## 🔥 Step 9: Test the Application

1. Start development server: `npm run dev`
2. Test phone authentication at `/login`
3. Check browser console for errors
4. Test with a real phone number
5. Test service browsing
6. Test cart functionality

## 🔥 Step 10: Deploy to Firebase Hosting

```bash
npm run build
firebase init hosting
firebase deploy
```

## 🚀 Production Checklist

- [ ] Firebase project created
- [ ] Authentication enabled (Phone)
- [ ] Firestore database created
- [ ] Storage enabled
- [ ] Environment variables updated
- [ ] Security rules deployed
- [ ] Initial data seeded
- [ ] Application tested
- [ ] Deployed to Firebase Hosting

## 📱 Mobile App Integration (Future)

Firebase is ready for mobile app development:
- iOS SDK available
- Android SDK available
- Push notifications ready
- Offline sync enabled