#!/usr/bin/env bash

cd $(git rev-parse --show-toplevel)

source ./backend/.env

ENV=${NODE_ENV}
HOST_ENV_VAR=$(jq -r ".${ENV}.writer.host.ENV" backend/database.json)

# Check for encoded password and fallback to regular password if not present
PASSWORD_ENCODED=$(jq -r ".${ENV}.writer.password_encoded.ENV" backend/database.json)
if [[ "$PASSWORD_ENCODED" != "null" ]]; then
    PASSWORD_ENV_VAR=$PASSWORD_ENCODED
else
    PASSWORD_ENV_VAR=$(jq -r ".${ENV}.writer.password.ENV" backend/database.json)
fi

DB_NAME=$(jq -r ".${ENV}.writer.database" backend/database.json)

DB_HOST=${!HOST_ENV_VAR}
DB_PASSWORD=${!PASSWORD_ENV_VAR}

DATABASE_URL="postgresql://postgres:${DB_PASSWORD}@$DB_HOST:5432/$DB_NAME"
export DATABASE_URL
npm --prefix=backend run db-migrate up