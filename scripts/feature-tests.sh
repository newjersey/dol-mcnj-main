#!/usr/bin/env bash

cd $(git rev-parse --show-toplevel)

# Safety: Create dummy frontend directory if something tries to access it
if [ ! -d "frontend" ]; then
  mkdir -p frontend
  echo '{"name": "frontend-deprecated", "scripts": {"start": "echo ERROR: frontend deprecated, use root directory"}}' > frontend/package.json
fi

FRONTEND_PORT=3000
BACKEND_PORT=8080

# Kill any existing processes
kill $(lsof -i:${FRONTEND_PORT} -t) 2>/dev/null || true
kill $(lsof -i:${BACKEND_PORT} -t) 2>/dev/null || true

set -e

echo "starting app"
./scripts/build.sh

# Start backend
echo "Starting backend on port ${BACKEND_PORT}..."
cd backend
# Use DB_ENV from environment if set, otherwise default to dev
# For test environment, use start:no-migrate since we run migrations separately
if [[ "${DB_ENV:-dev}" == "test" ]]; then
  DB_ENV=${DB_ENV:-dev} npm run start:no-migrate > /dev/null &
else
  DB_ENV=${DB_ENV:-dev} npm start > /dev/null &
fi
BACKEND_PID=$!
cd ..

# Wait for backend to be ready
while ! echo exit | nc localhost ${BACKEND_PORT}; do sleep 1; done
echo "Backend started on port ${BACKEND_PORT}"

# Start Next.js frontend
echo "Starting Next.js frontend on port ${FRONTEND_PORT}..."
PORT=${FRONTEND_PORT} npm start > /dev/null &
FRONTEND_PID=$!

# Wait for frontend to be ready
while ! echo exit | nc localhost ${FRONTEND_PORT}; do sleep 1; done
echo "Frontend started on port ${FRONTEND_PORT}"

echo "app started"

npm run cypress:run -- --config baseUrl=http://localhost:${FRONTEND_PORT}

set +e

# Kill the processes
kill $FRONTEND_PID 2>/dev/null || true
kill $BACKEND_PID 2>/dev/null || true
kill $(lsof -i:${FRONTEND_PORT} -t) 2>/dev/null || true
kill $(lsof -i:${BACKEND_PORT} -t) 2>/dev/null || true

echo "   __            _                                             _"
echo "  / _| ___  __ _| |_ _   _ _ __ ___  ___   _ __   __ _ ___ ___| |"
echo " | |_ / _ \/ _\` | __| | | | '__/ _ \/ __| | '_ \ / _\` / __/ __| |"
echo " |  _|  __/ (_| | |_| |_| | | |  __/\__ \ | |_) | (_| \__ \__ \_|"
echo " |_|  \___|\__,_|\__|\__,_|_|  \___||___/ | .__/ \__,_|___/___(_)"
echo "                                          |_|                    "
echo ""