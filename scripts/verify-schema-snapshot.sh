#!/usr/bin/env bash

# Verify that the schema snapshot is up-to-date with current migrations
# This should be run in CI to ensure developers regenerate the snapshot after adding migrations

set -e

cd $(git rev-parse --show-toplevel)

echo "=== CHECKING SCHEMA SNAPSHOT FRESHNESS ==="

SNAPSHOT_FILE="backend/schema-snapshot.sql"

# Check if snapshot exists
if [ ! -f "$SNAPSHOT_FILE" ]; then
    echo "❌ ERROR: Schema snapshot not found at $SNAPSHOT_FILE"
    echo ""
    echo "Please generate it by running:"
    echo "  ./scripts/generate-schema-snapshot.sh"
    exit 1
fi

# Count migrations
MIGRATION_COUNT=$(ls -1 backend/migrations/*.js 2>/dev/null | wc -l | tr -d ' ')

# Extract migration count from snapshot header
SNAPSHOT_MIGRATION_COUNT=$(grep "^-- Migrations included:" "$SNAPSHOT_FILE" | sed 's/[^0-9]*//g')

echo "Current migrations: $MIGRATION_COUNT"
echo "Snapshot includes: $SNAPSHOT_MIGRATION_COUNT"

if [ "$MIGRATION_COUNT" != "$SNAPSHOT_MIGRATION_COUNT" ]; then
    echo ""
    echo "❌ ERROR: Schema snapshot is out of date!"
    echo ""
    echo "The schema snapshot includes $SNAPSHOT_MIGRATION_COUNT migrations,"
    echo "but there are currently $MIGRATION_COUNT migration files."
    echo ""
    echo "Please regenerate the snapshot by running:"
    echo "  ./scripts/generate-schema-snapshot.sh"
    echo ""
    echo "Then commit the updated files:"
    echo "  git add backend/schema-snapshot*.sql"
    echo "  git commit -m 'chore: update schema snapshot'"
    exit 1
fi

# Check snapshot age (warning only)
SNAPSHOT_DATE=$(grep "^-- Generated:" "$SNAPSHOT_FILE" | sed 's/^-- Generated: //')
echo "Snapshot generated: $SNAPSHOT_DATE"

echo ""
echo "✅ Schema snapshot is up-to-date!"
