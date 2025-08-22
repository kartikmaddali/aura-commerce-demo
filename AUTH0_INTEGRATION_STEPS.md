# 🔐 Auth0 Integration Steps for Local Development

This guide walks you through integrating Auth0 with your locally running Aura Commerce project.

## 📋 Prerequisites

- ✅ Local project running (Frontend: http://localhost:3000, Backend: http://localhost:8000)
- ✅ Auth0 account (free tier available)
- ✅ Domain names for production (optional for local testing)

---

## 🚀 Step 1: Create Auth0 Applications

### **1.1 Create Frontend Application**

1. **Go to Auth0 Dashboard:**
   - Visit https://manage.auth0.com/
   - Sign in to your Auth0 account

2. **Create New Application:**
   - Click "Applications" → "Create Application"
   - Name: `Aura Commerce Frontend`
   - Type: **Single Page Application**
   - Click "Create"

3. **Configure Application Settings:**
   ```
   Allowed Callback URLs: http://localhost:3000/callback
   Allowed Logout URLs: http://localhost:3000
   Allowed Web Origins: http://localhost:3000
   Allowed Origins (CORS): http://localhost:3000
   ```

### **1.2 Create Backend Application**

1. **Create Another Application:**
   - Click "Applications" → "Create Application"
   - Name: `Aura Commerce Backend`
   - Type: **Machine to Machine Application**
   - Click "Create"

2. **Configure API Access:**
   - Go to "APIs" → "Auth0 Management API"
   - Authorize the backend application
   - Grant necessary scopes (read:users, read:user_idp_tokens, etc.)

3. **Get Client Credentials:**
   - After creating the M2M application, go to the "Settings" tab
   - Copy the **Client ID** and **Client Secret**
   - **Important:** Store the Client Secret securely - it cannot be retrieved later

---

## ⚙️ Step 2: Configure Auth0 APIs

### **2.1 Create Custom API**

1. **Go to APIs:**
   - Click "Applications" → "APIs" → "Create API"

2. **Configure API:**
   ```
   Name: Aura Commerce API
   Identifier: https://api.auracommerce.com
   Signing Algorithm: RS256
   ```

3. **Define Scopes:**
   ```
   read:products
   write:orders
   read:users
   write:users
   read:organizations
   ```

### **2.2 Configure Rules (Optional)**

1. **Go to Rules:**
   - Click "Auth Pipeline" → "Rules" → "Create Rule"

2. **Create Brand Detection Rule:**
   ```javascript
   function (user, context, callback) {
     const namespace = 'https://aura-commerce.com';
     
     // Set brand based on hostname
     context.idToken[namespace + '/brand'] = context.request.hostname;
     
     // Set default roles
     if (context.request.hostname === 'b2b.auracommerce.com') {
       context.idToken[namespace + '/roles'] = ['buyer'];
     } else {
       context.idToken[namespace + '/roles'] = ['customer'];
     }
     
     callback(null, user, context);
   }
   ```

---

## 🔧 Step 3: Configure Environment Variables

### **3.1 Frontend Environment (.env.local)**

Create/update `frontend/.env.local`:

```bash
# Auth0 Configuration
NEXT_PUBLIC_AUTH0_DOMAIN=your-tenant.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=your_frontend_client_id
NEXT_PUBLIC_AUTH0_AUDIENCE=https://api.auracommerce.com

# Brand-specific configurations (for local testing)
NEXT_PUBLIC_LUXELOOM_DOMAIN=your-tenant.auth0.com
NEXT_PUBLIC_LUXELOOM_CLIENT_ID=your_frontend_client_id
NEXT_PUBLIC_URBANMARKET_DOMAIN=your-tenant.auth0.com
NEXT_PUBLIC_URBANMARKET_CLIENT_ID=your_frontend_client_id
NEXT_PUBLIC_AURA_WHOLESALE_DOMAIN=your-tenant.auth0.com
NEXT_PUBLIC_AURA_WHOLESALE_CLIENT_ID=your_frontend_client_id

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### **3.2 Backend Environment (.env)**

Create/update `backend/.env`:

```bash
# Auth0 Configuration
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=your_backend_client_id
AUTH0_CLIENT_SECRET=your_backend_client_secret
AUTH0_AUDIENCE=https://api.auracommerce.com
AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Database Configuration (if using)
DATABASE_URL=your_database_url

# Server Configuration
PORT=8000
NODE_ENV=development
```

---

## 🔄 Step 4: Update ACUL Configuration

### **4.1 Update ACUL Config for Local Development**

Update `frontend/lib/acul-config.ts`:

```typescript
// Development configurations (for localhost)
export const devACULConfigs: BrandACULConfig = {
  'localhost': {
    domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN || 'your-tenant.auth0.com',
    clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || 'your_client_id',
    audience: 'https://api.auracommerce.com',
    scope: 'openid profile email read:products write:orders',
    redirectUri: 'http://localhost:3000/callback',
    logoutUrl: 'http://localhost:3000'
  },
  'localhost:3000': {
    domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN || 'your-tenant.auth0.com',
    clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || 'your_client_id',
    audience: 'https://api.auracommerce.com',
    scope: 'openid profile email read:products write:orders',
    redirectUri: 'http://localhost:3000/callback',
    logoutUrl: 'http://localhost:3000'
  }
};
```

### **4.2 Update ACUL HTML Pages**

Update the Auth0 configuration in your ACUL HTML files:

**In `frontend/public/login.html`:**
```javascript
// Replace placeholder values with your actual Auth0 credentials
const brandConfigs = {
  'localhost': {
    name: 'Aura Commerce',
    domain: 'your-tenant.auth0.com',
    clientId: 'your_client_id',
    audience: 'https://api.auracommerce.com',
    scope: 'openid profile email read:products write:orders'
  },
  'localhost:3000': {
    name: 'Aura Commerce',
    domain: 'your-tenant.auth0.com',
    clientId: 'your_client_id',
    audience: 'https://api.auracommerce.com',
    scope: 'openid profile email read:products write:orders'
  }
};
```

---

## 🧪 Step 5: Test the Integration

### **5.1 Test Authentication Flow**

1. **Navigate to your application:**
   ```
   http://localhost:3000
   ```

2. **Click "Sign In" or navigate to:**
   ```
   http://localhost:3000/login
   ```

3. **Complete Auth0 authentication:**
   - You'll be redirected to Auth0's login page
   - Sign in with your credentials
   - You'll be redirected back to your callback page
   - Then redirected to your main application

### **5.2 Test API Endpoints**

1. **Get access token from localStorage:**
   ```javascript
   // In browser console
   localStorage.getItem('auth0_access_token')
   ```

2. **Test API call:**
   ```bash
   curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
        http://localhost:8000/api/products
   ```

3. **Test Backend M2M Authentication:**
   ```bash
   # Get M2M token using client credentials
   curl -X POST https://your-tenant.auth0.com/oauth/token \
        -H "Content-Type: application/json" \
        -d '{
          "client_id": "your_backend_client_id",
          "client_secret": "your_backend_client_secret",
          "audience": "https://api.auracommerce.com",
          "grant_type": "client_credentials"
        }'
   ```

### **5.3 Test AI Endpoints**

1. **Test AI authentication:**
   ```bash
   curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
        http://localhost:8000/api/ai/authenticate
   ```

2. **Test AI chat:**
   ```bash
   curl -X POST \
        -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"message": "Hello, AI assistant!"}' \
        http://localhost:8000/api/ai/chat
   ```

---

## 🔍 Step 6: Troubleshooting

### **Common Issues:**

#### **1. "Invalid redirect_uri" Error**
**Solution:**
- Check Auth0 Dashboard → Applications → Your App → Settings
- Verify "Allowed Callback URLs" includes: `http://localhost:3000/callback`
- Verify "Allowed Logout URLs" includes: `http://localhost:3000`

#### **2. "Invalid client_id" Error**
**Solution:**
- Check your `.env.local` file
- Verify `NEXT_PUBLIC_AUTH0_CLIENT_ID` matches your Auth0 application
- Restart your development server

#### **3. "Invalid audience" Error**
**Solution:**
- Check your `.env.local` file
- Verify `NEXT_PUBLIC_AUTH0_AUDIENCE` matches your API identifier
- Ensure the API is properly configured in Auth0

#### **4. CORS Errors**
**Solution:**
- Check Auth0 Dashboard → Applications → Your App → Settings
- Verify "Allowed Origins (CORS)" includes: `http://localhost:3000`
- Check backend CORS configuration

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

---

## 📚 Step 7: Production Deployment

### **7.1 Update URLs for Production**

When deploying to production, update your Auth0 configuration:

```
Allowed Callback URLs: 
  https://your-domain.com/callback,
  http://localhost:3000/callback

Allowed Logout URLs: 
  https://your-domain.com,
  http://localhost:3000

Allowed Web Origins: 
  https://your-domain.com,
  http://localhost:3000
```

### **7.2 Environment Variables**

Set production environment variables in your hosting platform:

```bash
# Production
NEXT_PUBLIC_AUTH0_DOMAIN=your-tenant.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=your_production_client_id
NEXT_PUBLIC_AUTH0_AUDIENCE=https://api.auracommerce.com
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

---

## 🎯 Quick Reference

### **Auth0 Dashboard URLs:**
- **Applications:** https://manage.auth0.com/#/applications
- **APIs:** https://manage.auth0.com/#/apis
- **Rules:** https://manage.auth0.com/#/rules
- **Users:** https://manage.auth0.com/#/users

### **Local Development URLs:**
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:8000
- **API Docs:** http://localhost:8000/api-docs
- **Health Check:** http://localhost:8000/health

### **ACUL Pages:**
- **Login:** http://localhost:3000/login
- **Callback:** http://localhost:3000/callback
- **Logout:** http://localhost:3000/logout

---

## ✅ Success Checklist

- [ ] **Auth0 applications created** (Frontend + Backend)
- [ ] **Custom API configured** with proper scopes
- [ ] **Environment variables set** in both frontend and backend
- [ ] **ACUL configuration updated** for local development
- [ ] **Authentication flow tested** successfully
- [ ] **API endpoints working** with JWT tokens
- [ ] **AI endpoints functional** with proper authorization
- [ ] **CORS configured** correctly
- [ ] **Error handling tested** for various scenarios

---

*Your Auth0 integration is now complete! The authentication system is working with your local development environment and ready for production deployment.*
