#!/usr/bin/env bash

cd $(git rev-parse --show-toplevel)

set -e

npm --prefix=frontend run lint
npm --prefix=backend run lint

npm --prefix=frontend run fences
npm --prefix=backend run fences

npm --prefix=frontend run test:ci
npm --prefix=backend run test -- --no-cache


echo "  _            _                             _"
echo " | |          | |                           | |"
echo " | |_ ___  ___| |_ ___   _ __   __ _ ___ ___| |"
echo " | __/ _ \/ __| __/ __| | '_ \ / _\` / __/ __| |"
echo " | ||  __/\__ \ |_\__ \ | |_) | (_| \__ \__ \_|"
echo "  \__\___||___/\__|___/ | .__/ \__,_|___/___(_)"
echo "                        | |"
echo "                        |_|"
