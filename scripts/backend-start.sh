#!/usr/bin/env bash

cd $(git rev-parse --show-toplevel)
npm --prefix=backend run start:dev