# 🔐 Authentication Testing Guide

Your Auth0 authentication system is now ready for testing! Both frontend and backend servers are running.

## 🚀 **Current Status:**
- ✅ **Frontend:** Running on `http://localhost:3000`
- ✅ **Backend:** Running on `http://localhost:8000`
- ✅ **Auth0:** Configured with your credentials

## 🧪 **Step-by-Step Testing:**

### **1. Test Frontend Authentication (SPA Flow)**

#### **Step 1: Visit the Login Page**
```bash
# Open your browser and go to:
http://localhost:3000/login
```

**Expected Result:**
- You should see the custom Auth0 login page
- Brand-specific styling should be applied
- "Sign In" button should be visible

#### **Step 2: Initiate Authentication**
1. Click the **"Sign In"** button
2. You should be redirected to Auth0's login page
3. Sign in with your Auth0 credentials

**Expected Result:**
- Redirect to Auth0 login page
- After successful login, redirect back to `/callback`
- Then redirect to main application

#### **Step 3: Verify Authentication State**
```javascript
// Open browser console and check:
localStorage.getItem('auth0_user')
localStorage.getItem('auth0_access_token')
localStorage.getItem('auth0_brand')
```

**Expected Result:**
- User object with profile information
- Valid access token
- Brand information

### **2. Test API Endpoints with User Token**

#### **Step 1: Get Access Token**
```javascript
// In browser console:
const token = localStorage.getItem('auth0_access_token');
console.log('Access Token:', token);
```

#### **Step 2: Test Protected API Endpoints**
```bash
# Replace YOUR_ACCESS_TOKEN with the actual token
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
     http://localhost:8000/api/products

curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
     http://localhost:8000/api/users/profile
```

**Expected Result:**
- `200 OK` response with data
- User information in response

### **3. Test Backend M2M Authentication**

#### **Step 1: Get M2M Token**
```bash
curl -X POST https://km-personal-demo.us.auth0.com/oauth/token \
     -H "Content-Type: application/json" \
     -d '{
       "client_id": "b58TmerwnzmMPPwU5PVgbNpZ6TH6AOXm",
       "client_secret": "Hs0MPTeIR5dRwnIORrjkVuje7vgoIz7bBsosE8_taQM9isaIBpPk0I6WeNOTYo_8",
       "audience": "https://api.auracomerce.com",
       "grant_type": "client_credentials"
     }'
```

**Expected Result:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIs...",
  "token_type": "Bearer",
  "expires_in": 86400
}
```

#### **Step 2: Test M2M API Endpoints**
```bash
# Use the M2M token from previous step
curl -H "Authorization: Bearer M2M_ACCESS_TOKEN" \
     http://localhost:8000/api/ai/authenticate

curl -H "Authorization: Bearer M2M_ACCESS_TOKEN" \
     http://localhost:8000/api/products
```

### **4. Test Logout Flow**

#### **Step 1: Initiate Logout**
```bash
# Visit the logout page:
http://localhost:3000/logout
```

**Expected Result:**
- Secure logout process
- Clear local storage
- Redirect to Auth0 logout
- Return to main application

#### **Step 2: Verify Logout**
```javascript
// Check that tokens are cleared:
localStorage.getItem('auth0_access_token') // Should be null
localStorage.getItem('auth0_user') // Should be null
```

### **5. Test Error Handling**

#### **Test Invalid Token**
```bash
curl -H "Authorization: Bearer invalid_token" \
     http://localhost:8000/api/products
```

**Expected Result:**
- `401 Unauthorized` response
- Clear error message

#### **Test Missing Token**
```bash
curl http://localhost:8000/api/products
```

**Expected Result:**
- `401 Unauthorized` response
- "No token provided" message

## 🔍 **Troubleshooting Common Issues:**

### **Issue: "Invalid client_secret" Error**
**Solution:** Verify you're using the M2M application's client secret, not the SPA's.

### **Issue: "Client secret not allowed" Error**
**Solution:** This is expected for SPAs - they don't use client secrets.

### **Issue: "Invalid grant_type" Error**
**Solution:** 
- SPAs use `authorization_code` (automatic)
- M2M apps use `client_credentials`

### **Issue: Callback URL Mismatch**
**Solution:** Ensure Auth0 dashboard has:
- `http://localhost:3000/callback` in allowed callback URLs

### **Issue: CORS Errors**
**Solution:** Backend should handle CORS for `http://localhost:3000`

## 📊 **Testing Checklist:**

- [ ] **Frontend Login Page** loads correctly
- [ ] **Auth0 Redirect** works properly
- [ ] **Callback Processing** completes successfully
- [ ] **User Data** stored in localStorage
- [ ] **Access Token** obtained and stored
- [ ] **API Calls** work with user token
- [ ] **M2M Authentication** works
- [ ] **Logout** clears session properly
- [ ] **Error Handling** works for invalid tokens

## 🎯 **Quick Test Commands:**

```bash
# Test backend health
curl http://localhost:8000/health

# Test products endpoint (should fail without auth)
curl http://localhost:8000/api/products

# Test M2M authentication
curl -X POST https://km-personal-demo.us.auth0.com/oauth/token \
     -H "Content-Type: application/json" \
     -d '{"client_id":"b58TmerwnzmMPPwU5PVgbNpZ6TH6AOXm","client_secret":"Hs0MPTeIR5dRwnIORrjkVuje7vgoIz7bBsosE8_taQM9isaIBpPk0I6WeNOTYo_8","audience":"https://api.auracomerce.com","grant_type":"client_credentials"}'
```

---

**Ready to test! Start with visiting `http://localhost:3000/login` in your browser.**
