#!/usr/bin/env bash

set -e

npm --prefix=frontend run lint
npm --prefix=backend run lint

npm --prefix=frontend run test:ci
npm --prefix=backend run test