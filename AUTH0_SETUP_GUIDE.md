# 🔧 Auth0 Setup Guide for km-personal-demo.us.auth0.com

## ✅ **Domain Confirmed:**
Your Auth0 domain `km-personal-demo.us.auth0.com` is accessible, but the OpenID configuration is returning 404. This means we need to set up your Auth0 tenant properly.

## 🎯 **Required Setup Steps:**

### **Step 1: Create Auth0 API**

1. **Go to Auth0 Dashboard:**
   - Visit: https://manage.auth0.com/dashboard/us/km-personal-demo/
   - Navigate to **APIs** in the left sidebar

2. **Create New API:**
   - Click **"Create API"**
   - **Name:** `Aura Commerce API`
   - **Identifier:** `https://api.auracommerce.com`
   - **Signing Algorithm:** `RS256`
   - Click **"Create"**

3. **Configure API Scopes:**
   - Go to the **Scopes** tab
   - Add these scopes:
     - `read:products`
     - `write:orders`
     - `read:users`
     - `write:users`
     - `read:organizations`

### **Step 2: Create Frontend Application (SPA)**

1. **Go to Applications:**
   - Navigate to **Applications** in the left sidebar
   - Click **"Create Application"**

2. **Configure SPA:**
   - **Name:** `Aura Commerce Frontend`
   - **Type:** `Single Page Application`
   - Click **"Create"**

3. **Configure Settings:**
   - Go to the **Settings** tab
   - **Allowed Callback URLs:** `http://localhost:3000/callback`
   - **Allowed Logout URLs:** `http://localhost:3000`
   - **Allowed Web Origins:** `http://localhost:3000`
   - **Allowed Origins (CORS):** `http://localhost:3000`
   - Click **"Save Changes"**

4. **Get Client ID:**
   - Copy the **Client ID** from the Settings tab
   - Update your `frontend/.env.local`:
     ```bash
     NEXT_PUBLIC_AUTH0_CLIENT_ID=your_spa_client_id
     ```

### **Step 3: Create Backend Application (M2M)**

1. **Create Another Application:**
   - Go to **Applications**
   - Click **"Create Application"**
   - **Name:** `Aura Commerce Backend`
   - **Type:** `Machine to Machine Application`
   - Click **"Create"**

2. **Authorize API Access:**
   - In the **APIs** tab, find your `Aura Commerce API`
   - Click **"Authorize"**
   - Grant these scopes:
     - `read:products`
     - `write:orders`
     - `read:users`
     - `write:users`

3. **Get Client Credentials:**
   - Go to the **Settings** tab
   - Copy the **Client ID** and **Client Secret**
   - Update your `backend/.env`:
     ```bash
     AUTH0_CLIENT_ID=your_m2m_client_id
     AUTH0_CLIENT_SECRET=your_m2m_client_secret
     ```

### **Step 4: Test the Setup**

1. **Test OpenID Configuration:**
   ```bash
   curl https://km-personal-demo.us.auth0.com/.well-known/openid_configuration
   ```
   Should return JSON configuration.

2. **Test SPA Authentication:**
   - Visit: `http://localhost:3000/login`
   - Click "Sign In"
   - Should redirect to Auth0 login

3. **Test M2M Authentication:**
   ```bash
   curl -X POST https://km-personal-demo.us.auth0.com/oauth/token \
        -H "Content-Type: application/json" \
        -d '{
          "client_id": "your_m2m_client_id",
          "client_secret": "your_m2m_client_secret",
          "audience": "https://api.auracommerce.com",
          "grant_type": "client_credentials"
        }'
   ```

## 🔍 **Troubleshooting:**

### **If OpenID Config Still Returns 404:**
1. **Check API Creation:** Ensure the API is created first
2. **Wait for Propagation:** Auth0 changes can take a few minutes
3. **Check Tenant Status:** Ensure your tenant is active

### **If Applications Don't Appear:**
1. **Check Permissions:** Ensure you have admin access
2. **Refresh Dashboard:** Try refreshing the Auth0 dashboard
3. **Check Tenant Region:** Ensure you're in the correct region

### **If Authentication Fails:**
1. **Verify Callback URLs:** Ensure they match exactly
2. **Check Client IDs:** Ensure they're copied correctly
3. **Test Domain:** Use the domain tester to verify

## 📋 **Current Configuration:**

Your current configuration should be:

### **Frontend (.env.local):**
```bash
NEXT_PUBLIC_AUTH0_DOMAIN=km-personal-demo.us.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=your_spa_client_id
NEXT_PUBLIC_AUTH0_AUDIENCE=https://api.auracommerce.com
```

### **Backend (.env):**
```bash
AUTH0_DOMAIN=km-personal-demo.us.auth0.com
AUTH0_CLIENT_ID=your_m2m_client_id
AUTH0_CLIENT_SECRET=your_m2m_client_secret
AUTH0_AUDIENCE=https://api.auracommerce.com
AUTH0_ISSUER_BASE_URL=https://km-personal-demo.us.auth0.com
```

## 🚀 **Next Steps:**

1. **Follow the setup steps above**
2. **Create the API and applications**
3. **Update the client IDs in your environment files**
4. **Test the authentication flow**

Once you complete these steps, the Sign In button should work correctly!

---

**Need Help?** If you encounter any issues during setup, let me know and I'll help you troubleshoot.
