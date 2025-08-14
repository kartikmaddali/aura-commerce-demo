# 🌐 Auth0 ACUL Accessibility Guide

This guide explains how to make your Auth0 ACUL (Advanced Customization of Universal Login) pages accessible to Auth0 for proper authentication flows.

## 📋 Table of Contents

1. [Why Public URLs Are Required](#why-public-urls-are-required)
2. [Development Options](#development-options)
3. [Production Deployment](#production-deployment)
4. [Testing Your Setup](#testing-your-setup)
5. [Troubleshooting](#troubleshooting)

---

## 🔍 Why Public URLs Are Required

Auth0 needs to access your ACUL pages to:

- **Redirect users** to your custom login page after authentication
- **Handle callbacks** when users complete authentication
- **Process logout** requests securely
- **Validate** that your pages are accessible and properly configured

**Localhost (`http://localhost:3000`) is NOT accessible to Auth0** because:
- Auth0 servers cannot reach your local development machine
- CORS policies prevent cross-origin requests to localhost
- Security restrictions block external access to localhost

---

## 🚀 Development Options

### **Option 1: ngrok Tunnel (Recommended for Development)**

ngrok creates a secure tunnel to your local development server, making it accessible via a public URL.

#### **Setup ngrok:**

```bash
# Install ngrok globally
npm install -g ngrok

# Or download from https://ngrok.com/download
```

#### **Quick Start:**

```bash
# Navigate to your frontend directory
cd frontend

# Start development with tunnel
npm run dev:acul
```

This will:
1. Start your Next.js development server
2. Create an ngrok tunnel
3. Display the public URL for Auth0 configuration

#### **Manual ngrok Setup:**

```bash
# Terminal 1: Start your development server
cd frontend
npm run dev

# Terminal 2: Create tunnel
ngrok http 3000
```

#### **Auth0 Configuration with ngrok:**

When ngrok starts, you'll see a URL like: `https://abc123.ngrok.io`

Update your Auth0 Dashboard:

```
Allowed Callback URLs: https://abc123.ngrok.io/callback
Allowed Logout URLs: https://abc123.ngrok.io
Allowed Web Origins: https://abc123.ngrok.io
```

### **Option 2: GitHub Pages (Free Hosting)**

GitHub Pages provides free hosting for static sites, perfect for testing ACUL.

#### **Setup GitHub Pages:**

1. **Enable GitHub Pages** in your repository settings
2. **Push the workflow file** to trigger deployment
3. **Wait for deployment** to complete

#### **Deploy to GitHub Pages:**

```bash
# Push your changes to trigger deployment
git add .
git commit -m "Deploy ACUL pages to GitHub Pages"
git push origin main
```

#### **Auth0 Configuration with GitHub Pages:**

Your site will be available at: `https://yourusername.github.io/your-repo-name`

Update your Auth0 Dashboard:

```
Allowed Callback URLs: https://yourusername.github.io/your-repo-name/callback
Allowed Logout URLs: https://yourusername.github.io/your-repo-name
Allowed Web Origins: https://yourusername.github.io/your-repo-name
```

### **Option 3: Netlify (Free Tier)**

Netlify provides free hosting with automatic deployments.

#### **Setup Netlify:**

1. **Connect your GitHub repository** to Netlify
2. **Configure build settings:**
   - Build command: `npm run build`
   - Publish directory: `out`
3. **Deploy automatically** on push

#### **Auth0 Configuration with Netlify:**

Your site will be available at: `https://your-site-name.netlify.app`

Update your Auth0 Dashboard:

```
Allowed Callback URLs: https://your-site-name.netlify.app/callback
Allowed Logout URLs: https://your-site-name.netlify.app
Allowed Web Origins: https://your-site-name.netlify.app
```

---

## 🚀 Production Deployment

### **Option 1: Vercel (Recommended for Next.js)**

Vercel is optimized for Next.js applications and provides excellent performance.

#### **Deploy to Vercel:**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from frontend directory
cd frontend
vercel

# Follow the prompts to configure your project
```

#### **Custom Domains:**

```bash
# Add custom domains for each brand
vercel domains add www.luxeloom.com
vercel domains add www.urbanmarket.com
vercel domains add b2b.auracommerce.com
```

#### **Auth0 Configuration for Production:**

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

### **Option 2: AWS Amplify**

AWS Amplify provides scalable hosting with CI/CD integration.

#### **Deploy to Amplify:**

1. **Connect your repository** to AWS Amplify
2. **Configure build settings:**
   - Build command: `npm run build`
   - Output directory: `out`
3. **Deploy automatically** on push

### **Option 3: Google Cloud Run**

For containerized deployments with high scalability.

#### **Deploy to Cloud Run:**

```bash
# Build and deploy
gcloud run deploy acul-frontend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

---

## 🧪 Testing Your Setup

### **1. Verify Page Accessibility**

Test that your ACUL pages are accessible:

```bash
# Test with curl
curl -I https://your-domain.com/login
curl -I https://your-domain.com/callback
curl -I https://your-domain.com/logout
```

Expected response: `HTTP/2 200`

### **2. Test Authentication Flow**

1. **Navigate to your login page:**
   ```
   https://your-domain.com/login
   ```

2. **Click "Sign In" button**
3. **Complete Auth0 authentication**
4. **Verify redirect to callback page**
5. **Check localStorage for user data**

### **3. Test Error Handling**

Test various error scenarios:

```bash
# Test invalid callback
curl "https://your-domain.com/callback?error=access_denied"

# Test missing parameters
curl "https://your-domain.com/callback"
```

### **4. Browser Testing**

Test across different browsers:
- Chrome
- Firefox
- Safari
- Edge

### **5. Mobile Testing**

Test on mobile devices:
- iOS Safari
- Android Chrome
- Responsive design

---

## 🔧 Configuration Checklist

### **Auth0 Dashboard Configuration:**

- [ ] **Applications created** for each brand
- [ ] **Callback URLs** configured correctly
- [ ] **Logout URLs** configured correctly
- [ ] **Web Origins** configured correctly
- [ ] **Social connections** enabled
- [ ] **Passwordless authentication** configured
- [ ] **Custom domains** set up (if applicable)

### **Environment Variables:**

```bash
# Development
NEXT_PUBLIC_AUTH0_DOMAIN=your-dev-tenant.auth0.com
NEXT_PUBLIC_LUXELOOM_CLIENT_ID=your_dev_client_id

# Production
NEXT_PUBLIC_AUTH0_DOMAIN=your-prod-tenant.auth0.com
NEXT_PUBLIC_LUXELOOM_CLIENT_ID=your_prod_client_id
```

### **Security Headers:**

Verify that your hosting provider includes security headers:

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Content-Security-Policy: default-src 'self'
Referrer-Policy: strict-origin-when-cross-origin
```

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
- Verify deployment completed successfully
- Check hosting provider status
- Test direct URL access
- Review build logs

#### **3. "CORS Error" in Browser**

**Cause:** Cross-origin request blocked

**Solution:**
- Add domain to Auth0 Web Origins
- Check Content Security Policy
- Verify HTTPS for production

#### **4. "ngrok tunnel not working"**

**Cause:** ngrok configuration issues

**Solution:**
```bash
# Check ngrok status
curl http://localhost:4040/api/tunnels

# Restart ngrok with different port
ngrok http 3000 --log=stdout

# Check ngrok logs
tail -f ngrok.log
```

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

### **Network Debugging:**

Use browser developer tools to debug network requests:

1. **Open Developer Tools** (F12)
2. **Go to Network tab**
3. **Filter by "Fetch/XHR"**
4. **Test authentication flow**
5. **Check for failed requests**

---

## 📚 Additional Resources

- [ngrok Documentation](https://ngrok.com/docs)
- [GitHub Pages Documentation](https://pages.github.com/)
- [Vercel Documentation](https://vercel.com/docs)
- [Auth0 Universal Login](https://auth0.com/docs/authenticate/login/universal-login)
- [Auth0 Custom Domains](https://auth0.com/docs/customize/universal-login-pages/configure-custom-domains)

---

## 🎯 Quick Start Commands

### **Development with ngrok:**
```bash
cd frontend
npm run dev:acul
```

### **Deploy to Vercel:**
```bash
cd frontend
vercel
```

### **Deploy to GitHub Pages:**
```bash
git push origin main
```

### **Test Authentication:**
```bash
# Test with curl
curl -I https://your-domain.com/login
```

---

*Choose the deployment option that best fits your development workflow and production requirements. For development, ngrok is recommended. For production, Vercel or similar hosting services provide the best performance and reliability.*
