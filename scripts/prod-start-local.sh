#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/.."
cd $DIR
source "$DIR/backend/.env"

DB_ENV=dev npm --prefix=backend start
