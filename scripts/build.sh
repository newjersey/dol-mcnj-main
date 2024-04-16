#!/usr/bin/env bash

echo "Debug: Setting script to exit on error."
set -e

echo "Debug: Changing to the git repository's root directory..."
cd $(git rev-parse --show-toplevel) || { echo "Failed to change directory to the git repository's root. Exiting..."; exit 1; }

echo "Debug: Building the frontend..."
npm --prefix=frontend run build
if [ $? -ne 0 ]; then
    echo "Frontend build failed, exiting..."
    exit 1
fi
echo "Debug: running react-snap..."

npx react-snap

echo "Debug: ran react-snap..."

echo "Debug: Building the backend..."
npm --prefix=backend run build
if [ $? -ne 0 ]; then
    echo "Backend build failed, exiting..."
    exit 1
fi

echo "Debug: Moving frontend build to backend distribution folder..."
mv frontend/build backend/dist || { echo "Move operation failed. Exiting..."; exit 1; }

echo "Debug: Move successful. Script completed."
