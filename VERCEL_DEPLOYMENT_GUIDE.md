# 🚀 Vercel Deployment Guide for Auth0 ACUL

This guide walks you through deploying your Auth0 ACUL (Advanced Customization of Universal Login) pages to Vercel for both development and production use.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Step-by-Step Deployment](#step-by-step-deployment)
4. [Custom Domain Setup](#custom-domain-setup)
5. [Environment Configuration](#environment-configuration)
6. [Testing Your Deployment](#testing-your-deployment)
7. [Troubleshooting](#troubleshooting)

---

## ✅ Prerequisites

- ✅ Vercel account (you have this!)
- ✅ Node.js 18+ installed
- ✅ Git repository with your ACUL code
- ✅ Auth0 account with applications configured

---

## ⚡ Quick Start

### **Option 1: Automated Deployment (Recommended)**

```bash
# Navigate to your frontend directory
cd frontend

# Run the automated deployment script
npm run deploy
```

This script will:
- Check prerequisites
- Deploy to Vercel
- Display Auth0 configuration URLs
- Optionally set up custom domains

### **Option 2: Manual Deployment**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from frontend directory
cd frontend
vercel --prod
```

---

## 🔧 Step-by-Step Deployment

### **Step 1: Prepare Your Environment**

1. **Navigate to your frontend directory:**
   ```bash
   cd frontend
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env.local
   # Or create manually if .env.example doesn't exist
   ```

3. **Update `.env.local` with your Auth0 credentials:**
   ```bash
   # Auth0 Configuration
   NEXT_PUBLIC_AUTH0_DOMAIN=your-tenant.auth0.com
   NEXT_PUBLIC_AUTH0_AUDIENCE=https://api.auracommerce.com

   # Brand-specific configurations
   NEXT_PUBLIC_LUXELOOM_DOMAIN=luxeloom.auth0.com
   NEXT_PUBLIC_LUXELOOM_CLIENT_ID=your_luxeloom_client_id
   NEXT_PUBLIC_URBANMARKET_DOMAIN=urbanmarket.auth0.com
   NEXT_PUBLIC_URBANMARKET_CLIENT_ID=your_urbanmarket_client_id
   NEXT_PUBLIC_AURA_WHOLESALE_DOMAIN=aura-wholesale.auth0.com
   NEXT_PUBLIC_AURA_WHOLESALE_CLIENT_ID=your_aura_wholesale_client_id

   # API Configuration
   NEXT_PUBLIC_API_URL=https://your-api-domain.com
   ```

### **Step 2: Deploy to Vercel**

1. **Install Vercel CLI (if not already installed):**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy your project:**
   ```bash
   vercel --prod
   ```

4. **Follow the prompts:**
   - Set up and deploy: `Y`
   - Which scope: Select your account
   - Link to existing project: `N`
   - Project name: `aura-commerce-acul` (or your preferred name)
   - Directory: `./` (current directory)
   - Override settings: `N`

### **Step 3: Get Your Deployment URL**

After deployment, Vercel will provide a URL like:
```
✅ Production: https://aura-commerce-acul.vercel.app
```

### **Step 4: Configure Auth0**

Update your Auth0 Dashboard with the deployment URL:

#### **For Development/Testing:**
```
Allowed Callback URLs: https://aura-commerce-acul.vercel.app/callback
Allowed Logout URLs: https://aura-commerce-acul.vercel.app
Allowed Web Origins: https://aura-commerce-acul.vercel.app
```

#### **For Production (with custom domains):**
```
LuxeLoom:
  Allowed Callback URLs: https://www.luxeloom.com/callback
  Allowed Logout URLs: https://www.luxeloom.com
  Allowed Web Origins: https://www.luxeloom.com

UrbanMarket:
  Allowed Callback URLs: https://www.urbanmarket.com/callback
  Allowed Logout URLs: https://www.urbanmarket.com
  Allowed Web Origins: https://www.urbanmarket.com

Aura Wholesale:
  Allowed Callback URLs: https://b2b.auracommerce.com/callback
  Allowed Logout URLs: https://b2b.auracommerce.com
  Allowed Web Origins: https://b2b.auracommerce.com
```

---

## 🌐 Custom Domain Setup

### **Step 1: Add Custom Domains to Vercel**

```bash
# Add domains for each brand
vercel domains add www.luxeloom.com
vercel domains add www.urbanmarket.com
vercel domains add b2b.auracommerce.com
```

### **Step 2: Configure DNS Records**

Add the following DNS records to your domain registrar:

#### **For www.luxeloom.com:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

#### **For www.urbanmarket.com:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

#### **For b2b.auracommerce.com:**
```
Type: CNAME
Name: b2b
Value: cname.vercel-dns.com
```

### **Step 3: Verify Domain Configuration**

1. **Check domain status in Vercel Dashboard:**
   - Go to https://vercel.com/dashboard
   - Select your project
   - Go to "Domains" tab
   - Verify domains are configured correctly

2. **Test domain accessibility:**
   ```bash
   curl -I https://www.luxeloom.com/login
   curl -I https://www.urbanmarket.com/login
   curl -I https://b2b.auracommerce.com/login
   ```

---

## ⚙️ Environment Configuration

### **Vercel Environment Variables**

Set up environment variables in Vercel Dashboard:

1. **Go to Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Select your project
   - Go to "Settings" → "Environment Variables"

2. **Add the following variables:**

#### **Production Environment:**
```
NEXT_PUBLIC_AUTH0_DOMAIN=your-prod-tenant.auth0.com
NEXT_PUBLIC_LUXELOOM_CLIENT_ID=your_prod_luxeloom_client_id
NEXT_PUBLIC_URBANMARKET_CLIENT_ID=your_prod_urbanmarket_client_id
NEXT_PUBLIC_AURA_WHOLESALE_CLIENT_ID=your_prod_aura_wholesale_client_id
NEXT_PUBLIC_API_URL=https://your-prod-api-domain.com
```

#### **Preview Environment (for testing):**
```
NEXT_PUBLIC_AUTH0_DOMAIN=your-dev-tenant.auth0.com
NEXT_PUBLIC_LUXELOOM_CLIENT_ID=your_dev_luxeloom_client_id
NEXT_PUBLIC_URBANMARKET_CLIENT_ID=your_dev_urbanmarket_client_id
NEXT_PUBLIC_AURA_WHOLESALE_CLIENT_ID=your_dev_aura_wholesale_client_id
NEXT_PUBLIC_API_URL=https://your-dev-api-domain.com
```

### **Using Vercel CLI for Environment Variables**

```bash
# Set production environment variables
vercel env add NEXT_PUBLIC_AUTH0_DOMAIN production
vercel env add NEXT_PUBLIC_LUXELOOM_CLIENT_ID production
vercel env add NEXT_PUBLIC_URBANMARKET_CLIENT_ID production
vercel env add NEXT_PUBLIC_AURA_WHOLESALE_CLIENT_ID production

# Set preview environment variables
vercel env add NEXT_PUBLIC_AUTH0_DOMAIN preview
vercel env add NEXT_PUBLIC_LUXELOOM_CLIENT_ID preview
vercel env add NEXT_PUBLIC_URBANMARKET_CLIENT_ID preview
vercel env add NEXT_PUBLIC_AURA_WHOLESALE_CLIENT_ID preview
```

---

## 🧪 Testing Your Deployment

### **1. Test Page Accessibility**

```bash
# Test with curl
curl -I https://your-domain.vercel.app/login
curl -I https://your-domain.vercel.app/callback
curl -I https://your-domain.vercel.app/logout
```

Expected response: `HTTP/2 200`

### **2. Test Authentication Flow**

1. **Navigate to your login page:**
   ```
   https://your-domain.vercel.app/login
   ```

2. **Click "Sign In" button**
3. **Complete Auth0 authentication**
4. **Verify redirect to callback page**
5. **Check localStorage for user data**

### **3. Test Brand-Specific URLs**

Test each brand domain:
- `https://www.luxeloom.com/login`
- `https://www.urbanmarket.com/login`
- `https://b2b.auracommerce.com/login`

### **4. Test Error Handling**

```bash
# Test invalid callback
curl "https://your-domain.vercel.app/callback?error=access_denied"

# Test missing parameters
curl "https://your-domain.vercel.app/callback"
```

### **5. Browser Testing**

Test across different browsers:
- Chrome
- Firefox
- Safari
- Edge

### **6. Mobile Testing**

Test on mobile devices:
- iOS Safari
- Android Chrome
- Responsive design

---

## 🔍 Troubleshooting

### **Common Issues:**

#### **1. "Invalid redirect_uri" Error**

**Cause:** Mismatch between configured and actual redirect URIs

**Solution:**
- Check Auth0 Dashboard configuration
- Verify protocol (http/https) matches
- Ensure no trailing slashes
- Check for typos in URLs

#### **2. "Page not found" Error**

**Cause:** ACUL pages not accessible

**Solution:**
- Check Vercel deployment status
- Verify `vercel.json` configuration
- Check build logs in Vercel Dashboard
- Ensure static files are in `public/` directory

#### **3. "CORS Error" in Browser**

**Cause:** Cross-origin request blocked

**Solution:**
- Add domain to Auth0 Web Origins
- Check Content Security Policy in `vercel.json`
- Verify HTTPS for production

#### **4. "Environment variables not working"**

**Cause:** Environment variables not configured

**Solution:**
- Check Vercel Dashboard environment variables
- Verify variable names match code
- Redeploy after adding variables

#### **5. "Custom domain not working"**

**Cause:** DNS configuration issues

**Solution:**
- Check DNS records in domain registrar
- Verify domain configuration in Vercel
- Wait for DNS propagation (up to 48 hours)

### **Debug Mode:**

Enable debug logging in your ACUL pages:

```javascript
// Add to login.html, callback.html, logout.html
const DEBUG = true;

function log(message, data) {
  if (DEBUG) {
    console.log(`[ACUL] ${message}`, data);
  }
}
```

### **Vercel Logs:**

Check deployment and function logs:

```bash
# View deployment logs
vercel logs

# View function logs
vercel logs --function=app/api/auth/callback/route.ts
```

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Auth0 Universal Login](https://auth0.com/docs/authenticate/login/universal-login)
- [Auth0 Custom Domains](https://auth0.com/docs/customize/universal-login-pages/configure-custom-domains)

---

## 🎯 Quick Commands Reference

### **Deployment:**
```bash
# Automated deployment
npm run deploy

# Manual deployment
vercel --prod

# Deploy to preview
vercel
```

### **Domain Management:**
```bash
# Add custom domain
vercel domains add your-domain.com

# List domains
vercel domains ls

# Remove domain
vercel domains rm your-domain.com
```

### **Environment Variables:**
```bash
# Add environment variable
vercel env add VARIABLE_NAME production

# List environment variables
vercel env ls

# Remove environment variable
vercel env rm VARIABLE_NAME production
```

### **Logs and Debugging:**
```bash
# View logs
vercel logs

# View function logs
vercel logs --function=function-name

# Open Vercel Dashboard
vercel open
```

---

## 🎉 Success Checklist

- [ ] **Deployment successful** - Vercel shows green status
- [ ] **Pages accessible** - All ACUL pages return 200 status
- [ ] **Auth0 configured** - URLs added to Auth0 Dashboard
- [ ] **Authentication working** - Login/logout flow successful
- [ ] **Custom domains configured** - Brand domains working (if applicable)
- [ ] **Environment variables set** - All required variables configured
- [ ] **Security headers working** - CSP and other headers applied
- [ ] **Mobile responsive** - Pages work on mobile devices
- [ ] **Error handling tested** - Various error scenarios handled
- [ ] **Monitoring set up** - Analytics and error tracking configured

---

*Your Auth0 ACUL pages are now successfully deployed to Vercel! The deployment provides excellent performance, automatic scaling, and global CDN distribution for your authentication pages.*
