#!/usr/bin/env bash

set -e

cd $(git rev-parse --show-toplevel)

lsof -t -i :8080 | xargs kill

# Start the backend server in the background
npm --prefix=backend run start:dev &

# Store the backend server's process ID
BACKEND_PID=$!

# Wait for the backend server to become active (adjust sleep time as necessary)
sleep 10

# Build the frontend and run react-snap
npm --prefix=frontend run build

# Stop the backend server
kill $BACKEND_PID

# Build the backend
npm --prefix=backend run build

# Move frontend build to backend distribution directory
mv frontend/build backend/dist
