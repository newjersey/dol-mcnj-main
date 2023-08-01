#!/usr/bin/env bash

cd $(git rev-parse --show-toplevel)
ENV=${NODE_ENV}
HOST_ENV_VAR=$(jq -r ".${ENV}.writer.host.ENV" backend/database.json)
PASSWORD_ENV_VAR=$(jq -r ".${ENV}.writer.password.ENV" backend/database.json)
DB_NAME=$(jq -r ".${ENV}.writer.database" backend/database.json)

# Debug: Print the environment variables' names
echo "Host env var: $HOST_ENV_VAR"
echo "Password env var: $PASSWORD_ENV_VAR"
echo "Database name: $DB_NAME"

# Fetch the actual values from the environment variables
DB_HOST=${!HOST_ENV_VAR}
DB_PASSWORD=${!PASSWORD_ENV_VAR}

# Debug: Print the actual values fetched from the environment
echo "Database host: $DB_HOST"
echo "Database password: $DB_PASSWORD"

# Construct the PostgreSQL URL
DATABASE_URL="postgresql://postgres:$DB_PASSWORD@$DB_HOST:5432/$DB_NAME"

echo "Database URL: $DATABASE_URL"

# Export the DATABASE_URL environment variable
export DATABASE_URL

npm --prefix=backend run db-migrate up