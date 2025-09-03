#!/usr/bin/env bash

set -e

cd $(git rev-parse --show-toplevel)
npm run build:prod
npm --prefix=backend run build