#!/usr/bin/env bash

cd $(git rev-parse --show-toplevel)

APP_PORT=8080
WIREMOCK_PORT=8090

kill $(lsof -i:${WIREMOCK_PORT} -t)
kill $(lsof -i:${APP_PORT} -t)

set -e

echo "starting app"
./scripts/build.sh
./scripts/prod-start-local.sh > /dev/null &
npm --prefix=backend run start:wiremock &
while ! echo exit | nc localhost ${WIREMOCK_PORT}; do sleep 1; done
while ! echo exit | nc localhost ${APP_PORT}; do sleep 1; done

echo "app started"

# Suppress output for db-migrate
echo "Running db-migrate..."
DB_ENV=dev npm --prefix=backend run db-migrate up -- -e $DB_ENV > /dev/null 2>&1
echo "db-migrate completed."

# Fetch and display the most recent migration
echo "Fetching the most recent migration..."
MOST_RECENT_MIGRATION=$(psql -U postgres -d your_database_name -c "SELECT * FROM migrations ORDER BY id DESC LIMIT 1;" -t)
echo "Most recent migration: $MOST_RECENT_MIGRATION"

npm --prefix=frontend run cypress:run -- --config baseUrl=http://localhost:${APP_PORT}

set +e

kill $(lsof -i:${APP_PORT} -t)
kill $(lsof -i:${WIREMOCK_PORT} -t)

echo "   __            _                                             _"
echo "  / _| ___  __ _| |_ _   _ _ __ ___  ___   _ __   __ _ ___ ___| |"
echo " | |_ / _ \/ _\` | __| | | | '__/ _ \/ __| | '_ \ / _\` / __/ __| |"
echo " |  _|  __/ (_| | |_| |_| | | |  __/\__ \ | |_) | (_| \__ \__ \_|"
echo " |_|  \___|\__,_|\__|\__,_|_|  \___||___/ | .__/ \__,_|___/___(_)"
echo "                                          |_|                    "
echo ""