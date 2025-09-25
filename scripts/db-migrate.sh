#!/usr/bin/env bash

cd $(git rev-parse --show-toplevel)

BACKEND_DIR="$(pwd)/backend"
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

# Handle empty password for local development
if [[ -z "$DB_PASSWORD" ]]; then
    DATABASE_URL="postgresql://postgres@$DB_HOST:5432/$DB_NAME"
else
    DATABASE_URL="postgresql://postgres:${DB_PASSWORD}@$DB_HOST:5432/$DB_NAME"
fi

echo "Using environment: $ENV"
echo "Database: $DB_NAME on $DB_HOST"

# Ensure migrations table exists before running db-migrate
echo "Ensuring migrations table exists..."
if [[ -z "$DB_PASSWORD" ]]; then
    psql -U postgres -h "$DB_HOST" -d "$DB_NAME" -c "CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        run_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );" 2>/dev/null
else
    PGPASSWORD="$DB_PASSWORD" psql -U postgres -h "$DB_HOST" -d "$DB_NAME" -c "CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        run_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );" 2>/dev/null
fi

if [[ $? -eq 0 ]]; then
    echo "Migrations table verified/created successfully."
else
    echo "Warning: Could not verify migrations table exists. Continuing anyway..."
fi

# Check if there are any pending migrations
MIGRATIONS_DIR="$BACKEND_DIR/migrations"

# Handle schema migration (complete-database-state)
SCHEMA_MIGRATION=$(find "$MIGRATIONS_DIR" -name "*complete-database-state.js" | head -1)
if [[ -n "$SCHEMA_MIGRATION" ]]; then
    MIGRATION_NAME=$(basename "$SCHEMA_MIGRATION" .js)
    SQL_FILE="$MIGRATIONS_DIR/sqls/${MIGRATION_NAME}-up.sql"
    
    # Check if this migration has already been applied
    MIGRATION_APPLIED=$(psql -U postgres -h "$DB_HOST" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM migrations WHERE name = '$MIGRATION_NAME';" 2>/dev/null | xargs)
    
    if [[ "$MIGRATION_APPLIED" == "0" ]]; then
        echo "Running schema migration directly..."
        
        if [[ -f "$SQL_FILE" ]]; then
            # Run the SQL directly
            if [[ -z "$DB_PASSWORD" ]]; then
                psql -U postgres -h "$DB_HOST" -d "$DB_NAME" -f "$SQL_FILE"
            else
                PGPASSWORD="$DB_PASSWORD" psql -U postgres -h "$DB_HOST" -d "$DB_NAME" -f "$SQL_FILE"
            fi
            
            if [[ $? -eq 0 ]]; then
                # Record the migration as completed
                echo "Recording schema migration as completed..."
                if [[ -z "$DB_PASSWORD" ]]; then
                    psql -U postgres -h "$DB_HOST" -d "$DB_NAME" -c "INSERT INTO migrations (name, run_on) VALUES ('$MIGRATION_NAME', NOW());"
                else
                    PGPASSWORD="$DB_PASSWORD" psql -U postgres -h "$DB_HOST" -d "$DB_NAME" -c "INSERT INTO migrations (name, run_on) VALUES ('$MIGRATION_NAME', NOW());"
                fi
                echo "Schema migration completed successfully!"
            else
                echo "Schema migration failed!"
                exit 1
            fi
        else
            echo "Schema SQL file not found: $SQL_FILE"
            exit 1
        fi
    else
        echo "Schema migration already applied."
    fi
fi

# Handle data migration (load-database-data)
DATA_MIGRATION=$(find "$MIGRATIONS_DIR" -name "*load-database-data.js" | head -1)
if [[ -n "$DATA_MIGRATION" ]]; then
    MIGRATION_NAME=$(basename "$DATA_MIGRATION" .js)
    
    # Check if this migration has already been applied
    MIGRATION_APPLIED=$(psql -U postgres -h "$DB_HOST" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM migrations WHERE name = '$MIGRATION_NAME';" 2>/dev/null | xargs)
    
    if [[ "$MIGRATION_APPLIED" == "0" ]]; then
        echo "Running data migration..."
        
        # Change to backend directory and run the Node.js migration script  
        cd "$BACKEND_DIR"
        echo "Executing data migration Node.js script..."
        export DB_HOST="$DB_HOST"
        export DB_PASSWORD="$DB_PASSWORD"
        export DB_NAME="$DB_NAME"
        node -e "
        const migration = require('./migrations/${MIGRATION_NAME}.js');
        const pg = require('pg');
        const client = new pg.Client({
          host: process.env.DB_HOST,
          user: 'postgres',
          password: process.env.DB_PASSWORD || undefined,
          database: process.env.DB_NAME,
          port: 5432
        });
        
        const mockDb = {
          runSql: async (sql) => {
            await client.connect();
            const result = await client.query(sql);
            await client.end();
            return result;
          }
        };
        
        migration.setup({ dbmigrate: { dataType: {} }, Promise: Promise }, null);
        migration.up(mockDb).then(() => {
          console.log('Data migration completed successfully!');
          process.exit(0);
        }).catch((err) => {
          console.error('Data migration failed:', err.message);
          process.exit(1);
        });
        "
        
        if [[ $? -eq 0 ]]; then
            # Record the migration as completed
            echo "Recording data migration as completed..."
            if [[ -z "$DB_PASSWORD" ]]; then
                psql -U postgres -h "$DB_HOST" -d "$DB_NAME" -c "INSERT INTO migrations (name, run_on) VALUES ('$MIGRATION_NAME', NOW());"
            else
                PGPASSWORD="$DB_PASSWORD" psql -U postgres -h "$DB_HOST" -d "$DB_NAME" -c "INSERT INTO migrations (name, run_on) VALUES ('$MIGRATION_NAME', NOW());"
            fi
            echo "Data migration completed successfully!"
        else
            echo "Data migration failed!"
            exit 1
        fi
    else
        echo "Data migration already applied."
    fi
fi

# If no consolidated migrations found, try running normal db-migrate
if [[ -z "$SCHEMA_MIGRATION" && -z "$DATA_MIGRATION" ]]; then
    echo "No consolidated migrations found, running normal db-migrate..."
    export DATABASE_URL
    npm --prefix=backend run db-migrate up
fi
