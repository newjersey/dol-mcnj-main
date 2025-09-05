#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -e

# Change directory to the git repository root
cd $(git rev-parse --show-toplevel)

# Run linters
npm run lint
cd backend && npm run lint && cd ..

# Run fence checks (only backend has fences in this structure)
npm --prefix=backend run fences

# Run Jest tests and ensure failure on error
npm run test -- --watchAll=false
npm --prefix=backend run test -- --no-cache

echo "  _            _                             _"
echo " | |          | |                           | |"
echo " | |_ ___  ___| |_ ___   _ __   __ _ ___ ___| |"
echo " | __/ _ \/ __| __/ __| | '_ \ / _\` / __/ __| |"
echo " | ||  __/\__ \ |_\__ \ | |_) | (_| \__ \__ \_|"
echo "  \__\___||___/\__|___/ | .__/ \__,_|___/___(_)"
echo "                        | |"
echo "                        |_|"
