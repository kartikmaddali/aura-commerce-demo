# 🔐 Auth0 Client Secrets Explained

This document explains when and why client secrets are needed in Auth0 integration, and how they differ between application types.

## 📋 **Application Types & Client Secrets**

### **1. Single Page Applications (SPAs) - NO Client Secret**

#### **Why No Client Secret?**
- **Security Risk:** Client secrets cannot be securely stored in browser-side JavaScript
- **Best Practice:** SPAs use Authorization Code Flow with PKCE (Proof Key for Code Exchange)
- **Token Exchange:** Happens directly between Auth0 and your app without a client secret

#### **Configuration:**
```bash
# Frontend (.env.local) - NO CLIENT SECRET
NEXT_PUBLIC_AUTH0_DOMAIN=your-tenant.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=your_frontend_client_id
NEXT_PUBLIC_AUTH0_AUDIENCE=https://api.auracommerce.com
```

#### **Flow:**
1. User clicks "Sign In"
2. Redirect to Auth0 login page
3. User authenticates
4. Auth0 redirects back with authorization code
5. Frontend exchanges code for tokens (no secret needed)

### **2. Machine to Machine Applications (M2M) - YES Client Secret**

#### **Why Client Secret?**
- **Server-Side:** Backend applications can securely store secrets
- **Direct Authentication:** M2M apps authenticate directly with Auth0
- **Service-to-Service:** Used for backend services communicating with each other

#### **Configuration:**
```bash
# Backend (.env) - INCLUDES CLIENT SECRET
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=your_backend_client_id
AUTH0_CLIENT_SECRET=your_backend_client_secret
AUTH0_AUDIENCE=https://api.auracommerce.com
AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com
```

#### **Flow:**
1. Backend requests token using client credentials
2. Auth0 validates client ID and secret
3. Auth0 returns access token
4. Backend uses token for API calls

---

## 🔧 **Updated Integration Steps**

### **Step 1: Create Auth0 Applications**

#### **Frontend Application (SPA):**
```
Type: Single Page Application
Name: Aura Commerce Frontend
Client Secret: NOT NEEDED
```

#### **Backend Application (M2M):**
```
Type: Machine to Machine Application
Name: Aura Commerce Backend
Client Secret: REQUIRED
```

### **Step 2: Get Client Credentials**

#### **For Frontend (SPA):**
1. Go to Auth0 Dashboard → Applications → Your SPA
2. Copy the **Client ID** only
3. No client secret needed

#### **For Backend (M2M):**
1. Go to Auth0 Dashboard → Applications → Your M2M App
2. Go to "Settings" tab
3. Copy the **Client ID** and **Client Secret**
4. **⚠️ Important:** Store the Client Secret securely - it cannot be retrieved later

### **Step 3: Environment Variables**

#### **Frontend (.env.local):**
```bash
# Auth0 Configuration (NO CLIENT SECRET)
NEXT_PUBLIC_AUTH0_DOMAIN=your-tenant.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=your_frontend_client_id
NEXT_PUBLIC_AUTH0_AUDIENCE=https://api.auracommerce.com

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### **Backend (.env):**
```bash
# Auth0 Configuration (INCLUDES CLIENT SECRET)
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=your_backend_client_id
AUTH0_CLIENT_SECRET=your_backend_client_secret
AUTH0_AUDIENCE=https://api.auracommerce.com
AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Server Configuration
PORT=8000
NODE_ENV=development
```

---

## 🧪 **Testing Both Flows**

### **Test Frontend Authentication (SPA):**
```bash
# 1. Visit your application
http://localhost:3000/login

# 2. Complete authentication flow
# 3. Check localStorage for tokens
localStorage.getItem('auth0_access_token')

# 4. Test API call with user token
curl -H "Authorization: Bearer USER_ACCESS_TOKEN" \
     http://localhost:8000/api/products
```

### **Test Backend Authentication (M2M):**
```bash
# 1. Get M2M token using client credentials
curl -X POST https://your-tenant.auth0.com/oauth/token \
     -H "Content-Type: application/json" \
     -d '{
       "client_id": "your_backend_client_id",
       "client_secret": "your_backend_client_secret",
       "audience": "https://api.auracommerce.com",
       "grant_type": "client_credentials"
     }'

# 2. Use the returned access token for API calls
curl -H "Authorization: Bearer M2M_ACCESS_TOKEN" \
     http://localhost:8000/api/ai/authenticate
```

---

## 🔒 **Security Best Practices**

### **Frontend (SPA):**
- ✅ **No client secret** in frontend code
- ✅ Use PKCE for additional security
- ✅ Store tokens in secure storage (localStorage/sessionStorage)
- ✅ Implement token refresh logic

### **Backend (M2M):**
- ✅ **Store client secret securely** (environment variables)
- ✅ Never commit secrets to version control
- ✅ Use different secrets for different environments
- ✅ Rotate secrets regularly

### **Environment Variables:**
```bash
# Development
AUTH0_CLIENT_SECRET=dev_secret_here

# Production (use secure secret management)
AUTH0_CLIENT_SECRET=${AUTH0_CLIENT_SECRET}
```

---

## 🎯 **When to Use Each Flow**

### **Use SPA Flow (No Client Secret):**
- User authentication in web applications
- Interactive user interfaces
- Browser-based applications
- Public client applications

### **Use M2M Flow (With Client Secret):**
- Backend service authentication
- API-to-API communication
- Background job authentication
- Server-side applications

---

## ✅ **Updated Checklist**

- [ ] **Frontend SPA created** (no client secret needed)
- [ ] **Backend M2M app created** (client secret required)
- [ ] **Client ID copied** for both applications
- [ ] **Client Secret copied** for M2M application only
- [ ] **Environment variables configured** correctly
- [ ] **Frontend authentication tested** (SPA flow)
- [ ] **Backend authentication tested** (M2M flow)
- [ ] **API endpoints working** with both token types

---

## 🔍 **Troubleshooting**

### **"Invalid client_secret" Error:**
- Check that you're using the M2M application's client secret
- Verify the client secret is correctly copied
- Ensure you're using the right application type

### **"Client secret not allowed" Error:**
- This error occurs when trying to use a client secret with an SPA
- Remove client secret from frontend configuration
- Use only client ID for SPAs

### **"Invalid grant_type" Error:**
- SPAs use `authorization_code` grant type
- M2M apps use `client_credentials` grant type
- Ensure you're using the correct flow for your application type

---

*Understanding when and why to use client secrets is crucial for secure Auth0 integration. SPAs never need client secrets, while M2M applications always require them.*
