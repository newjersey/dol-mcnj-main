#!/usr/bin/env bash

cd $(git rev-parse --show-toplevel)
CSV_FILENAME=program_11182019.csv DB_NAME=d4adlocal ./scripts/db-seed.sh