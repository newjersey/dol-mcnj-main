#!/usr/bin/env bash

set -e

# Always start from repo root
cd "$(git rev-parse --show-toplevel)"

# Build backend (if needed)
npm --prefix backend run build

# Build Next.js frontend (from root, NOT frontend/)
next build

# Optionally, start backend (uncomment if you want to start backend after build)
# npm --prefix backend run start

# Optionally, start Next.js app (uncomment if you want to start Next.js after build)
# next start