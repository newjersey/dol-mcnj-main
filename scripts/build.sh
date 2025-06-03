#!/usr/bin/env bash

set -e

cd $(git rev-parse --show-toplevel)
npm --prefix=frontend run build
npm --prefix=backend run build

rm -rf backend/dist_old || true
[ -d backend/dist ] && mv backend/dist backend/dist_old

mv backend/dist_temp backend/dist
mv frontend/build backend/dist

echo "✅ Build successfully completed."
