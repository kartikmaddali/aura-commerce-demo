# 🔐 Auth0 ACUL (Advanced Customization of Universal Login) Setup Guide

This guide provides a complete setup for Auth0's ACUL with the auth0-spa-js SDK for the Aura Commerce multi-brand platform.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Auth0 Dashboard Configuration](#auth0-dashboard-configuration)
4. [File Structure](#file-structure)
5. [Configuration Setup](#configuration-setup)
6. [Implementation Details](#implementation-details)
7. [Testing](#testing)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

Auth0 ACUL (Advanced Customization of Universal Login) allows you to create custom login pages while maintaining Auth0's security features. This implementation provides:

- **Multi-brand support** with domain-specific configurations
- **Custom login/logout/callback pages** with brand-specific styling
- **Social login integration** (Google, Apple, Facebook, LinkedIn)
- **Passwordless authentication** (magic links, SMS)
- **Multi-factor authentication** support
- **Account linking** capabilities
- **Token management** with refresh token rotation

---

## 📋 Prerequisites

### Required Tools
- Node.js 18+ and npm
- Auth0 account with appropriate permissions
- Domain names for each brand (or localhost for development)

### Required Packages
```bash
# Install auth0-spa-js for client-side authentication
npm install auth0-spa-js

# Install additional dependencies for enhanced functionality
npm install jose # For JWT handling
npm install @auth0/fga-js # For fine-grained authorization (optional)
```

---

## ⚙️ Auth0 Dashboard Configuration

### 1. Create Auth0 Applications

For each brand, create a **Single Page Application** in Auth0:

#### LuxeLoom Application
```
Application Name: LuxeLoom SPA
Application Type: Single Page Application
Allowed Callback URLs: https://www.luxeloom.com/callback, http://localhost:3000/callback
Allowed Logout URLs: https://www.luxeloom.com, http://localhost:3000
Allowed Web Origins: https://www.luxeloom.com, http://localhost:3000
```

#### UrbanMarket Application
```
Application Name: UrbanMarket SPA
Application Type: Single Page Application
Allowed Callback URLs: https://www.urbanmarket.com/callback, http://localhost:3000/callback
Allowed Logout URLs: https://www.urbanmarket.com, http://localhost:3000
Allowed Web Origins: https://www.urbanmarket.com, http://localhost:3000
```

#### Aura Wholesale Application
```
Application Name: Aura Wholesale SPA
Application Type: Single Page Application
Allowed Callback URLs: https://b2b.auracommerce.com/callback, http://localhost:3000/callback
Allowed Logout URLs: https://b2b.auracommerce.com, http://localhost:3000
Allowed Web Origins: https://b2b.auracommerce.com, http://localhost:3000
```

### 2. Configure Social Connections

Enable and configure social connections in Auth0 Dashboard:

#### For LuxeLoom & UrbanMarket:
- Google (OAuth 2.0)
- Apple (OAuth 2.0)
- Facebook (OAuth 2.0)

#### For Aura Wholesale:
- Google (OAuth 2.0)
- LinkedIn (OAuth 2.0)

### 3. Configure Passwordless Connections

Enable passwordless authentication:

1. Go to **Authentication > Database**
2. Create a new database connection for each brand
3. Enable **Passwordless** option
4. Configure email templates for magic links

### 4. Set Up Custom Domains (Optional)

For production, configure custom domains:

1. Go to **Branding > Custom Domains**
2. Add domains for each brand:
   - `auth.luxeloom.com`
   - `auth.urbanmarket.com`
   - `auth.auracommerce.com`

---

## 📁 File Structure

```
frontend/
├── public/
│   ├── login.html          # ACUL login page
│   ├── callback.html       # Authentication callback handler
│   └── logout.html         # Logout handler
├── app/
│   └── api/
│       └── auth/
│           └── callback/
│               └── route.ts # Next.js API route for callbacks
├── components/
│   └── providers/
│       └── AuthProvider.tsx # Updated Auth0 integration
└── lib/
    ├── auth0-config.ts     # Original Auth0 configuration
    └── acul-config.ts      # ACUL-specific configuration
```

---

## ⚙️ Configuration Setup

### 1. Environment Variables

Create `.env.local` file in the frontend directory:

```bash
# Auth0 Configuration
NEXT_PUBLIC_AUTH0_DOMAIN=your-tenant.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=your_client_id
NEXT_PUBLIC_AUTH0_AUDIENCE=https://api.auracommerce.com

# Brand-specific configurations
NEXT_PUBLIC_LUXELOOM_DOMAIN=luxeloom.auth0.com
NEXT_PUBLIC_LUXELOOM_CLIENT_ID=luxeloom_client_id
NEXT_PUBLIC_URBANMARKET_DOMAIN=urbanmarket.auth0.com
NEXT_PUBLIC_URBANMARKET_CLIENT_ID=urbanmarket_client_id
NEXT_PUBLIC_AURA_WHOLESALE_DOMAIN=aura-wholesale.auth0.com
NEXT_PUBLIC_AURA_WHOLESALE_CLIENT_ID=aura_wholesale_client_id

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 2. Update ACUL Configuration

Update `frontend/lib/acul-config.ts` with your actual Auth0 credentials:

```typescript
export const brandACULConfigs: BrandACULConfig = {
  'www.luxeloom.com': {
    domain: process.env.NEXT_PUBLIC_LUXELOOM_DOMAIN || 'luxeloom.auth0.com',
    clientId: process.env.NEXT_PUBLIC_LUXELOOM_CLIENT_ID || 'luxeloom_client_id',
    audience: 'https://api.luxeloom.com',
    scope: 'openid profile email read:products write:orders read:wishlist',
    redirectUri: 'https://www.luxeloom.com/callback',
    logoutUrl: 'https://www.luxeloom.com',
    customDomain: 'www.luxeloom.com'
  },
  // ... other brands
};
```

---

## 🔧 Implementation Details

### 1. Login Page (`/public/login.html`)

The login page handles:
- Brand detection based on hostname
- Auth0 SDK initialization
- Social login buttons
- Error handling and user feedback
- Responsive design with brand-specific styling

### 2. Callback Page (`/public/callback.html`)

The callback page handles:
- Authentication code exchange
- Token storage in localStorage
- User context extraction
- Redirect to main application
- Error handling and retry logic

### 3. Logout Page (`/public/logout.html`)

The logout page handles:
- Secure session termination
- Local storage cleanup
- Auth0 logout
- User feedback and navigation options

### 4. AuthProvider Integration

The updated AuthProvider:
- Reads authentication state from localStorage
- Provides login/logout functions that redirect to ACUL pages
- Handles token refresh and validation
- Integrates with the existing brand system

---

## 🧪 Testing

### 1. Local Development Testing

```bash
# Start the development server
cd frontend
npm run dev

# Test different brands
# http://localhost:3000 (default)
# http://localhost:3000?brand=luxeloom
# http://localhost:3000?brand=urbanmarket
# http://localhost:3000?brand=aura-wholesale
```

### 2. Authentication Flow Testing

1. **Login Flow:**
   - Navigate to `/login`
   - Click "Sign In" button
   - Complete Auth0 authentication
   - Verify redirect to main application
   - Check localStorage for user data

2. **Logout Flow:**
   - Click logout button
   - Verify redirect to `/logout`
   - Check localStorage cleanup
   - Verify redirect to home page

3. **Social Login:**
   - Test each social provider
   - Verify account linking
   - Check user data consistency

### 3. Error Handling Testing

Test various error scenarios:
- Invalid credentials
- Network errors
- Consent required
- Access denied
- Token expiration

---

## 🚀 Deployment

### 1. Production Configuration

Update configuration for production domains:

```typescript
// Update redirect URIs and logout URLs
export const brandACULConfigs: BrandACULConfig = {
  'www.luxeloom.com': {
    // ... other config
    redirectUri: 'https://www.luxeloom.com/callback',
    logoutUrl: 'https://www.luxeloom.com'
  }
};
```

### 2. Auth0 Dashboard Updates

1. **Update Allowed URLs:**
   - Add production callback URLs
   - Add production logout URLs
   - Add production web origins

2. **Configure Custom Domains:**
   - Set up DNS records
   - Configure SSL certificates
   - Update Auth0 custom domain settings

### 3. Environment Variables

Set production environment variables:

```bash
# Production environment variables
NEXT_PUBLIC_AUTH0_DOMAIN=your-production-tenant.auth0.com
NEXT_PUBLIC_LUXELOOM_DOMAIN=luxeloom.auth0.com
NEXT_PUBLIC_LUXELOOM_CLIENT_ID=your_luxeloom_client_id
# ... other production configs
```

### 4. Security Considerations

1. **HTTPS Only:**
   - Ensure all production URLs use HTTPS
   - Configure secure cookies
   - Enable HSTS headers

2. **Token Security:**
   - Use secure storage for tokens
   - Implement token rotation
   - Set appropriate token expiration times

3. **CORS Configuration:**
   - Configure proper CORS headers
   - Restrict allowed origins
   - Validate request origins

---

## 🔍 Troubleshooting

### Common Issues

#### 1. "Invalid redirect_uri" Error
**Cause:** Mismatch between configured and actual redirect URIs
**Solution:** 
- Check Auth0 Dashboard configuration
- Verify redirect URI in ACUL config
- Ensure protocol (http/https) matches

#### 2. "Invalid client_id" Error
**Cause:** Incorrect client ID configuration
**Solution:**
- Verify client ID in Auth0 Dashboard
- Check environment variables
- Ensure brand-specific client IDs are correct

#### 3. "Token expired" Error
**Cause:** Access token has expired
**Solution:**
- Implement token refresh logic
- Check token expiration handling
- Verify refresh token configuration

#### 4. "Social login not working"
**Cause:** Social connections not properly configured
**Solution:**
- Check Auth0 social connection settings
- Verify OAuth app credentials
- Test social login in Auth0 Dashboard

### Debug Mode

Enable debug mode for troubleshooting:

```typescript
// In acul-config.ts
export function getAuth0SDKConfig(hostname: string) {
  const config = getACULConfig(hostname);
  
  return {
    // ... other config
    debug: process.env.NODE_ENV === 'development',
    // ... rest of config
  };
}
```

### Logging

Add comprehensive logging for debugging:

```typescript
// Add to login.html, callback.html, logout.html
const DEBUG = process.env.NODE_ENV === 'development';

function log(message: string, data?: any) {
  if (DEBUG) {
    console.log(`[ACUL] ${message}`, data);
  }
}
```

---

## 📚 Additional Resources

- [Auth0 SPA SDK Documentation](https://auth0.com/docs/libraries/auth0-spa-js)
- [Auth0 Universal Login Documentation](https://auth0.com/docs/authenticate/login/universal-login)
- [Auth0 Custom Domains](https://auth0.com/docs/customize/universal-login-pages/configure-custom-domains)
- [Auth0 Social Connections](https://auth0.com/docs/authenticate/identity-providers/social)

---

## 🎯 Next Steps

After implementing ACUL:

1. **Enhanced Security:**
   - Implement MFA for sensitive operations
   - Add device fingerprinting
   - Configure advanced threat detection

2. **User Experience:**
   - Add progressive web app features
   - Implement offline authentication
   - Add biometric authentication

3. **Analytics:**
   - Track authentication events
   - Monitor user behavior
   - Implement A/B testing for login flows

4. **Compliance:**
   - Implement GDPR compliance features
   - Add audit logging
   - Configure data retention policies

---

*This guide provides a comprehensive setup for Auth0 ACUL integration. For production deployment, ensure all security best practices are followed and conduct thorough testing across all supported browsers and devices.*
