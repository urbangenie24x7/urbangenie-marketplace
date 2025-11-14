# FreshCuts Marketplace Deployment Guide

## 🚀 Quick Deploy to Vercel

### 1. Prerequisites
- GitHub repository (✅ Already done)
- Vercel account (free)
- Firebase project setup
- Payment gateway accounts

### 2. One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/urbangenie24x7/urbangenie-marketplace&project-name=freshcuts-marketplace&repository-name=freshcuts-marketplace)

### 3. Manual Deployment Steps

#### Step 1: Connect Repository
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
cd apps/next-web/freshcuts
vercel
```

#### Step 2: Environment Variables
Set these in Vercel Dashboard → Project → Settings → Environment Variables:

**Firebase:**
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

**Payment Gateway:**
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`

**SMS Service:**
- `SMS_API_KEY`
- `SMS_SENDER_ID`

**Google Maps:**
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

**Cloudinary:**
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

#### Step 3: Domain Setup
1. Add custom domain in Vercel
2. Update DNS records
3. SSL automatically configured

## 🏗️ Alternative Deployment Options

### Option 1: Netlify
```bash
# Build command
npm run build

# Publish directory
out/

# Environment variables
# Same as Vercel setup
```

### Option 2: Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway link
railway up
```

### Option 3: DigitalOcean App Platform
- Connect GitHub repository
- Auto-detect Next.js
- Set environment variables
- Deploy with one click

## 📱 Mobile App Deployment

### React Native (Expo)
```bash
cd apps/mobile
expo build:android
expo build:ios
```

## 🔧 Production Checklist

### Security
- [ ] Firebase security rules deployed
- [ ] API keys secured in environment variables
- [ ] HTTPS enabled
- [ ] CORS configured

### Performance
- [ ] Images optimized (Cloudinary)
- [ ] CDN configured (Vercel Edge)
- [ ] Database indexes created
- [ ] Caching enabled

### Monitoring
- [ ] Error tracking (Vercel Analytics)
- [ ] Performance monitoring
- [ ] Uptime monitoring
- [ ] Firebase monitoring enabled

### Business
- [ ] Payment gateway in live mode
- [ ] SMS service activated
- [ ] Google Maps billing enabled
- [ ] Domain configured

## 🚦 Deployment Environments

### Development
- **URL**: `localhost:3000`
- **Database**: Firebase (dev project)
- **Payments**: Test mode

### Staging
- **URL**: `freshcuts-staging.vercel.app`
- **Database**: Firebase (staging project)
- **Payments**: Test mode

### Production
- **URL**: `urbangenie24x7.com`
- **Database**: Firebase (production project)
- **Payments**: Live mode

## 🔄 CI/CD Pipeline

### Automatic Deployment
- **Trigger**: Push to `master` branch
- **Build**: Vercel automatically builds
- **Deploy**: Zero-downtime deployment
- **Rollback**: One-click rollback available

### Branch Deployments
- **Feature branches**: Preview deployments
- **Pull requests**: Automatic preview URLs
- **Testing**: Deploy previews for QA

## 📊 Post-Deployment

### 1. Verify Functionality
- [ ] User registration/login
- [ ] Product browsing
- [ ] Cart functionality
- [ ] Payment processing
- [ ] Order management
- [ ] Admin dashboard
- [ ] Vendor dashboard

### 2. Performance Testing
- [ ] Page load speeds
- [ ] API response times
- [ ] Mobile responsiveness
- [ ] Cross-browser testing

### 3. Go Live
- [ ] DNS propagation complete
- [ ] SSL certificate active
- [ ] All integrations working
- [ ] Monitoring alerts configured

## 🆘 Troubleshooting

### Common Issues
1. **Build Failures**: Check environment variables
2. **API Errors**: Verify Firebase configuration
3. **Payment Issues**: Check Razorpay keys
4. **SMS Not Working**: Verify SMS service setup

### Support
- Vercel Documentation: https://vercel.com/docs
- Firebase Console: https://console.firebase.google.com
- GitHub Issues: Create issue in repository