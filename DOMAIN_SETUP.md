# Domain Setup for UrbanGenie24x7.com

## 🌐 **Current Domain Configuration**

### **Primary Domain**: `urbangenie24x7.com`
- **Registrar**: Your current domain provider
- **DNS Management**: Update DNS records
- **SSL**: Auto-configured by Vercel

## 🚀 **Deployment Strategy**

### **Option 1: Subdomain Approach (Recommended)**
```
urbangenie24x7.com           → Main landing page
freshcuts.urbangenie24x7.com → FreshCuts marketplace
grocery.urbangenie24x7.com   → Grocery vertical (future)
health.urbangenie24x7.com    → Health vertical (future)
services.urbangenie24x7.com  → Services vertical (future)
```

### **Option 2: Path-Based Approach**
```
urbangenie24x7.com/freshcuts → FreshCuts marketplace
urbangenie24x7.com/grocery   → Grocery vertical
urbangenie24x7.com/health    → Health vertical
urbangenie24x7.com/services  → Services vertical
```

## 🔧 **DNS Configuration**

### **For Subdomain Approach:**
```dns
# Add these CNAME records to your DNS
freshcuts.urbangenie24x7.com → CNAME → cname.vercel-dns.com
```

### **For Main Domain:**
```dns
# Add these A records to your DNS
urbangenie24x7.com → A → 76.76.19.61
www.urbangenie24x7.com → CNAME → cname.vercel-dns.com
```

## 📋 **Setup Steps**

### **Step 1: Vercel Domain Setup**
1. Go to Vercel Dashboard → Project → Settings → Domains
2. Add domain: `freshcuts.urbangenie24x7.com` (or `urbangenie24x7.com`)
3. Copy the DNS configuration provided

### **Step 2: DNS Provider Setup**
1. Login to your domain registrar/DNS provider
2. Add the DNS records from Vercel
3. Wait for DNS propagation (24-48 hours)

### **Step 3: SSL Certificate**
- Vercel automatically provisions SSL certificates
- HTTPS will be enabled once DNS propagates
- Certificate auto-renews

## 🎯 **Recommended Implementation**

### **Phase 1: Launch FreshCuts**
```
freshcuts.urbangenie24x7.com → FreshCuts Marketplace
```

### **Phase 2: Add Main Landing**
```
urbangenie24x7.com → Multi-vertical landing page
├── /freshcuts → Redirect to freshcuts.urbangenie24x7.com
├── /grocery → Coming soon
├── /health → Coming soon
└── /services → Coming soon
```

### **Phase 3: Expand Verticals**
```
urbangenie24x7.com → Main hub
├── freshcuts.urbangenie24x7.com → Live
├── grocery.urbangenie24x7.com → Live
├── health.urbangenie24x7.com → Live
└── services.urbangenie24x7.com → Live
```

## 🚦 **Quick Deploy Commands**

```bash
# Deploy to subdomain
cd apps/next-web/freshcuts
vercel --prod
# Then add freshcuts.urbangenie24x7.com in Vercel dashboard

# Or deploy to main domain
vercel --prod
# Then add urbangenie24x7.com in Vercel dashboard
```

## 📊 **Benefits of This Approach**

### **Subdomain Benefits:**
- ✅ **Scalable** - Easy to add new verticals
- ✅ **Independent** - Each vertical can be deployed separately
- ✅ **SEO Friendly** - Clear vertical separation
- ✅ **Branding** - Consistent urbangenie24x7.com brand

### **Technical Benefits:**
- ✅ **Zero Downtime** - Deploy without affecting main site
- ✅ **Easy Rollbacks** - Revert individual verticals
- ✅ **Performance** - Optimized per vertical
- ✅ **Analytics** - Track each vertical separately

## 🔄 **Migration Plan**

### **Current State**: Repository ready
### **Target State**: `freshcuts.urbangenie24x7.com` live

### **Steps:**
1. **Deploy to Vercel** (5 minutes)
2. **Add subdomain** in Vercel dashboard (2 minutes)
3. **Update DNS** at your registrar (5 minutes)
4. **Wait for propagation** (24-48 hours)
5. **Test and go live** (30 minutes)

**Total Time**: ~1 hour setup + DNS propagation time