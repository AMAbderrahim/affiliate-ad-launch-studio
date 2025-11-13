#!/bin/bash

echo "🔍 Checking Affiliate Ad Studio Setup..."
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found"
    echo "   Run: cp .env.example .env.local"
    echo ""
    exit 1
else
    echo "✅ .env.local file exists"
fi

# Check if variables are set
if grep -q "REACT_APP_GOOGLE_CLIENT_ID=..*" .env.local; then
    echo "✅ Google Client ID is configured"
else
    echo "❌ Google Client ID is not configured"
    echo "   Add your client ID to .env.local"
fi

if grep -q "REACT_APP_AGENT_WORKER=..*" .env.local; then
    echo "✅ Worker endpoint is configured"
else
    echo "❌ Worker endpoint is not configured"
    echo "   Add your worker URL to .env.local"
fi

echo ""
echo "📚 See ADMIN_SETUP.md for detailed instructions"
echo ""
