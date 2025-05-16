#!/usr/bin/env bash

set -e

cd $(git rev-parse --show-toplevel)
npm --prefix=frontend run build
npm --prefix=backend run build

rm -rf backend/dist_old
mv backend/dist backend/dist_old 2>/dev/null
mv backend/dist_temp backend/dist
mv frontend/build backend/dist

echo "✅ Build successfully completed."
