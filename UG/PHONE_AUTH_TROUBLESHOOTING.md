# Firebase Phone Authentication Troubleshooting

## 🚨 "Error updating phone message during save for phone provider"

### Solution 1: SMS Template Format
1. Go to Firebase Console → Authentication → Settings
2. Click on "SMS templates" tab
3. Use this exact template:
   ```
   Your UrbanGenie verification code is %LOGIN_CODE%
   ```
4. Ensure:
   - Message contains `%LOGIN_CODE%` placeholder
   - Total message length < 160 characters
   - No special characters that might break SMS
5. Click "Save"

### Solution 2: Check Project Billing
1. Go to Firebase Console → Project Settings → Usage and billing
2. Ensure project has billing enabled (required for SMS)
3. Phone auth requires Blaze plan for production

### Solution 3: Regional Settings
1. Go to Authentication → Settings → SMS
2. Check if your region supports SMS
3. Some regions have restrictions on SMS delivery

## 🔧 Additional Phone Auth Setup

### Enable Test Phone Numbers (Development)
```javascript
// Add to Firebase Console → Authentication → Sign-in method → Phone
Test phone numbers:
+91 9876543210 → 123456
+1 5555551234 → 654321
```

### Update reCAPTCHA Settings
1. Go to Authentication → Settings
2. Enable "Enforce reCAPTCHA flow"
3. Add your domains to reCAPTCHA console

### Authorized Domains
Add these domains in Authentication → Settings → Authorized domains:
- `localhost`
- `127.0.0.1`
- `localhost:5173` (Vite dev server)
- `your-production-domain.com`

## 🐛 Common Errors & Fixes

### Error: "reCAPTCHA container not found"
```javascript
// Ensure this div exists in your HTML
<div id="recaptcha-container"></div>
```

### Error: "Invalid phone number"
```javascript
// Ensure phone number format is correct
const phoneNumber = `+91${phoneNumber}`; // Include country code
```

### Error: "SMS quota exceeded"
- Check Firebase Console → Usage
- Upgrade to Blaze plan if needed
- Use test phone numbers for development

### Error: "Domain not authorized"
1. Add domain to Firebase Console
2. Wait 5-10 minutes for propagation
3. Clear browser cache

## ✅ Testing Checklist

- [ ] SMS template saved successfully
- [ ] Billing enabled (for production)
- [ ] Test phone numbers added
- [ ] Authorized domains configured
- [ ] reCAPTCHA container exists
- [ ] Phone number format correct (+91xxxxxxxxxx)
- [ ] Browser console shows no errors

## 📱 Test Phone Numbers for Development

Use these in Firebase Console for testing without SMS:
```
+91 9876543210 → 123456
+91 8765432109 → 654321
+1 5555551234 → 123456
```

## 🚀 Production Deployment

1. Remove test phone numbers
2. Enable SMS for real phone numbers
3. Monitor SMS usage in Firebase Console
4. Set up SMS spending limits