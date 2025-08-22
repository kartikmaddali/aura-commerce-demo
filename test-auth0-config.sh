#!/bin/bash

echo "🔧 Testing Auth0 Configuration"
echo "================================"

# Test 1: Check if Auth0 domain is accessible
echo "1. Testing Auth0 domain accessibility..."
if curl -s -o /dev/null -w "%{http_code}" https://km-personal-demo.us.auth0.com | grep -q "200\|302"; then
    echo "✅ Auth0 domain is accessible"
else
    echo "❌ Auth0 domain is not accessible"
fi

# Test 2: Check OpenID configuration
echo "2. Testing OpenID configuration..."
OPENID_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://km-personal-demo.us.auth0.com/.well-known/openid_configuration)
if [ "$OPENID_STATUS" = "200" ]; then
    echo "✅ OpenID configuration is working"
    echo "   OpenID Config URL: https://km-personal-demo.us.auth0.com/.well-known/openid_configuration"
else
    echo "❌ OpenID configuration returns $OPENID_STATUS"
    echo "   This means the Auth0 tenant needs proper configuration"
fi

# Test 3: Check environment variables
echo "3. Checking environment variables..."
if [ -f "frontend/.env.local" ]; then
    echo "✅ Frontend .env.local exists"
    echo "   Contents:"
    cat frontend/.env.local | grep -v "^#" | grep -v "^$"
else
    echo "❌ Frontend .env.local not found"
fi

if [ -f "backend/.env" ]; then
    echo "✅ Backend .env exists"
    echo "   Contents:"
    cat backend/.env | grep -v "^#" | grep -v "^$"
else
    echo "❌ Backend .env not found"
fi

echo ""
echo "📋 Next Steps:"
echo "1. Follow the AUTH0_SETUP_FIX.md guide"
echo "2. Create the API and applications in Auth0 Dashboard"
echo "3. Update the client IDs in environment files"
echo "4. Test the authentication flow"

echo ""
echo "🔗 Useful Links:"
echo "- Auth0 Dashboard: https://manage.auth0.com/dashboard/us/km-personal-demo"
echo "- OpenID Config: https://km-personal-demo.us.auth0.com/.well-known/openid_configuration"
echo "- Setup Guide: AUTH0_SETUP_FIX.md"
