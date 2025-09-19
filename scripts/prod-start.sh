#!/bin/bash
set -e

echo "🔨 Building applications..."
# Build both Next.js and backend
npm run build:only

echo "🔍 Verifying backend build..."
if [ ! -f "backend/dist/server.js" ]; then
    echo "❌ Backend build failed - server.js not found!"
    echo "📁 Contents of backend/dist:"
    ls -la backend/dist/ || echo "dist directory doesn't exist"
    exit 1
fi
echo "✅ Backend build verified"

echo "🧹 Cleaning up existing processes..."
# Kill any existing processes on the ports
sudo fuser -k 3000/tcp || true
sudo fuser -k 8080/tcp || true

# Stop and delete any existing PM2 processes
pm2 delete all || true
pm2 kill || true

# Wait a moment for processes to fully terminate
sleep 3

echo "🔄 Restarting PM2 daemon..."
pm2 resurrect || true

echo "🚀 Starting applications with PM2..."
# Export the NODE_ENV to ensure it's available
export NODE_ENV=awstest
# Start both applications using the ecosystem config
pm2 start ecosystem.config.js

echo "💾 Saving PM2 configuration..."
pm2 save

echo "📊 Process status:"
pm2 status

echo ""
echo "✅ Deployment complete!"
echo "🌐 Frontend (Next.js): http://localhost:3000"
echo "🔌 Backend (Express): http://localhost:8080"
echo "🌍 Public site should be accessible at your domain"
echo ""
echo "📝 Useful commands:"
echo "  npm run status:prod   - Check process status"
echo "  npm run logs:prod     - View all logs"
echo "  npm run restart:prod  - Restart both services"
echo "  npm run stop:prod     - Stop all services"
