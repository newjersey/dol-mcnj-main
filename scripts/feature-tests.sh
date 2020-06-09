#!/usr/bin/env bash

cd $(git rev-parse --show-toplevel)

APP_PORT=8080

kill $(lsof -i:${APP_PORT} -t)

set -e

echo "starting app"
./scripts/build.sh
./scripts/prod-start.sh &
while ! echo exit | nc localhost ${APP_PORT}; do sleep 1; done

echo "app started"

./scripts/db-migrate.sh
psql -U postgres -d d4adlocal -c 'delete from programs;'
./scripts/db-seed-local.sh

npm --prefix=frontend run cypress:run -- --config baseUrl=http://localhost:8080

kill $(lsof -i:${APP_PORT} -t)

echo "   __            _                                             _"
echo "  / _| ___  __ _| |_ _   _ _ __ ___  ___   _ __   __ _ ___ ___| |"
echo " | |_ / _ \/ _\` | __| | | | '__/ _ \/ __| | '_ \ / _\` / __/ __| |"
echo " |  _|  __/ (_| | |_| |_| | | |  __/\__ \ | |_) | (_| \__ \__ \_|"
echo " |_|  \___|\__,_|\__|\__,_|_|  \___||___/ | .__/ \__,_|___/___(_)"
echo "                                          |_|                    "
echo ""