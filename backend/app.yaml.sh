#!/bin/bash
echo """
runtime: nodejs18
resources:
  cpu: 2
  memory_gb: 8
env_variables:
  DB_USER: postgres
  DB_PASS: \"$DB_PASS\"
  DB_NAME: \"$DB_NAME\"
  DB_ENV: \"$DB_ENV\"
  CLOUD_SQL_CONNECTION_NAME: \"$CLOUD_SQL_CONNECTION_NAME\"
  ONET_BASEURL: \"$ONET_BASEURL\"
  ONET_USERNAME: \"$ONET_USERNAME\"
  ONET_PASSWORD: \"$ONET_PASSWORD\"
  CAREER_ONESTOP_BASEURL: \"$CAREER_ONESTOP_BASEURL\"
  CAREER_ONESTOP_USERID: \"$CAREER_ONESTOP_USERID\"
  CAREER_ONESTOP_AUTH_TOKEN: \"$CAREER_ONESTOP_AUTH_TOKEN\"
  BASE_URL: \"$BASE_URL\"
  SPACE_ID: \"$SPACE_ID\"
  DELIVERY_API: \"$DELIVERY_API\"
  SENTRY_DSN: \"$SENTRY_DSN\"
  NODE_OPTIONS: --max_old_space_size=4096

  handlers:
  - url: /(.*\.(gif|png|jpg|css|js|ico|json|txt|svg|woff|woff2|ttf|eot))$
    static_files: dist/build/\1
    upload: dist/build/(.*\.(gif|png|jpg|css|js|ico|json|txt|svg|woff|woff2|ttf|eot))$
    secure: always

  - url: /(robots\.txt|favicon\.ico)$
    static_files: dist/build/\1
    upload: dist/build/(robots\.txt|favicon\.ico)$
    secure: always

  - url: /.*
    static_files: dist/build/index.html
    upload: dist/build/index.html
    secure: always
    http_headers:
      Strict-Transport-Security: 'max-age=31536000; includeSubDomains'
      X-Frame-Options: 'DENY'
      X-Content-Type-Options: 'nosniff'
      X-XSS-Protection: '1; mode=block'
"""
