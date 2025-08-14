#!/bin/bash

# Development script with ngrok tunnel for Auth0 ACUL testing
# This script starts the Next.js dev server and creates a public tunnel

echo "🚀 Starting Auth0 ACUL development environment..."

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "❌ ngrok is not installed. Please install it first:"
    echo "   npm install -g ngrok"
    echo "   or visit: https://ngrok.com/download"
    exit 1
fi

# Check if port 3000 is available
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 3000 is already in use. Please stop any running servers."
    exit 1
fi

# Start Next.js development server in background
echo "📦 Starting Next.js development server..."
npm run dev &
NEXT_PID=$!

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 5

# Start ngrok tunnel
echo "🌐 Starting ngrok tunnel..."
ngrok http 3000 --log=stdout > ngrok.log 2>&1 &
NGROK_PID=$!

# Wait for ngrok to start and get the URL
sleep 3
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[0].public_url')

if [ "$NGROK_URL" = "null" ] || [ -z "$NGROK_URL" ]; then
    echo "❌ Failed to get ngrok URL. Check ngrok.log for details."
    kill $NEXT_PID $NGROK_PID 2>/dev/null
    exit 1
fi

echo "✅ ngrok tunnel created: $NGROK_URL"
echo ""
echo "🔧 Auth0 Configuration:"
echo "   Allowed Callback URLs: $NGROK_URL/callback"
echo "   Allowed Logout URLs: $NGROK_URL"
echo "   Allowed Web Origins: $NGROK_URL"
echo ""
echo "🌍 Test your ACUL pages:"
echo "   Login: $NGROK_URL/login"
echo "   Callback: $NGROK_URL/callback"
echo "   Logout: $NGROK_URL/logout"
echo ""
echo "📝 Update your Auth0 Dashboard with the URLs above"
echo "🛑 Press Ctrl+C to stop all services"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $NEXT_PID $NGROK_PID 2>/dev/null
    echo "✅ Services stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Keep script running
wait
