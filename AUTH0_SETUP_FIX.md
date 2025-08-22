# 🔧 Auth0 Configuration Fix Guide

## 🚨 Current Issue
The Auth0 tenant `km-personal-demo.us.auth0.com` is returning 404 for OpenID configuration, which means the tenant needs proper configuration.

## ✅ Step-by-Step Fix

### 1. Access Auth0 Dashboard
- Go to: https://manage.auth0.com/dashboard/us/km-personal-demo
- Or: https://us.auth0.com/ and select your tenant

### 2. Create the API (Required First)

#### Navigate to APIs
- In Auth0 Dashboard, go to **Applications** → **APIs**
- Click **Create API**

#### API Configuration
```
Name: Aura Commerce API
Identifier: https://api.auracommerce.com
Signing Algorithm: RS256
```

#### API Scopes
Add these scopes:
- `read:products`
- `write:orders`
- `read:users`
- `write:users`
- `read:organizations`

### 3. Create Frontend Application (SPA)

#### Navigate to Applications
- Go to **Applications** → **Applications**
- Click **Create Application**

#### Application Configuration
```
Name: Aura Commerce Frontend
Type: Single Page Application
```

#### Settings Configuration
```
Allowed Callback URLs: 
- http://localhost:3000/callback
- http://localhost:3000

Allowed Logout URLs:
- http://localhost:3000

Allowed Web Origins:
- http://localhost:3000

Allowed Origins (CORS):
- http://localhost:3000
```

#### Advanced Settings
- **Token Endpoint Authentication Method**: None
- **Grant Types**: Authorization Code, Implicit, Refresh Token

### 4. Create Backend Application (M2M)

#### Create Application
- Go to **Applications** → **Applications**
- Click **Create Application**

#### Application Configuration
```
Name: Aura Commerce Backend
Type: Machine to Machine Application
```

#### Authorize API
- Select your API: `Aura Commerce API`
- Authorize with these scopes:
  - `read:products`
  - `write:orders`
  - `read:users`
  - `write:users`

### 5. Update Environment Variables

#### Frontend (.env.local)
```bash
NEXT_PUBLIC_AUTH0_DOMAIN=km-personal-demo.us.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=[YOUR_FRONTEND_CLIENT_ID]
NEXT_PUBLIC_AUTH0_AUDIENCE=https://api.auracommerce.com
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### Backend (.env)
```bash
AUTH0_DOMAIN=km-personal-demo.us.auth0.com
AUTH0_CLIENT_ID=[YOUR_BACKEND_CLIENT_ID]
AUTH0_CLIENT_SECRET=[YOUR_BACKEND_CLIENT_SECRET]
AUTH0_AUDIENCE=https://api.auracommerce.com
AUTH0_ISSUER_BASE_URL=https://km-personal-demo.us.auth0.com
JWT_SECRET=4d80d10e0f8526d18e15c1292e0348616e67cadcd6d1a6db19926d2c9ccf1249
PORT=8000
NODE_ENV=development
```

### 6. Test Configuration

#### Test OpenID Configuration
```bash
curl https://km-personal-demo.us.auth0.com/.well-known/openid_configuration
```
Should return JSON, not 404.

#### Test Frontend Application
```bash
curl -X POST https://km-personal-demo.us.auth0.com/oauth/token \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "[YOUR_FRONTEND_CLIENT_ID]",
    "audience": "https://api.auracommerce.com",
    "grant_type": "client_credentials"
  }'
```

### 7. Update Application Code

#### Update AuthProvider
Replace the hardcoded client ID with environment variable:
```typescript
const auth0LoginUrl = `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/authorize?` +
  `response_type=code&` +
  `client_id=${process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}&` +
  `redirect_uri=${encodeURIComponent('http://localhost:3000/callback')}&` +
  `scope=openid%20profile%20email%20read:products%20write:orders&` +
  `audience=${process.env.NEXT_PUBLIC_AUTH0_AUDIENCE}&` +
  `state=${Math.random().toString(36).substring(7)}`;
```

### 8. Test the Complete Flow

1. **Clear all authentication data**
2. **Restart the development server**
3. **Test the Sign In button**
4. **Complete Auth0 login**
5. **Verify callback processing**

## 🔍 Troubleshooting

### If OpenID Config Still Returns 404
- Make sure you're in the correct Auth0 tenant
- Verify the API is created and published
- Check that applications are properly configured

### If Callback Fails
- Verify callback URLs are correct
- Check that the application type is "Single Page Application"
- Ensure CORS settings allow localhost:3000

### If Token Exchange Fails
- Verify client ID and secret are correct
- Check that the API is authorized for the application
- Ensure scopes are properly configured

## 📋 Checklist

- [ ] API created with correct identifier
- [ ] Frontend SPA application created
- [ ] Backend M2M application created
- [ ] Callback URLs configured
- [ ] Environment variables updated
- [ ] OpenID configuration accessible
- [ ] Token exchange working
- [ ] Sign In button redirects to Auth0
- [ ] Callback processes successfully

## 🎯 Expected Result

After completing these steps:
1. `https://km-personal-demo.us.auth0.com/.well-known/openid_configuration` returns JSON
2. Sign In button redirects to Auth0 login page
3. Login completes and redirects back to callback
4. User is authenticated and can access protected resources
