#!/usr/bin/env bash

cd $(git rev-parse --show-toplevel)
cd backend
./app.yaml.sh > app.yaml
gcloud app deploy