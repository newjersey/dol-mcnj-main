#!/usr/bin/env bash

set -e

cd $(git rev-parse --show-toplevel)
npm --prefix=frontend run build
npm --prefix=backend run build

mv frontend/build backend/dist