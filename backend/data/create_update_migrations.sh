#!/usr/bin/env bash

OLD_CSV=$1
NEW_CSV=$2
TABLENAME=$3
SQL_UP=$4
SQL_DOWN=$5

pushd backend/data

# create temp csv files to hold only changed lines
# insertions is new values of changed lines
# deletions is old values of changed lines
INSERTIONS=insertions.csv
DELETIONS=deletions.csv
touch $INSERTIONS
touch $DELETIONS

# add header rows
head -n 1 $OLD_CSV > $DELETIONS
head -n 1 $NEW_CSV > $INSERTIONS

# add data
diff --changed-group-format='%<' --unchanged-group-format='' $OLD_CSV $NEW_CSV >> $DELETIONS
diff --changed-group-format='%>' --unchanged-group-format='' $OLD_CSV $NEW_CSV >> $INSERTIONS

popd

# create up sql
node backend/data/csvUpdater.js $DELETIONS $INSERTIONS $TABLENAME $SQL_UP

# create down sql (reversing order of input CSVs)
node backend/data/csvUpdater.js $INSERTIONS $DELETIONS $TABLENAME $SQL_DOWN

pushd backend/data

# cleanup
rm $DELETIONS
rm $INSERTIONS

popd