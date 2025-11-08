# UrbanGenie Firebase - Quick Start

## 🚀 Development Setup

1. **Copy environment variables:**
   ```bash
   cp .env.example .env
   ```

2. **Update Firebase config in `.env`:**
   - Get config from Firebase Console → Project Settings
   - Replace placeholder values

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

## 🔥 Firebase Commands

```bash
# Login to Firebase
firebase login

# Initialize Firebase project
firebase init

# Start emulators (optional)
firebase emulators:start

# Deploy to Firebase
npm run firebase:deploy

# Seed Firestore data
npm run seed:firestore
```

## 📱 Test Features

1. **Phone Authentication:**
   - Go to `/login`
   - Enter phone number
   - Verify OTP

2. **Browse Services:**
   - Go to `/services`
   - Search and filter services

3. **Cart Functionality:**
   - Add services to cart
   - View cart items
   - Proceed to checkout

4. **Real-time Updates:**
   - Cart syncs across tabs
   - Order status updates live

## 🛠️ Development Tools

- **Firebase Console:** Monitor data and users
- **Emulator UI:** Test locally at http://localhost:4000
- **Network Tab:** Check Firebase API calls
- **Console Logs:** Debug Firebase operations

## 🚨 Troubleshooting

**Firebase not connecting:**
- Check environment variables
- Verify project ID
- Check network connectivity

**Authentication errors:**
- Enable Phone auth in Firebase Console
- Add domain to authorized domains
- Check reCAPTCHA setup

**Firestore permission errors:**
- Deploy security rules
- Check user authentication
- Verify document structure