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

# Decode URL-encoded passwords if needed
if [[ "$PASSWORD_ENV_VAR" == *"ENCODED"* && -n "$DB_PASSWORD" ]]; then
    # Check if password appears to be URL-encoded (contains % followed by hex digits)
    if [[ "$DB_PASSWORD" =~ %[0-9A-Fa-f]{2} ]]; then
        echo "Detected URL-encoded password, decoding..."
        DB_PASSWORD=$(python3 -c "import urllib.parse; print(urllib.parse.unquote('$DB_PASSWORD'))" 2>/dev/null) || {
            echo "Warning: Failed to URL-decode password, using as-is"
        }
    fi
fi

DATABASE_URL="postgresql://postgres:${DB_PASSWORD}@$DB_HOST:5432/$DB_NAME"
export DATABASE_URL

echo "Running incremental migration for environment: $ENV"
echo "Database: $DB_NAME on $DB_HOST"
echo "DATABASE_URL: postgresql://postgres:***@$DB_HOST:5432/$DB_NAME"

# Test the connection before running db-migrate
echo "Testing connection to database..."
if [[ -z "$DB_PASSWORD" ]]; then
    psql -U postgres -h "$DB_HOST" -d "$DB_NAME" -c "SELECT 1;" > /dev/null 2>&1
else
    PGPASSWORD="$DB_PASSWORD" psql -U postgres -h "$DB_HOST" -d "$DB_NAME" -c "SELECT 1;" > /dev/null 2>&1
fi

if [[ $? -eq 0 ]]; then
    echo "✅ Direct connection successful"
else
    echo "❌ Direct connection failed"
    echo "Trying to diagnose the issue..."
    echo "DB_HOST: '$DB_HOST'"
    echo "DB_NAME: '$DB_NAME'"
    echo "Password set: ${DB_PASSWORD:+YES}"
fi

npm --prefix=backend run db-migrate up