#!/usr/bin/env bash

cd $(git rev-parse --show-toplevel)

source ./backend/.env

ENV=${NODE_ENV}
HOST_ENV_VAR=$(jq -r ".${ENV}.writer.host.ENV" backend/database.json)
PASSWORD_ENV_VAR=$(jq -r ".${ENV}.writer.password.ENV" backend/database.json)
DB_NAME=$(jq -r ".${ENV}.writer.database" backend/database.json)

# Debug: Print the environment variables' names
echo "NODE_ENV value: $ENV"
echo "Host env var: $HOST_ENV_VAR"
echo "Password env var: $PASSWORD_ENV_VAR"
echo "Database name: $DB_NAME"
DB_HOST=${!HOST_ENV_VAR}
DB_PASSWORD=${!PASSWORD_ENV_VAR}

echo "Database host: $DB_HOST"
echo "Database password length: ${#DB_PASSWORD}"

urlencode() {
    local encoded=""
    local char
    local hex

    for (( i=0; i<${#1}; i++ )); do
        char="${1:$i:1}"
        case "$char" in
            [a-zA-Z0-9.~_-]) encoded+="$char" ;;
            *) printf -v hex '%02X' "'$char"
               encoded+="%$hex"
               ;;
        esac
    done

    echo "$encoded"
}

ENCODED_DB_PASS=$(urlencode "$DB_PASSWORD")
echo "[DEBUG] Checking encoded password length: ${#ENCODED_DB_PASS}"

DATABASE_URL="postgresql://postgres:${ENCODED_DB_PASS}@$DB_HOST:5432/$DB_NAME"

export DATABASE_URL
echo "Database URL: $DATABASE_URL"

npm --prefix=backend run db-migrate up
