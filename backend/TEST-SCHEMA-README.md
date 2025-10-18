# Test Schema for CI

## Overview

This project uses a **minimal test schema** for CI/CD pipelines instead of running all database migrations. This approach:

- ✅ Avoids downloading 50MB+ Git LFS SQL files in CI
- ✅ Significantly speeds up CI pipeline execution
- ✅ Provides consistent test database structure
- ✅ Reduces CI resource usage and costs

## How It Works

### In CI (GitHub Actions)
1. The workflow loads `backend/test-schema.sql` into the **d4adtest** database
2. This file contains the complete database schema structure (no data)
3. No migrations are run, no LFS files are downloaded
4. Tests run against the d4adtest database

### Locally (Development)
1. **d4adlocal** - Your development database with full migrations and data
2. **d4adtest** - Test database created from test-schema.sql for running tests
3. Production uses its own database (unaffected by CI changes)
4. Developers run migrations normally with `./scripts/db-migrate.sh` against d4adlocal

## Updating the Test Schema

**When should you update `test-schema.sql`?**
- After adding a new database migration
- After modifying existing table structures
- When tests fail in CI due to missing schema changes

**How to update:**

```bash
# 1. Ensure your local database is up-to-date
./scripts/db-migrate.sh

# 2. Generate the test schema
./scripts/generate-test-schema.sh

# 3. Review the generated file
git diff backend/test-schema.sql

# 4. Commit the updated schema
git add backend/test-schema.sql
git commit -m "chore: update test schema for CI"
```

## What's Included

The test schema includes:
- All table structures (CREATE TABLE statements)
- All indexes and constraints
- Views and functions
- Minimal seed data for tests (if needed)

The test schema excludes:
- Large data dumps (ETPL updates, etc.)
- Migrations history table
- ACL/ownership information
- Comments and documentation

## File Size

The test schema should be:
- **Small enough** to commit directly to git (not LFS)
- **Complete enough** for all tests to pass
- **Typically under 1MB** (schema-only, minimal data)

Current size: Run `du -h backend/test-schema.sql` to check

## Verification

To verify the test schema works:

```bash
# Create the test database (if it doesn't exist)
createdb -U postgres d4adtest

# Load the test schema
psql -U postgres -d d4adtest -f backend/test-schema.sql

# Run backend tests against it
PGDATABASE=d4adtest npm --prefix=backend test

# Run E2E tests (optional)
DB_ENV=test PGDATABASE=d4adtest ./scripts/feature-tests.sh
```

## Troubleshooting

**Tests fail in CI but pass locally?**
- The test schema may be outdated
- Run `./scripts/generate-test-schema.sh` and commit

**Test schema generation fails?**
- Ensure your local database is running
- Verify all migrations run successfully locally
- Check that you have `pg_dump` installed

**File is too large?**
- Review seed data - may be including too much
- Ensure `--schema-only` is used in pg_dump
- Consider excluding large lookup tables

## Alternative Approaches Considered

1. **Run all migrations in CI** ❌
   - Requires downloading 50MB+ LFS files
   - Causes checkout failures
   - Very slow

2. **Skip large migrations** ❌
   - Incomplete database schema
   - Tests fail due to missing tables
   - Inconsistent between environments

3. **Use test schema dump** ✅
   - Fast, reliable, small file size
   - Consistent test environment
   - No LFS dependencies

## Related Files

- `scripts/generate-test-schema.sh` - Generates the test schema
- `backend/test-schema.sql` - The actual test schema (committed)
- `.github/workflows/ci-full.yml` - CI workflow that uses this
- `scripts/db-migrate.sh` - Normal migration script for local dev
