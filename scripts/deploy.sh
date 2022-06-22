#!/usr/bin/env bash

cd backend
./app.yaml.sh > app.yaml
gcloud app deploy

versions=$(gcloud app versions list \
  --service default \
  --sort-by '~VERSION.ID' \
  --format 'value(VERSION.ID)' | sed 1,5d)
for version in $versions; do
  gcloud app versions delete "$version" \
    --service default \
    --quiet
done