#!/usr/bin/env bash

echo "Debug: Moving to the git repository's root directory..."
cd $(git rev-parse --show-toplevel) || { echo "Failed to change directory to the git repository's root. Exiting..."; exit 1; }

APP_PORT=8080
echo "Debug: Using application port ${APP_PORT}."

echo "Debug: Killing any process currently using port ${APP_PORT}..."
kill $(lsof -i:${APP_PORT} -t) || echo "No process to kill on port ${APP_PORT}."

set -e

echo "Debug: Starting the application..."
./scripts/build.sh
if [ $? -ne 0 ]; then
    echo "Build failed, exiting..."
    exit 1
fi
./scripts/prod-start-local.sh > /dev/null &
echo "Debug: Waiting for the application to start listening on port ${APP_PORT}..."
while ! echo exit | nc localhost ${APP_PORT}; do
    echo "Debug: Application not yet ready, sleeping for 1 second..."
    sleep 1
done

echo "Debug: Application has started."

echo "Debug: Running Cypress tests..."
npm --prefix=frontend run cypress:run -- --config baseUrl=http://localhost:${APP_PORT}

set +e

echo "Debug: Killing any process currently using port ${APP_PORT}..."
kill $(lsof -i:${APP_PORT} -t) || echo "No process to kill on port ${APP_PORT}."

echo "   __            _                                             _"
echo "  / _| ___  __ _| |_ _   _ _ __ ___  ___   _ __   __ _ ___ ___| |"
echo " | |_ / _ \/ _\` | __| | | | '__/ _ \/ __| | '_ \ / _\` / __/ __| |"
echo " |  _|  __/ (_| | |_| |_| | | |  __/\__ \ | |_) | (_| \__ \__ \_|"
echo " |_|  \___|\__,_|\__|\__,_|_|  \___||___/ | .__/ \__,_|___/___(_)"
echo "                                          |_|                    "
echo ""