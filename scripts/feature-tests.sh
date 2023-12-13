#!/usr/bin/env bash

cd $(git rev-parse --show-toplevel)

APP_PORT=8080

# Kill any process using the app port
kill $(lsof -i:${APP_PORT} -t) || true

set -e

echo "Starting app..."
./scripts/build.sh
./scripts/prod-start-local.sh & # Start the app in the background

echo "Waiting for app to start..."
while ! nc -z localhost ${APP_PORT}; do
  sleep 1 # wait for 1 second before check again
done

echo "App started"

echo "Running Cypress tests..."
npm --prefix=frontend run cypress:run -- --config baseUrl=http://localhost:${APP_PORT} | tee feature-test-output.txt

echo "Cypress tests completed"

# Clean up
kill $(lsof -i:${APP_PORT} -t)

echo "App stopped"

# Your ASCII art here
echo "   __            _                                             _"
echo "  / _| ___  __ _| |_ _   _ _ __ ___  ___   _ __   __ _ ___ ___| |"
echo " | |_ / _ \/ _` | __| | | | '__/ _ \/ __| | '_ \ / _` / __/ __| |"
echo " |  _|  __/ (_| | |_| |_| | | |  __/\__ \ | |_) | (_| \__ \
