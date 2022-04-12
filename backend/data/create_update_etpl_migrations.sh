#!/usr/bin/env bash

OLD_CSV=$1
NEW_CSV=$2
SQL_UP=$3
SQL_DOWN=$4

node backend/data/csvDeleteAllAndInsert.js $NEW_CSV etpl $SQL_UP
node backend/data/csvDeleteAllAndInsert.js $OLD_CSV etpl $SQL_DOWN