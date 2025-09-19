#!/usr/bin/env bash

set -e

cd $(git rev-parse --show-toplevel)

echo "🔨 Building Next.js frontend to backend/build..."
npx next build

echo "🔨 Building backend TypeScript..."
npm --prefix=backend run build

echo "✅ Build successfully completed."
echo "📁 Frontend built to: backend/build/"
echo "📁 Backend built to: backend/dist/"
echo "🚀 Start with: cd backend && npm start"
