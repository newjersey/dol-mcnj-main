#!/usr/bin/env bash

set -e

cd $(git rev-parse --show-toplevel)
npm --prefix=frontend run build
npm --prefix=backend run build

# Temporarily move built files
TEMP_DIR=$(mktemp -d)
mv frontend/build $TEMP_DIR

# Atomically switch the new build into place
rm -rf backend/dist
mv $TEMP_DIR/build backend/dist
