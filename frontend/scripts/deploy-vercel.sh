#!/bin/bash

# Vercel deployment script for Auth0 ACUL
# This script deploys your ACUL pages to Vercel and configures the necessary settings

set -e

echo "🚀 Deploying Auth0 ACUL to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Installing now..."
    npm install -g vercel
fi

# Check if we're in the frontend directory
if [ ! -f "package.json" ] || [ ! -f "next.config.js" ]; then
    echo "❌ Please run this script from the frontend directory"
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found. Creating template..."
    cat > .env.local << EOF
# Auth0 Configuration
NEXT_PUBLIC_AUTH0_DOMAIN=your-tenant.auth0.com
NEXT_PUBLIC_AUTH0_AUDIENCE=https://api.auracommerce.com

# Brand-specific configurations
NEXT_PUBLIC_LUXELOOM_DOMAIN=luxeloom.auth0.com
NEXT_PUBLIC_LUXELOOM_CLIENT_ID=your_luxeloom_client_id
NEXT_PUBLIC_URBANMARKET_DOMAIN=urbanmarket.auth0.com
NEXT_PUBLIC_URBANMARKET_CLIENT_ID=your_urbanmarket_client_id
NEXT_PUBLIC_AURA_WHOLESALE_DOMAIN=aura-wholesale.auth0.com
NEXT_PUBLIC_AURA_WHOLESALE_CLIENT_ID=your_aura_wholesale_client_id

# API Configuration
NEXT_PUBLIC_API_URL=https://your-api-domain.com
EOF
    echo "📝 Please update .env.local with your actual Auth0 credentials"
    echo "   Then run this script again."
    exit 1
fi

# Deploy to Vercel
echo "📦 Deploying to Vercel..."
vercel --prod

# Get the deployment URL
DEPLOYMENT_URL=$(vercel ls | grep "aura-commerce-acul" | head -1 | awk '{print $2}')

if [ -z "$DEPLOYMENT_URL" ]; then
    echo "❌ Failed to get deployment URL"
    exit 1
fi

echo ""
echo "✅ Deployment successful!"
echo "🌐 Your ACUL pages are now available at: $DEPLOYMENT_URL"
echo ""
echo "🔧 Auth0 Configuration URLs:"
echo "   Allowed Callback URLs: $DEPLOYMENT_URL/callback"
echo "   Allowed Logout URLs: $DEPLOYMENT_URL"
echo "   Allowed Web Origins: $DEPLOYMENT_URL"
echo ""
echo "🧪 Test your ACUL pages:"
echo "   Login: $DEPLOYMENT_URL/login"
echo "   Callback: $DEPLOYMENT_URL/callback"
echo "   Logout: $DEPLOYMENT_URL/logout"
echo ""
echo "📝 Update your Auth0 Dashboard with the URLs above"
echo ""
echo "🔗 Vercel Dashboard: https://vercel.com/dashboard"
echo ""

# Ask if user wants to set up custom domains
read -p "🤔 Do you want to set up custom domains for your brands? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌐 Setting up custom domains..."
    
    # Add custom domains
    vercel domains add www.luxeloom.com
    vercel domains add www.urbanmarket.com
    vercel domains add b2b.auracommerce.com
    
    echo ""
    echo "✅ Custom domains configured!"
    echo "🔧 Production Auth0 Configuration URLs:"
    echo ""
    echo "LuxeLoom:"
    echo "   Allowed Callback URLs: https://www.luxeloom.com/callback"
    echo "   Allowed Logout URLs: https://www.luxeloom.com"
    echo "   Allowed Web Origins: https://www.luxeloom.com"
    echo ""
    echo "UrbanMarket:"
    echo "   Allowed Callback URLs: https://www.urbanmarket.com/callback"
    echo "   Allowed Logout URLs: https://www.urbanmarket.com"
    echo "   Allowed Web Origins: https://www.urbanmarket.com"
    echo ""
    echo "Aura Wholesale:"
    echo "   Allowed Callback URLs: https://b2b.auracommerce.com/callback"
    echo "   Allowed Logout URLs: https://b2b.auracommerce.com"
    echo "   Allowed Web Origins: https://b2b.auracommerce.com"
    echo ""
    echo "📝 Don't forget to configure DNS records for your domains!"
fi

echo ""
echo "🎉 ACUL deployment complete!"
echo "📚 Next steps:"
echo "   1. Update Auth0 Dashboard with the URLs above"
echo "   2. Test the authentication flow"
echo "   3. Configure your production environment variables"
echo "   4. Set up monitoring and analytics"
