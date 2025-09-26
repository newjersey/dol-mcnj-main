#!/usr/bin/env bash

# Clean Database for Migration
# This script truncates all tables (except migrations) to prepare for fresh data migration

cd $(git rev-parse --show-toplevel)

# Source .env file if it exists
if [[ -f "./backend/.env" ]]; then
    source ./backend/.env
fi

# Set default environment if not specified
ENV=${NODE_ENV:-"dev"}

echo "Cleaning database for fresh migration..."
echo "Environment: $ENV"

# Get database configuration
HOST_ENV_VAR=$(jq -r ".${ENV}.writer.host.ENV" backend/database.json 2>/dev/null)
PASSWORD_ENCODED=$(jq -r ".${ENV}.writer.password_encoded.ENV" backend/database.json 2>/dev/null)
if [[ "$PASSWORD_ENCODED" != "null" && "$PASSWORD_ENCODED" != "" ]]; then
    PASSWORD_ENV_VAR=$PASSWORD_ENCODED
else
    PASSWORD_ENV_VAR=$(jq -r ".${ENV}.writer.password.ENV" backend/database.json 2>/dev/null)
fi
DB_NAME=$(jq -r ".${ENV}.writer.database" backend/database.json 2>/dev/null)

# Get actual values from environment variables
DB_HOST=${!HOST_ENV_VAR}
DB_PASSWORD=${!PASSWORD_ENV_VAR}

# For local development, use defaults
if [[ "$ENV" == "dev" ]]; then
    DB_HOST=${DB_HOST:-"localhost"}
    DB_NAME=${DB_NAME:-"d4adlocal"}
fi

echo "Database: $DB_NAME on $DB_HOST"

# Confirm action
read -p "This will DELETE ALL DATA in $DB_NAME. Are you sure? (type 'YES' to confirm): " confirm
if [[ "$confirm" != "YES" ]]; then
    echo "Operation cancelled."
    exit 0
fi

# Get list of tables (excluding migrations)
TABLES_SQL="SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename != 'migrations';"

if [[ -z "$DB_PASSWORD" ]]; then
    TABLES=$(psql -U postgres -h "$DB_HOST" -d "$DB_NAME" -t -c "$TABLES_SQL" 2>/dev/null | xargs)
else
    TABLES=$(PGPASSWORD="$DB_PASSWORD" psql -U postgres -h "$DB_HOST" -d "$DB_NAME" -t -c "$TABLES_SQL" 2>/dev/null | xargs)
fi

if [[ -z "$TABLES" ]]; then
    echo "No tables found to clean."
    exit 0
fi

echo "Found tables to clean: $TABLES"

# Truncate all tables
TRUNCATE_SQL=""
for table in $TABLES; do
    TRUNCATE_SQL="$TRUNCATE_SQL TRUNCATE TABLE \"$table\" RESTART IDENTITY CASCADE;"
done

echo "Executing TRUNCATE commands..."

if [[ -z "$DB_PASSWORD" ]]; then
    psql -U postgres -h "$DB_HOST" -d "$DB_NAME" -c "$TRUNCATE_SQL"
else
    PGPASSWORD="$DB_PASSWORD" psql -U postgres -h "$DB_HOST" -d "$DB_NAME" -c "$TRUNCATE_SQL"
fi

if [[ $? -eq 0 ]]; then
    echo "✅ Database cleaned successfully!"
    echo "You can now run the migration script safely."
else
    echo "❌ Failed to clean database."
    exit 1
fi