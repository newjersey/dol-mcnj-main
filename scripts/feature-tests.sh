#!/usr/bin/env bash

cd $(git rev-parse --show-toplevel)

# Database setup
DB_NAME=d4adlocal
DB_PORT=5432 # Default PostgreSQL port, adjust if different
DB_USER=postgres # Adjust according to your setup

echo "Setting up database..."
# Check if the database exists, create if not
if ! psql -lqt -h localhost -U "${DB_USER}" | cut -d \| -f 1 | grep -qw "${DB_NAME}"; then
    echo "Database ${DB_NAME} does not exist. Creating..."
    createdb -h localhost -U "${DB_USER}" "${DB_NAME}"
else
    echo "Database ${DB_NAME} already exists."
fi

# Run migrations
echo "Running migrations..."
npm run migrate-up

APP_PORT=8080

# Attempt to kill any process using the APP_PORT
kill $(lsof -i:${APP_PORT} -t) || true

set -e

echo "starting app"
./scripts/build.sh
./scripts/prod-start-local.sh > /dev/null &
while ! echo exit | nc localhost ${APP_PORT}; do sleep 1; done

echo "app started"

npm --prefix=frontend run cypress:run -- --config baseUrl=http://localhost:${APP_PORT}

set +e

kill $(lsof -i:${APP_PORT} -t) || true

echo "   __            _                                             _"
echo "  / _| ___  __ _| |_ _   _ _ __ ___  ___   _ __   __ _ ___ ___| |"
echo " | |_ / _ \/ _\` | __| | | | '__/ _ \/ __| | '_ \ / _\` / __/ __| |"
echo " |  _|  __/ (_| | |_| |_| | | |  __/\__ \ | |_) | (_| \__ \__ \_|"
echo " |_|  \___|\__,_|\__|\__,_|_|  \___||___/ | .__/ \__,_|___/___(_)"
echo "                                          |_|                    "
echo ""
