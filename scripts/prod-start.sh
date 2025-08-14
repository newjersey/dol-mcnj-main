#!/bin/bash
set -e

# Build everything
npm run build:only

# Kill any existing Next.js SSR process
# sudo fuser -k 3000/tcp || true

# Start Next.js SSR server
PORT=3000 npm run start &

# Wait a bit to ensure Next.js is up
sleep 5

# Start backend API (Express) - assumes build output is in backend/dist/server.js
cd backend
pm2 start dist/server.js --name dol-mcnj-backend --env production --watch
cd ..

echo "SSR proxy setup: API on :8080, Next.js SSR on :3000, all browser requests proxied to Next.js."
