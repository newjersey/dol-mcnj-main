#!/usr/bin/env bash
set -e

# Generate test schema for CI from your current production database
# This creates a schema-only dump (no data) from d4adlocal
# The schema is used in CI to avoid downloading large Git LFS migration files
# 
# Usage: ./scripts/generate-test-schema.sh
# 
# This script will:
# 1. Dump the schema from your local d4adlocal database
# 2. Save it to backend/test-schema.sql
# 3. CI will load this into d4adtest database

cd $(git rev-parse --show-toplevel)

echo "=== GENERATING TEST SCHEMA FOR CI ==="

# Configuration
SOURCE_DB="d4adlocal"
OUTPUT_FILE="backend/test-schema.sql"

echo "Step 1: Verifying source database exists..."
if ! psql -U postgres -lqt | cut -d \| -f 1 | grep -qw $SOURCE_DB; then
    echo "ERROR: Source database '$SOURCE_DB' not found!"
    echo "Please ensure you have run migrations locally first:"
    echo "  ./scripts/db-migrate.sh"
    exit 1
fi

echo "Step 2: Generating schema-only dump from $SOURCE_DB..."
pg_dump -U postgres $SOURCE_DB \
  --schema-only \
  --no-owner \
  --no-acl \
  --exclude-table=migrations \
  > $OUTPUT_FILE

echo "✓ Test schema generated at: $OUTPUT_FILE"
echo ""
echo "Schema size: $(wc -l < $OUTPUT_FILE) lines"
echo "File size: $(du -h $OUTPUT_FILE | cut -f1)"
echo ""
echo "Next steps:"
echo "1. Review $OUTPUT_FILE to ensure it looks correct"
echo "2. Test it locally: psql -U postgres -d d4adtest -f $OUTPUT_FILE"
echo "3. Run tests: PGDATABASE=d4adtest npm --prefix=backend test"
echo "4. Commit: git add $OUTPUT_FILE && git commit -m 'chore: update test schema'"
echo "5. CI will use this in d4adtest database instead of running migrations"
