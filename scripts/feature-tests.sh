#!/usr/bin/env bash

cd $(git rev-parse --show-toplevel)

# Load environment variables
source ./backend/.env

# Set the environment
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

# Set the DATABASE_URL environment variable
DATABASE_URL="postgresql://postgres:${DB_PASSWORD}@$DB_HOST:5432/$DB_NAME"
export DATABASE_URL

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

# Run Cypress tests
npm --prefix=frontend run cypress:run -- --config baseUrl=http://localhost:${APP_PORT}

set +e

kill $(lsof -i:${APP_PORT} -t)
kill $(lsof -i:${WIREMOCK_PORT} -t)

# Display success message
echo "   __            _                                             _"
echo "  / _| ___  __ _| |_ _   _ _ __ ___  ___   _ __   __ _ ___ ___| |"
echo " | |_ / _ \/ _\` | __| | | | '__/ _ \/ __| | '_ \ / _\` / __/ __| |"
echo " |  _|  __/ (_| | |_| |_| | | |  __/\__ \ | |_) | (_| \__ \__ \_|"
echo " |_|  \___|\__,_|\__|\__,_|_|  \___||___/ | .__/ \__,_|___/___(_)"
echo "                                          |_|                    "
echo ""
