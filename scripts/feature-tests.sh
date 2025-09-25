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

echo "==============================================="
echo "🚀 Starting application for feature tests"
echo "==============================================="
echo "starting app"
./scripts/build.sh

# Start backend (skip migrations for feature tests since DB should already be set up)
echo "Starting backend on port ${BACKEND_PORT}..."
cd backend
if [ "$CIRCLECI" = "true" ] || [ "$CI" = "true" ]; then
  # In CI, show output to console for debugging while also logging to file
  # Skip migrations for feature tests - they should already be run during CI setup
  echo "Starting backend without migrations (assuming DB is already set up)..."
  CIRCLECI=true CI=true DB_ENV=dev npm run start:no-migrate 2>&1 | tee backend.log &
else
  # In local development, just log to file and skip migrations too
  echo "Starting backend without migrations (assuming DB is already set up)..."
  CIRCLECI=true CI=true DB_ENV=dev npm run start:no-migrate > backend.log 2>&1 &
fi
BACKEND_PID=$!
cd ..

# Wait for backend to be ready with timeout
echo "Waiting for backend to be ready..."
BACKEND_READY=false
for i in {1..60}; do
  if echo exit | nc localhost ${BACKEND_PORT}; then
    BACKEND_READY=true
    break
  fi
  if [ $((i % 10)) -eq 0 ]; then
    echo "Backend not ready yet (attempt $i/60)... Still waiting..."
    # Show recent backend logs every 10 attempts in CI
    if [ "$CIRCLECI" = "true" ] || [ "$CI" = "true" ]; then
      echo "Recent backend logs:"
      tail -10 backend/backend.log 2>/dev/null || echo "No backend logs yet"
    fi
  fi
  sleep 2
done

if [ "$BACKEND_READY" = true ]; then
  echo "✅ Backend started successfully on port ${BACKEND_PORT}"
else
  echo "❌ Backend failed to start within timeout (120 seconds)"
  echo "Backend process status: $(ps -p $BACKEND_PID -o pid,ppid,state,etime,comm 2>/dev/null || echo 'Process not found')"
  echo "Full backend logs:"
  cat backend/backend.log 2>/dev/null || echo "No backend logs found"
  kill $BACKEND_PID 2>/dev/null || true
  exit 1
fi

# Start Next.js frontend
echo "Starting Next.js frontend on port ${FRONTEND_PORT}..."
if [ "$CIRCLECI" = "true" ] || [ "$CI" = "true" ]; then
  # In CI, show output to console for debugging while also logging to file
  PORT=${FRONTEND_PORT} npm start 2>&1 | tee frontend.log &
else
  # In local development, just log to file
  PORT=${FRONTEND_PORT} npm start > frontend.log 2>&1 &
fi
FRONTEND_PID=$!

# Wait for frontend to be ready with timeout
echo "Waiting for frontend to be ready..."
FRONTEND_READY=false
for i in {1..60}; do
  if echo exit | nc localhost ${FRONTEND_PORT}; then
    FRONTEND_READY=true
    break
  fi
  if [ $((i % 10)) -eq 0 ]; then
    echo "Frontend not ready yet (attempt $i/60)... Still waiting..."
    # Show recent frontend logs every 10 attempts in CI
    if [ "$CIRCLECI" = "true" ] || [ "$CI" = "true" ]; then
      echo "Recent frontend logs:"
      tail -10 frontend.log 2>/dev/null || echo "No frontend logs yet"
    fi
  fi
  sleep 2
done

if [ "$FRONTEND_READY" = true ]; then
  echo "✅ Frontend started successfully on port ${FRONTEND_PORT}"
else
  echo "❌ Frontend failed to start within timeout (120 seconds)"
  echo "Frontend process status: $(ps -p $FRONTEND_PID -o pid,ppid,state,etime,comm 2>/dev/null || echo 'Process not found')"
  echo "Full frontend logs:"
  cat frontend.log 2>/dev/null || echo "No frontend logs found"
  kill $FRONTEND_PID 2>/dev/null || true
  kill $BACKEND_PID 2>/dev/null || true
  exit 1
fi

echo "==============================================="
echo "🎯 Both frontend and backend ready - starting Cypress tests"
echo "==============================================="
echo "app started"

npm run cypress:run -- --config baseUrl=http://localhost:${FRONTEND_PORT}

set +e

echo "==============================================="
echo "🧹 Cleaning up processes and resources"
echo "==============================================="

# Kill the processes
echo "Stopping frontend (PID: $FRONTEND_PID)..."
kill $FRONTEND_PID 2>/dev/null || true
echo "Stopping backend (PID: $BACKEND_PID)..."
kill $BACKEND_PID 2>/dev/null || true

# Force kill any remaining processes on the ports
echo "Force killing any remaining processes on ports ${FRONTEND_PORT} and ${BACKEND_PORT}..."
kill $(lsof -i:${FRONTEND_PORT} -t) 2>/dev/null || true
kill $(lsof -i:${BACKEND_PORT} -t) 2>/dev/null || true

# In CI, preserve logs for artifact collection, in local development clean them up
if [ "$CIRCLECI" != "true" ] && [ "$CI" != "true" ]; then
  echo "Cleaning up log files..."
  rm -f frontend.log backend/backend.log
else
  echo "Preserving log files for CI artifact collection..."
fi

echo ""
echo "==============================================="
echo "✅ Feature tests completed successfully!"
echo "==============================================="
echo "   __            _                                             _"
echo "  / _| ___  __ _| |_ _   _ _ __ ___  ___   _ __   __ _ ___ ___| |"
echo " | |_ / _ \/ _\` | __| | | | '__/ _ \/ __| | '_ \ / _\` / __/ __| |"
echo " |  _|  __/ (_| | |_| |_| | | |  __/\__ \ | |_) | (_| \__ \__ \_|"
echo " |_|  \___|\__,_|\__|\__,_|_|  \___||___/ | .__/ \__,_|___/___(_)"
echo "                                          |_|                    "
echo ""
echo "Summary:"
echo "- Frontend served on port ${FRONTEND_PORT}"
echo "- Backend served on port ${BACKEND_PORT}" 
echo "- All processes cleaned up successfully"
if [ "$CIRCLECI" = "true" ] || [ "$CI" = "true" ]; then
  echo "- Startup logs preserved as CI artifacts"
fi
echo ""