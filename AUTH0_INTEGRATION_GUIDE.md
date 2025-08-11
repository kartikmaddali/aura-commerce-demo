# 🏢 Aura Commerce Group - Project Summary & Auth0 Integration Guide

## 🎯 **Project Overview**

**Aura Commerce Group** is a comprehensive full-stack demo showcasing advanced authentication, authorization, and AI integration for a fictional multi-brand retail company. The project demonstrates modern web development patterns with Auth0's enterprise capabilities.

### **🏗️ Architecture**
- **Frontend**: Next.js 14 with TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Express.js API with TypeScript, comprehensive middleware
- **Authentication**: Auth0 Universal Login with multi-tenant support
- **Authorization**: Role-Based Access Control (RBAC) + Fine-Grained Authorization (FGA)
- **AI Integration**: Context-aware AI assistant with JWT claims

### **🎯 Multi-Brand Strategy**
- **Single Codebase** serving three distinct brands:
  - **LuxeLoom**: High-end fashion (Premium/VIP features)
  - **UrbanMarket**: Fast fashion (Social shopping)
  - **Aura Wholesale**: B2B portal (Corporate management)

---

## 🔐 **Auth0 Integration Guide**

### **1. Auth0 Tenant Setup**

#### **Create Auth0 Application**
```bash
# 1. Go to Auth0 Dashboard
# 2. Create New Application
# 3. Choose "Single Page Application" for frontend
# 4. Choose "Machine to Machine" for backend
```

#### **Configure Application Settings**
```json
{
  "domain": "your-tenant.auth0.com",
  "clientId": "your_client_id",
  "clientSecret": "your_client_secret",
  "audience": "https://api.auracommerce.com",
  "scope": "openid profile email read:products write:orders"
}
```

### **2. Multi-Domain Configuration**

#### **Custom Domains Setup**
```javascript
// Auth0 Dashboard → Branding → Custom Domains
// Add domains for each brand:
// - www.luxeloom.com
// - www.urbanmarket.com  
// - b2b.auracommerce.com
```

#### **Brand-Specific Applications**
```typescript
// Create separate Auth0 applications for each brand
const auth0Configs = {
  'www.luxeloom.com': {
    domain: 'luxeloom.auth0.com',
    clientId: 'luxeloom_client_id',
    audience: 'https://api.luxeloom.com'
  },
  'www.urbanmarket.com': {
    domain: 'urbanmarket.auth0.com', 
    clientId: 'urbanmarket_client_id',
    audience: 'https://api.urbanmarket.com'
  },
  'b2b.auracommerce.com': {
    domain: 'aura-wholesale.auth0.com',
    clientId: 'aura_wholesale_client_id', 
    audience: 'https://api.auracommerce.com'
  }
};
```

### **3. Authentication Implementation**

#### **Frontend Auth0 SDK Integration**
```typescript
// Install Auth0 React SDK
npm install @auth0/auth0-react

// Configure Auth0Provider
import { Auth0Provider } from '@auth0/auth0-react';

function App() {
  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
        scope: "openid profile email read:products write:orders"
      }}
    >
      <YourApp />
    </Auth0Provider>
  );
}
```

#### **Login Implementation**
```typescript
import { useAuth0 } from '@auth0/auth0-react';

function LoginButton() {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  if (isAuthenticated) return null;

  return (
    <button onClick={() => loginWithRedirect()}>
      Sign In
    </button>
  );
}
```

#### **Backend JWT Verification**
```typescript
// middleware/auth.ts
import { auth } from 'express-oauth-server';
import jwksRsa from 'jwks-rsa';

const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: 'RS256'
});

export const authenticateToken = async (req, res, next) => {
  try {
    await checkJwt(req, res, next);
    
    // Extract user info from JWT
    const user = {
      id: req.auth.sub,
      email: req.auth.email,
      roles: req.auth['https://aura-commerce.com/roles'] || [],
      organizationId: req.auth['https://aura-commerce.com/organization_id'],
      isPremium: req.auth['https://aura-commerce.com/is_premium'] || false
    };
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

### **4. Role-Based Access Control (RBAC)**

#### **Auth0 Rules for Role Assignment**
```javascript
// Auth0 Dashboard → Rules → Create Rule
function (user, context, callback) {
  const namespace = 'https://aura-commerce.com';
  
  // Assign roles based on brand and user type
  if (context.request.hostname === 'www.luxeloom.com') {
    // Premium users get VIP access
    if (user.email.endsWith('@premium.com')) {
      context.idToken[namespace + '/roles'] = ['premium-member'];
      context.idToken[namespace + '/is_premium'] = true;
    } else {
      context.idToken[namespace + '/roles'] = ['customer'];
    }
  }
  
  if (context.request.hostname === 'b2b.auracommerce.com') {
    // B2B users get organization-based roles
    context.idToken[namespace + '/roles'] = ['buyer'];
    context.idToken[namespace + '/organization_id'] = user.app_metadata.organization_id;
  }
  
  context.idToken[namespace + '/brand'] = context.request.hostname;
  
  callback(null, user, context);
}
```

#### **Frontend Role Checking**
```typescript
import { useAuth0 } from '@auth0/auth0-react';

function VIPLounge() {
  const { user, isAuthenticated } = useAuth0();
  const isPremium = user?.['https://aura-commerce.com/is_premium'];
  
  if (!isAuthenticated || !isPremium) {
    return <div>Access denied. Premium membership required.</div>;
  }
  
  return <div>Welcome to the VIP Lounge!</div>;
}
```

#### **Backend Role Middleware**
```typescript
export const requireRole = (role: string) => {
  return (req, res, next) => {
    if (!req.user?.roles?.includes(role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

// Usage in routes
router.get('/vip-lounge', 
  authenticateToken, 
  requireRole('premium-member'), 
  vipLoungeController
);
```

---

## 🔒 **Fine-Grained Authorization (FGA) Implementation**

### **1. Auth0 FGA Setup**

#### **Install FGA SDK**
```bash
npm install @auth0/fga-js
```

#### **FGA Policy Configuration**
```typescript
// Define authorization model
const authorizationModel = {
  type_definitions: [
    {
      type: 'user',
      relations: {
        member: { union: { child: [{ type: 'organization' }] } }
      }
    },
    {
      type: 'organization',
      relations: {
        admin: { union: { child: [{ type: 'user' }] } }
      }
    },
    {
      type: 'order',
      relations: {
        owner: { union: { child: [{ type: 'user' }] } },
        organization: { union: { child: [{ type: 'organization' }] } },
        can_approve: { union: { child: [{ type: 'organization#admin' }] } }
      }
    }
  ]
};
```

#### **FGA Client Setup**
```typescript
import { OpenFgaClient } from '@auth0/fga-js';

const fgaClient = new OpenFgaClient({
  apiUrl: process.env.FGA_API_URL,
  storeId: process.env.FGA_STORE_ID,
  clientId: process.env.FGA_CLIENT_ID,
  clientSecret: process.env.FGA_CLIENT_SECRET,
});
```

### **2. FGA Policy Enforcement**

#### **Backend FGA Middleware**
```typescript
export const requireFGA = (resource: string, action: string) => {
  return async (req, res, next) => {
    try {
      const { user } = req;
      
      // Check FGA permission
      const { allowed } = await fgaClient.check({
        tuple_key: {
          user: `user:${user.id}`,
          relation: action,
          object: resource
        }
      });
      
      if (!allowed) {
        return res.status(403).json({ error: 'Access denied' });
      }
      
      next();
    } catch (error) {
      res.status(500).json({ error: 'Authorization check failed' });
    }
  };
};
```

#### **FGA Policy Examples**

**B2B Order Approval**
```typescript
// Only organization admins can approve orders
router.post('/orders/:id/approve', 
  authenticateToken,
  requireFGA(`order:${req.params.id}`, 'can_approve'),
  orderController.approveOrder
);
```

**Organization User Management**
```typescript
// Only organization admins can manage users
router.get('/users/organization',
  authenticateToken,
  requireFGA(`organization:${req.user.organizationId}`, 'admin'),
  userController.getOrganizationUsers
);
```

### **3. FGA Policy Writing**

#### **Relationship-Based Policies**
```typescript
// Policy: Users can only access orders from their organization
const orderAccessPolicy = {
  name: 'Order Organization Access',
  description: 'Users can only access orders from their organization',
  statements: [
    {
      effect: 'allow',
      action: 'read',
      resource: 'order:*',
      condition: {
        string_equals: {
          'order.organization_id': '${user.organization_id}'
        }
      }
    }
  ]
};
```

#### **Role-Based Policies**
```typescript
// Policy: Premium users get exclusive access
const premiumAccessPolicy = {
  name: 'Premium Feature Access',
  description: 'Premium users get access to exclusive features',
  statements: [
    {
      effect: 'allow',
      action: 'read',
      resource: 'vip-lounge:*',
      condition: {
        bool: {
          'user.is_premium': true
        }
      }
    }
  ]
};
```

---

## 🤖 **AI Integration with Auth0**

### **1. JWT Claims to AI Context**
```typescript
// Pass user context to AI
const aiContext = {
  userId: user.sub,
  brand: user['https://aura-commerce.com/brand'],
  roles: user['https://aura-commerce.com/roles'],
  organizationId: user['https://aura-commerce.com/organization_id'],
  isPremium: user['https://aura-commerce.com/is_premium'],
  permissions: await getUserPermissions(user.sub)
};

// Send to AI service
const aiResponse = await aiService.chat(message, aiContext);
```

### **2. Context-Aware AI Responses**
```typescript
function generateAIResponse(message: string, context: AIContext) {
  if (context.brand === 'luxeloom' && context.isPremium) {
    return "Welcome to the VIP Lounge! You have exclusive access to early product releases.";
  }
  
  if (context.brand === 'aura-wholesale' && context.roles.includes('admin')) {
    return "As an admin, you can manage organization users and approve orders.";
  }
  
  return "How can I help you with your shopping needs?";
}
```

---

## 🚀 **Deployment Configuration**

### **Environment Variables**
```bash
# Frontend (.env.local)
NEXT_PUBLIC_AUTH0_DOMAIN=your-tenant.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=your_client_id
NEXT_PUBLIC_AUTH0_AUDIENCE=https://api.auracommerce.com
NEXT_PUBLIC_API_URL=http://localhost:8000

# Backend (.env)
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_AUDIENCE=https://api.auracommerce.com
AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com
JWT_SECRET=your_jwt_secret
FGA_API_URL=https://api.fga.us.auth0.com
FGA_STORE_ID=your_store_id
FGA_CLIENT_ID=your_fga_client_id
FGA_CLIENT_SECRET=your_fga_client_secret
```

### **Production Considerations**
1. **Custom Domains**: Configure DNS for each brand domain
2. **SSL Certificates**: Ensure HTTPS for all domains
3. **Rate Limiting**: Implement API rate limiting
4. **Monitoring**: Set up Auth0 logs and analytics
5. **Backup**: Regular Auth0 tenant backups

---

## 📊 **Demo Scenarios**

### **Scenario 1: Multi-Brand Authentication**
1. Access different brand domains
2. Show different Auth0 configurations
3. Demonstrate brand-specific user experiences

### **Scenario 2: Role-Based Access**
1. Login as different user types
2. Show VIP Lounge access (premium users)
3. Demonstrate B2B admin capabilities

### **Scenario 3: Fine-Grained Authorization**
1. Show organization-based access control
2. Demonstrate order approval workflows
3. Test relationship-based permissions

### **Scenario 4: AI Integration**
1. Show context-aware AI responses
2. Demonstrate JWT claims integration
3. Test brand-specific AI behavior

---

## 🎯 **Key Benefits Demonstrated**

1. **Security**: Enterprise-grade authentication and authorization
2. **Scalability**: Multi-tenant architecture with custom domains
3. **User Experience**: Seamless authentication across brands
4. **Compliance**: Fine-grained access control for enterprise needs
5. **Integration**: AI-powered experiences with user context
6. **Modern Stack**: TypeScript, Next.js, and modern development patterns

---

## 📁 **Project Structure**

```
aura-commerce-demo/
├── frontend/                 # Next.js application
│   ├── app/                 # App Router pages
│   ├── components/          # React components
│   │   ├── providers/       # Context providers
│   │   ├── auth/           # Authentication components
│   │   ├── layout/         # Layout components
│   │   ├── home/           # Home page components
│   │   └── ai/             # AI assistant components
│   ├── lib/                # Utility functions
│   ├── types/              # TypeScript types
│   └── styles/             # Global styles
├── backend/                 # Express.js API
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── routes/         # API routes
│   │   └── types/          # TypeScript types
│   └── data/               # Mock data
├── shared/                  # Shared types and configs
├── docs/                    # Documentation
├── README.md               # Project overview
├── DEMO_GUIDE.md          # Demo instructions
└── AUTH0_INTEGRATION_GUIDE.md  # This file
```

---

## 🔧 **Quick Start Commands**

```bash
# Install dependencies
cd frontend && npm install
cd ../backend && npm install

# Start development servers
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm run dev

# Access the application
# Frontend: http://localhost:3001
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/api-docs
```

---

## 📞 **Support & Resources**

- **Auth0 Documentation**: https://auth0.com/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **Express.js Documentation**: https://expressjs.com/
- **FGA Documentation**: https://docs.auth0.com/fga

---

**Note**: This project serves as a comprehensive demonstration of Auth0's advanced capabilities in a real-world multi-brand retail scenario. For production use, ensure proper security measures, compliance requirements, and performance optimization are implemented.

---

*Last updated: August 2025*
