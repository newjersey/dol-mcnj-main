# Database Schema Snapshot for CI

## Overview

This directory contains pre-generated database schema snapshots used in CI/CD pipelines. These snapshots allow GitHub Actions to set up the database without downloading large Git LFS migration files (some are 50MB+).

## Files

- **`schema-snapshot.sql`** - Schema-only dump (tables, indexes, constraints, no data)
- **`schema-snapshot-with-seed-data.sql`** - Schema + seed data for testing

## Why Use Snapshots?

The project has accumulated many large ETPL data migration files stored in Git LFS. These files:
- Are too large for GitHub Actions to download reliably (50-74MB each)
- Contain historical data updates not needed for CI tests
- Cause checkout failures with "unable to write file" errors

By using pre-generated snapshots, CI can:
- ✅ Skip downloading large LFS files
- ✅ Set up the database schema instantly
- ✅ Run tests with the correct schema structure
- ✅ Avoid resource limits on GitHub Actions runners

## Generating Snapshots

When you add a new migration, regenerate the snapshot:

```bash
./scripts/generate-schema-snapshot.sh
```

This script:
1. Creates a temporary database
2. Runs all migrations (including large LFS files)
3. Dumps the resulting schema
4. Cleans up the temporary database

**Important:** You must have:
- PostgreSQL installed locally
- `backend/.env` configured with database credentials
- All Git LFS files downloaded locally

## Committing Snapshots

After generating:

```bash
git add backend/schema-snapshot.sql backend/schema-snapshot-with-seed-data.sql
git commit -m "chore: update schema snapshot after migration"
```

## CI Verification

The CI workflow automatically verifies the snapshot is up-to-date by comparing:
- Number of migration files
- Migration count in snapshot header

If out of sync, CI fails with instructions to regenerate.

## Maintenance

### When to Regenerate

Regenerate the snapshot whenever you:
- Add a new migration
- Modify an existing migration
- Change the database schema

### Automation Ideas

Consider setting up:
- Pre-commit hook to remind about snapshot updates
- GitHub Action to auto-generate snapshots on migration changes
- Script to check snapshot age and warn if > 30 days old

## Local Development

Developers can still run full migrations locally with:

```bash
./scripts/db-migrate.sh
```

This uses the actual migration files (including large LFS files) for complete accuracy.

## Troubleshooting

### Snapshot generation fails

- Ensure PostgreSQL is running
- Check `backend/.env` has correct credentials
- Verify all LFS files are downloaded: `git lfs pull`

### CI says snapshot is out of date

Run the generation script and commit the result:

```bash
./scripts/generate-schema-snapshot.sh
git add backend/schema-snapshot*.sql
git commit -m "chore: update schema snapshot"
```

### Want to use migrations in CI instead

If GitHub Actions adds more resources or we optimize migration files:

1. Update `.github/workflows/ci-full.yml`
2. Replace "Load database schema from snapshot" step
3. Re-enable the migration approach with proper LFS handling
