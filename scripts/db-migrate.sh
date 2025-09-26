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

# Test connection first
echo "Testing connection to database..."
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -U postgres -d "$DB_NAME" -c "SELECT 1;" > /dev/null 2>&1
if [[ $? -eq 0 ]]; then
    echo "✅ Direct connection successful"
else
    echo "❌ Direct connection failed"
    exit 1
fi

# Force db-migrate to use DATABASE_URL by creating a minimal database.json
echo "Running db-migrate with forced DATABASE_URL usage..."
mv backend/database.json backend/database.json.backup

# Create a minimal database.json that forces db-migrate to use DATABASE_URL
echo "Creating temporary database.json with:"
echo "  Host: $DB_HOST"
echo "  Database: $DB_NAME"
echo "  Password set: ${DB_PASSWORD:+YES}"

cat > backend/database.json << EOF
{
  "dev": {
    "driver": "pg",
    "host": "$DB_HOST",
    "user": "postgres",
    "password": "$DB_PASSWORD",
    "database": "$DB_NAME"
  },
  "awstest": {
    "driver": "pg",
    "host": "$DB_HOST",
    "user": "postgres", 
    "password": "$DB_PASSWORD",
    "database": "$DB_NAME"
  }
}
EOF

echo "Temporary database.json content:"
cat backend/database.json

# Since db-migrate has persistent connection issues, use direct SQL approach
echo "Running migration SQL directly (bypassing db-migrate)..."

# Find the most recent migration that hasn't been run yet
LATEST_MIGRATION=$(ls -t backend/migrations/sqls/*-up.sql | head -1)
MIGRATION_NAME=$(basename "$LATEST_MIGRATION" | sed 's/-up\.sql$//')

echo "Found latest migration: $MIGRATION_NAME"

if [[ -f "$LATEST_MIGRATION" ]]; then
    echo "Executing migration SQL..."
    PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -U postgres -d "$DB_NAME" -f "$LATEST_MIGRATION"
    
    if [[ $? -eq 0 ]]; then
        echo "Recording migration in database..."
        PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -U postgres -d "$DB_NAME" -c "INSERT INTO migrations (name, run_on) VALUES ('$MIGRATION_NAME', NOW()) ON CONFLICT DO NOTHING;"
        echo "✅ Migration completed successfully!"
    else
        echo "❌ Migration failed"
        exit 1
    fi
else
    echo "No migration files found"
    exit 1
fi

# Restore original database.json
mv backend/database.json.backup backend/database.json