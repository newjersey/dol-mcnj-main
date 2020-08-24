#!/bin/bash
echo """
runtime: nodejs10
env_variables:
  DB_USER: postgres
  DB_PASS: \"$DB_PASS\"
  DB_NAME: \"$DB_NAME\"
  DB_ENV: \"$DB_ENV\"
  CLOUD_SQL_CONNECTION_NAME: \"$CLOUD_SQL_CONNECTION_NAME\"
  ZIPCODE_API_KEY: \"$ZIPCODE_API_KEY\"
  ZIPCODE_BASEURL: \"$ZIPCODE_BASEURL\"
"""