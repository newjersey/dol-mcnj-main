#!/usr/bin/env bash

set -e

INPUT_CSV=combined_etpl_raw.csv

# setup
rm -rf d4ad_standardization
git clone https://github.com/robinsonkwame/d4ad_standardization

# install and setup python stuff
cd d4ad_standardization
pipenv install

# setup data
mkdir D4AD_Standardization/data/raw
mkdir D4AD_Standardization/data/interim
mv ../$INPUT_CSV D4AD_Standardization/data/raw

# run script
pipenv run python3 D4AD_Standardization/src/data/make_dataset.py True ./D4AD_Standardization/data/interim/ ./D4AD_Standardization/data/raw/$INPUT_CSV

# finish and cleanup
mv D4AD_Standardization/data/interim/standardized_etpl.csv ..
cd ..
rm -rf d4ad_standardization