#!/usr/bin/env bash

cd backend
./app.yaml.sh > app.yaml
gcloud app deploy