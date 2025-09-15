#!/bin/bash
set -e

echo "Building Next.js frontend to backend/build directory..."
npx next build

echo "Building backend TypeScript..."
cd backend
npm run build

# Verify the build was successful
if [ ! -f "dist/server.js" ]; then
    echo "❌ Error: Backend build failed - dist/server.js not found"
    exit 1
fi

echo "✅ Backend build successful - server.js found"
cd ..

echo "Starting Express server with integrated Next.js build..."
cd backend
# Kill any existing processes on the ports
sudo fuser -k 8080/tcp || true
sudo fuser -k 3000/tcp || true

# Start the Express server which now serves both API and frontend
pm2 start dist/server.js --name dol-mcnj-full-stack --env production --watch

cd ..

echo "Full-stack setup complete: Express server running on :8080 serving both API and Next.js frontend."
