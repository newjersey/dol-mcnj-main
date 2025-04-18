#!/bin/bash

set -e -o pipefail

# virtual working env
python3 -m venv .venv
source .venv/bin/activate

# Variables
DATE=$(date '+%Y%m%d')
ROOT_DIR=$(pwd)
DATA_DIR="$ROOT_DIR/backend/data"
CREDENTIALS_DIR="$DATA_DIR/program-credentials"
SQL_DIR="$ROOT_DIR/backend/migrations/sqls"

# Get files starting with "Approved Programs" and "Approved Providers"
PROGRAM_FILE=$(ls -1 "Approved Programs"*.csv 2>/dev/null | head -n 1 || true)
PROVIDER_FILE=$(ls -1 "Approved Providers"*.csv 2>/dev/null | head -n 1 || true)

# Ensure both files exist
if [[ -z "$PROGRAM_FILE" || -z "$PROVIDER_FILE" ]]; then
  echo "❌ Could not find the expected input files:"
  echo "Looked for 'Approved Programs*.csv' and 'Approved Providers*.csv' in root directory."
  exit 1
fi

echo "Step 1: Moving old CSVs..."
mv "$PROGRAM_FILE" "backend/data/programs_${DATE}.csv"
mv "$PROVIDER_FILE" "backend/data/providers_${DATE}.csv"

echo "✅ Moving CSVs Complete"

echo "Step 2: Merging credentials..."
cd "$CREDENTIALS_DIR"
pip3 install -r requirements.txt
python3 merge-credentials.py "$DATE"

echo "✅ Merging credentials Complete"

echo "Step 3: Cleaning merged CSV file..."
sed -i '' '/^$/d' "$DATA_DIR/programs_${DATE}_merged.csv"

echo "✅ Cleaning merged CSV file complete"

echo "Step 4: Combining programs and providers..."
cd "$DATA_DIR"
mv standardized_etpl.csv standardized_etpl_old.csv 2>/dev/null || true
./combine-etpl.sh "programs_${DATE}_merged.csv" "providers_${DATE}.csv"

echo "✅ Combining programs and providers complete"

echo "Step 5: Standardizing combined data..."
./run-standardization.sh

echo "✅ Standardizing combined data complete"

echo "Step 6: Creating DB migration..."
cd "$ROOT_DIR"
npm --prefix=backend run db-migrate create update-etpl -- --sql-file

UP_FILE=$(ls -1t "$SQL_DIR"/*update-etpl*-up.sql | head -n 1)
DOWN_FILE=$(ls -1t "$SQL_DIR"/*update-etpl*-down.sql | head -n 1)

UP_FILENAME=$(basename "$UP_FILE")
DOWN_FILENAME=$(basename "$DOWN_FILE")

echo "✅ Creating DB migration complete"

echo "Step 7: Generating SQL insert statements..."
./backend/data/create_update_etpl_migrations.sh \
  "standardized_etpl_old.csv" \
  "/standardized_etpl.csv" \
  "backend/migrations/sqls/$UP_FILENAME" "backend/migrations/sqls/$DOWN_FILENAME"

echo "✅ Generating SQL insert statements complete"

echo "Step 8: Creating TEST SQL files..."
UP_FILE_TEST="${UP_FILE%.sql}-TEST.sql"
DOWN_FILE_TEST="${DOWN_FILE%.sql}-TEST.sql"

echo "-- intentionally left blank" > "$UP_FILE_TEST"
echo "-- intentionally left blank" > "$DOWN_FILE_TEST"

echo "Step 9: Updating JS migration file..."

# Extract filename from UP_FILE and convert it to .js
JS_FILENAME=$(basename "$UP_FILE" | sed 's/-up\.sql/.js/')

# Move one directory up from 'sqls' to 'migrations'
JS_FILE="$SQL_DIR/../$JS_FILENAME"

# Normalize path (remove double slashes if needed)
JS_FILE=$(realpath "$JS_FILE" 2>/dev/null || echo "$JS_FILE")

if [[ -f "$JS_FILE" ]]; then
  echo "Patching JS file: $JS_FILE"


# Patch `exports.up` to declare and use fileName
  sed -i '' "/exports.up = function/,/fs.readFile/{
    /const fileName =/d
    /var filePath = path.join/i\\
    const fileName =\\
      process.env.NODE_ENV === \"test\"\\
        ? \"$UP_FILENAME-TEST\"\\
        : \"$UP_FILENAME\";
    s|var filePath = path.join.*|var filePath = path.join(__dirname, 'sqls', fileName);|
  }" "$JS_FILE"

# Patch `exports.down` to declare and use fileName
  sed -i '' "/exports.down = function/,/fs.readFile/{
    /const fileName =/d
    /var filePath = path.join/i\\
    const fileName =\\
      process.env.NODE_ENV === \"test\"\\
        ? \"$DOWN_FILENAME-TEST\"\\
        : \"$DOWN_FILENAME\";
    s|var filePath = path.join.*|var filePath = path.join(__dirname, 'sqls', fileName);|
  }" "$JS_FILE"

else
  echo "⚠️  JS file not found for migration: $JS_FILE"
fi

echo "✅ Updating JS migration file complete"

echo "Step 10: Cleaning up old files..."
rm "$DATA_DIR/standardized_etpl_old.csv"
rm "$DATA_DIR/programs_${DATE}.csv"
rm "$DATA_DIR/providers_${DATE}.csv"
rm "$DATA_DIR/programs_${DATE}_merged.csv"

echo "✅ Cleaning up old files complete"

echo "✅ All steps completed successfully!"
