-- Database Schema Snapshot for CI Testing
-- Generated from production schema, excludes large data migrations
-- This allows CI to run without downloading massive LFS SQL files
--
-- ⚠️  THIS FILE NEEDS TO BE GENERATED BEFORE CI WILL WORK
--
-- To generate this file, run:
--   ./scripts/generate-schema-snapshot.sh
--
-- This will:
-- 1. Create a temporary database
-- 2. Run all migrations (you need Git LFS files locally)
-- 3. Dump the schema to this file
-- 4. You then commit this file
--
-- See backend/README-SCHEMA-SNAPSHOT.md for full documentation

-- Placeholder - will be replaced when script is run
CREATE TABLE IF NOT EXISTS migrations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    run_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

