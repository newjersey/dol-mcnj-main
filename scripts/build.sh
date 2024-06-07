#!/usr/bin/env bash

set -e

# Source the .env file
source ./backend/.env

# Export NODE_OPTIONS from the sourced environment variables
export NODE_OPTIONS

cd $(git rev-parse --show-toplevel)
npm --prefix=frontend run build
npm --prefix=backend run build

mv frontend/build backend/dist