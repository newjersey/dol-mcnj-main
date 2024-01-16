#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/.."
cd $DIR
source "$DIR/backend/.env"

npm --prefix=backend start