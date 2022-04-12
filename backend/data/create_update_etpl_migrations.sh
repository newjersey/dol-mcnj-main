#!/usr/bin/env bash

SQL_UP=$1
SQL_DOWN=$2

node backend/data/csvDeleteAllAndInsert.js standardized_etpl.csv etpl $SQL_UP
node backend/data/csvDeleteAllAndInsert.js standardized_etpl_old.csv etpl $SQL_DOWN