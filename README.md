# Aura Commerce Group - Multi-Brand Retail Platform

A comprehensive full-stack demo showcasing Auth0's advanced capabilities with modern AI integration for a fictional multi-brand retail company.

## 🏢 Company Overview

**Aura Commerce Group** is a fictional multi-brand retail company with three distinct brands:

- **LuxeLoom** (www.luxeloom.com) - High-end fashion and accessories
- **UrbanMarket** (www.urbanmarket.com) - Fast-fashion and everyday essentials  
- **Aura Wholesale** (b2b.auracommerce.com) - B2B portal for bulk orders

## 🚀 Features

### Multi-Brand Frontend
- Single codebase serving three distinct brand experiences
- Custom domain-based branding (colors, logos, fonts)
- Responsive design optimized for all devices
- Product catalog with search and filtering

### Authentication & Authorization (Auth0 Integration)
- **Multi-domain Auth0 configuration** for custom domains
- **Standard authentication**: Email/password login
- **Social login**: Google, Apple, Facebook integration
- **Passwordless authentication**: Magic links and OTP
- **Account linking**: B2C social media linking, B2B corporate identity linking
- **Fine-grained authorization (FGA)**:
  - B2C: Premium member roles, wishlist features
  - B2B: Role-based (buyer/admin) and relationship-based permissions

### AI Assistant Integration
- Persistent chat widget across all brands
- Context-aware responses based on user authentication state
- Product recommendations and customer support
- Order status inquiries and corporate discount information

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **React Hook Form** - Form handling
- **Zustand** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **JWT** - Token handling
- **CORS** - Cross-origin resource sharing

### Authentication & AI
- **Auth0** - Identity platform (placeholder integration)
- **OpenAI API** - AI assistant (placeholder integration)

## 📁 Project Structure

```
aura-commerce-demo/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # App Router pages
│   ├── components/          # Reusable React components
│   ├── lib/                 # Utility functions and configurations
│   ├── styles/              # Global styles and Tailwind config
│   └── types/               # TypeScript type definitions
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Custom middleware
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   └── types/           # TypeScript types
│   └── data/                # Mock data
├── shared/                  # Shared types and utilities
└── docs/                    # Documentation and configuration examples
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd aura-commerce-demo
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install
   
   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Frontend environment
   cp frontend/.env.example frontend/.env.local
   
   # Backend environment
   cp backend/.env.example backend/.env
   ```

4. **Start the development servers**
   ```bash
   # Terminal 1: Start backend
   cd backend
   npm run dev
   
   # Terminal 2: Start frontend
   cd frontend
   npm run dev
   ```

5. **Access the applications**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/api-docs

## 🔧 Configuration

### Auth0 Setup (Placeholder)

The project includes placeholder configurations for Auth0 integration:

1. **Multi-domain configuration** in `frontend/lib/auth0-config.ts`
2. **Custom domain mapping** for each brand
3. **Role and permission definitions** in `backend/src/config/auth0-roles.ts`
4. **FGA policies** in `backend/src/config/fga-policies.ts`

### AI Assistant Setup (Placeholder)

AI integration is configured in:
- `frontend/components/AIAssistant.tsx` - Chat widget component
- `backend/src/services/ai-service.ts` - AI service integration
- `backend/src/controllers/ai-controller.ts` - AI API endpoints

## 🎯 Demo Scenarios

### B2C User Journey (LuxeLoom/UrbanMarket)
1. **Guest browsing**: View products, search, filter
2. **Registration**: Sign up with email or social login
3. **Authentication**: Login with various methods
4. **Premium features**: Access VIP lounge (LuxeLoom premium members)
5. **Wishlist**: Add/remove items (authenticated users only)
6. **AI assistance**: Get product recommendations and support

### B2B User Journey (Aura Wholesale)
1. **Corporate registration**: Sign up with business credentials
2. **Role assignment**: Buyer or Admin role
3. **Order management**: Create and track bulk orders
4. **User management**: Admins can manage team members
5. **Corporate discounts**: View and apply business pricing
6. **AI assistance**: Get order status and business insights

## 🔐 Security Features

- **JWT token validation** on all protected routes
- **Role-based access control** (RBAC)
- **Fine-grained authorization** (FGA) for B2B scenarios
- **CORS configuration** for multi-domain support
- **Input validation** and sanitization
- **Rate limiting** on API endpoints

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Token refresh
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - List products with filtering
- `GET /api/products/:id` - Get product details
- `GET /api/products/search` - Search products

### Orders
- `GET /api/orders` - List user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id` - Update order (B2B admin only)

### AI Assistant
- `POST /api/ai/chat` - Send message to AI assistant
- `GET /api/ai/context` - Get AI context for user

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm run test

# Backend tests
cd backend
npm run test
```

## 📝 Development Notes

### Auth0 Integration Points
- **Frontend**: Authentication hooks, protected routes, user context
- **Backend**: JWT validation, role checking, FGA enforcement
- **Multi-domain**: Custom domain detection and brand-specific configs

### AI Integration Points
- **Frontend**: Chat widget, user context injection
- **Backend**: AI service calls, user data enrichment
- **Personalization**: Role-based and user-specific responses

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is for demonstration purposes only.

## 🆘 Support

For questions about this demo or Auth0 integration, please refer to:
- [Auth0 Documentation](https://auth0.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)
