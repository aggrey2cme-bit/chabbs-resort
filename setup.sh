#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# CHABBS Resort Management System — Setup Script
# ═══════════════════════════════════════════════════════════════
# Run: chmod +x setup.sh && ./setup.sh

echo ""
echo "  ✟  CHABBS Resort & Conference Centre"
echo "     Management System v2.0"
echo "     Lodwar · Turkana County · Kenya"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required. Install from https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  Node.js 18+ required. You have $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ npm install failed. Check your internet connection."
    exit 1
fi

echo ""
echo "✅ Dependencies installed successfully"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  🚀 Ready! Start the development server:"
echo ""
echo "     npm run dev"
echo ""
echo "  Then open http://localhost:3000"
echo ""
echo "  Login PINs:"
echo "  👑 Admin: 1234    🛎 Reception: 5678"
echo "  🧹 Housekeep: 9012  🔧 Maintenance: 3456"
echo "  👨‍🍳 Kitchen: 7890  🎯 Sales: 2345"
echo "  🌿 Grounds: 6789"
echo ""
echo "  ✟ Commit your work to the Lord — Prov 16:3"
echo ""
