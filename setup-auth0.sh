#!/bin/bash

# Auth0 Setup Script for Local Development
# This script helps you configure Auth0 environment variables

echo "🔐 Auth0 Integration Setup for Local Development"
echo "================================================"
echo ""

# Check if .env.local exists in frontend
if [ ! -f "frontend/.env.local" ]; then
    echo "📝 Creating frontend/.env.local..."
    cat > frontend/.env.local << EOF
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
EOF
    echo "✅ Created frontend/.env.local"
else
    echo "⚠️  frontend/.env.local already exists"
fi

# Check if .env exists in backend
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating backend/.env..."
    cat > backend/.env << EOF
# Auth0 Configuration
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=your_backend_client_id
AUTH0_CLIENT_SECRET=your_backend_client_secret
AUTH0_AUDIENCE=https://api.auracommerce.com
AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_$(openssl rand -hex 32)

# Server Configuration
PORT=8000
NODE_ENV=development
EOF
    echo "✅ Created backend/.env"
else
    echo "⚠️  backend/.env already exists"
fi

echo ""
echo "🎯 Next Steps:"
echo "=============="
echo ""
echo "1. 📋 Create Auth0 Applications:"
echo "   - Go to https://manage.auth0.com/"
echo "   - Create 'Single Page Application' for frontend"
echo "   - Create 'Machine to Machine Application' for backend"
echo ""
echo "2. ⚙️  Configure Auth0 Settings:"
echo "   - Allowed Callback URLs: http://localhost:3000/callback"
echo "   - Allowed Logout URLs: http://localhost:3000"
echo "   - Allowed Web Origins: http://localhost:3000"
echo "   - Copy Client ID and Client Secret for backend M2M app"
echo ""
echo "3. 🔧 Update Environment Variables:"
echo "   - Edit frontend/.env.local with your Auth0 credentials"
echo "   - Edit backend/.env with your Auth0 credentials"
echo ""
echo "4. 🧪 Test the Integration:"
echo "   - Restart your development servers"
echo "   - Visit http://localhost:3000/login"
echo "   - Complete the authentication flow"
echo ""
echo "📚 For detailed instructions, see: AUTH0_INTEGRATION_STEPS.md"
echo ""
echo "🔗 Useful URLs:"
echo "   - Auth0 Dashboard: https://manage.auth0.com/"
echo "   - Local Frontend: http://localhost:3000"
echo "   - Local Backend: http://localhost:8000"
echo "   - API Docs: http://localhost:8000/api-docs"
echo ""
