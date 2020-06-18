#!/bin/bash
echo """
runtime: nodejs10
env_variables:
  DB_USER: postgres
  DB_PASS: \"$DB_PASS\"
  DB_NAME: d4addev
  DB_ENV: gcpdev
  CLOUD_SQL_CONNECTION_NAME: d4ad-dev:us-east4:d4ad-dev-gcp-pg
"""