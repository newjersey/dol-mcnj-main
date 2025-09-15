#!/bin/bash
set -e

echo "🔨 Building applications..."
# Build both Next.js and backend
npm run build:only

echo "🧹 Cleaning up existing processes..."
# Stop and delete any existing PM2 processes
pm2 delete all || true

echo "🚀 Starting applications with PM2..."
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
