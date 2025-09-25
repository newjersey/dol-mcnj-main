# Database Two-Migration System

## Overview

This project has evolved from 190+ individual database migrations to a **two-migration system** (schema + compressed data) to improve build performance, maintainability, and GitHub compatibility.

## Migration Architecture

### Before Consolidation
```
migrations/
├── 20200605145412-programs.js
├── 20200616144558-seed-programs.js
├── ... (190+ individual migrations)
└── 20250923211426-update-etpl.js
```

### Current: Two-Migration System
```
migrations/
├── 20250925105433-complete-database-state.js     ← Schema migration (18KB)
├── 20250925175911-load-database-data.js          ← Data migration (11MB compressed)
└── sqls/
    ├── 20250925105433-complete-database-state-up.sql    ← Schema SQL
    ├── 20250925105433-complete-database-state-down.sql  ← Schema rollback  
    ├── 20250925175911-load-database-data-up.sql.bz2    ← Compressed data (130MB→11MB)
    └── 20250925175911-load-database-data-down.sql      ← Data rollback (TRUNCATE)

migrations_archive/
└── archived_final_YYYYMMDD_HHMMSS/       ← Historical migrations
    ├── ARCHIVE_INFO.txt                   ← Archive documentation
    ├── [233 archived migration files]    ← All old .js files
    └── sqls/                             ← All historical SQL files
```

## Benefits

### Performance Improvements
- **CI/CD Builds**: ~15 minutes → ~90 seconds (94% faster)
- **New Developer Setup**: ~10 minutes → ~2 minutes  
- **Database Creation**: Two efficient migrations vs. 190+ individual migrations
- **GitHub Compatibility**: 11MB compressed vs. 130MB raw data

### Maintainability  
- **Clean Separation**: Schema logic separate from data loading
- **Compressed Storage**: bzip2 compression (92% size reduction)
- **Robust Constraints**: Conditional constraint addition (idempotent)
- **Automatic Decompression**: No manual file management required
- **Error Handling**: Comprehensive migration validation and rollback

### Technical Features
- **Idempotent Migrations**: Safe to run multiple times
- **Conditional Constraints**: PL/pgSQL DO blocks prevent duplicate key errors  
- **Automatic Cleanup**: Temporary files removed after successful loading
- **Progress Reporting**: Clear console output with emojis and status

## Archive Preservation

### What's Preserved
All historical migrations are preserved in `backend/migrations_archive/`:

1. **Complete Migration Files**: All `.js` migration files
2. **SQL Files**: All SQL files from the `sqls/` directory
3. **Metadata**: Archive creation date, git commit, branch info
4. **Documentation**: Detailed README with migration list and usage

### Archive Structure
```
migrations_archive/pre_consolidation_YYYYMMDD_HHMMSS/
├── README.md              ← Complete archive documentation
├── .gitignore            ← Git tracking configuration  
├── migrations/           ← All historical .js files
│   ├── 20200605145412-programs.js
│   ├── 20200616144558-seed-programs.js
│   └── ... (all migrations)
└── sqls/                ← All historical SQL files
    └── ... (SQL files)
```

## Usage

### For New Projects/Developers
```bash
# Run two-migration system (schema + data)
cd /path/to/project
./scripts/db-migrate.sh up

# Expected output:
# ✅ Schema migration completed successfully!
# 🗜️ Decompressing database data (130MB)...
# 📊 Executing 37,632 INSERT statements...
# 🎉 Database data loaded successfully!
```

### Alternative: Using npm directly
```bash
# This works but doesn't show progress indicators
cd backend  
npm run db-migrate up
```

### For Referencing Historical Migrations
```bash
# View archived migrations
ls backend/migrations_archive/pre_consolidation_*/migrations/

# View specific archived migration
cat backend/migrations_archive/pre_consolidation_*/migrations/20200605145412-programs.js

# Check archive documentation
cat backend/migrations_archive/pre_consolidation_*/README.md
```

### For Rollback (Emergency)
```bash
# Restore individual migrations (use with caution)
cp backend/migrations_archive/pre_consolidation_*/migrations/* backend/migrations/
```

## Migration Consolidation Process

### Tools Available
```bash
# Interactive migration wizard (recommended)
cd backend
./scripts/database-migration-wizard.sh

# Options available:
# 1) Generate Two-Migration System (Schema + Data)
# 2) Create & Test Database  
# 3) Validate Data Integrity
# 4) Initialize Fresh Database
# 5) Full Workflow (1→2→3)
# 6) Clean Up Test Database

# Direct migration script
cd /path/to/project
./scripts/db-migrate.sh up        # Run migrations
./scripts/db-migrate.sh reset     # Reset database
```

### Current Database Schema (Two-Migration System 2025-09-25)

The two-migration system accurately reflects the current database state with **14 tables** and **72,209 records**:

| Table | Purpose | Record Count |
|-------|---------|--------------|
| `blsoccupationhandbook` | BLS occupation handbook data (41+ columns) | Various |
| `etpl` | Eligible Training Provider List | 17,131 |
| `indemandcips` | In-demand CIP codes | Various |
| `indemandsocs` | In-demand SOC codes | Various |
| `localexceptioncips` | Local exception CIP codes | Various |
| `migrations` | Migration tracking table | 2 |
| `oesestimates` | Occupational Employment Statistics | 36,382 |
| `oeshybridcrosswalk` | OES hybrid crosswalk data | Various |
| `onlineprograms` | Online program information | Various |
| `outcomes_cip` | Program outcomes by CIP code | 1,565 |
| `programtokens` | Program authentication tokens | 17,131 |
| `soc2010to2018crosswalk` | SOC code version crosswalk | Various |
| `soccipcrosswalk` | SOC to CIP code mapping | Various |
| `socdefinitions` | SOC code definitions | Various |

**Schema Migration**: 18KB SQL (tables, constraints, sequences)
**Data Migration**: 11MB compressed (130MB uncompressed, 37,632 INSERT statements)
**Replaces**: 233 individual migration files  
**Generated From**: Live database state with conditional constraint handling

### Manual Process
1. **Backup**: Create timestamped archive in `migrations_archive/`
2. **Preserve**: Copy all `.js` and SQL files with metadata
3. **Document**: Generate comprehensive README for archive
4. **Consolidate**: Replace individual migrations with single schema
5. **Commit**: Track archive in git for team preservation

## Production Considerations

### Deployment Strategy
1. **Fresh Databases**: Use two-migration system (recommended)
   - Schema migration creates all tables and constraints
   - Data migration loads compressed data automatically
2. **Existing Databases**: Migration state reconciliation via wrapper script
3. **Staging Testing**: Wizard provides comprehensive validation
4. **Rollback Plan**: Archive accessible + individual down migrations
5. **Environment Variables**: Ensure proper database connection configuration

### Team Coordination
- Coordinate consolidation timing with team
- Ensure all developers are aware of the change
- Update deployment documentation
- Plan for any production migration needs

## CircleCI Integration

The consolidation significantly improves CI performance:

### Before (190+ Individual Migrations)
```yaml
# ~15 minutes to run 190+ migrations
- run:
    name: Run database migrations
    command: cd backend && npm run db-migrate up
    no_output_timeout: 15m
```

### After (Two-Migration System)
```yaml
# ~90 seconds to run schema + compressed data
- run:
    name: Run database migrations  
    command: ./scripts/db-migrate.sh up
    no_output_timeout: 3m
```

### Performance Gains
- **Schema Migration**: ~5 seconds (table creation)
- **Data Migration**: ~85 seconds (decompression + 37,632 INSERTs)  
- **Total Time**: ~90 seconds vs. 15 minutes (94% improvement)

## Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Error: "Cannot connect to database"
# Solution: Check environment variables in backend/.env
export DB_HOST_DEV=localhost
export DB_PASS_DEV=postgres
```

#### Compression/Decompression Issues
```bash
# Error: "Compressed data file not found"
# Solution: Verify .bz2 file exists
ls -la backend/migrations/sqls/*load-database-data*.bz2

# Error: "bunzip2 not found"
# Solution: Install bzip2
brew install bzip2  # macOS
sudo apt-get install bzip2  # Linux
```

#### Migration State Issues
```bash
# Error: "Multiple primary keys for table"
# Solution: Already handled by conditional constraints in new system

# Error: "Migration already applied"  
# Solution: Reset and re-run if needed
./scripts/db-migrate.sh reset
./scripts/db-migrate.sh up
```

### Recovery Steps
1. **Check migration status**: `psql -c "SELECT * FROM migrations;"`
2. **Verify file integrity**: `ls -la backend/migrations/sqls/`
3. **Test decompression**: `bunzip2 -t backend/migrations/sqls/*.bz2`
4. **Use wizard for validation**: `./scripts/database-migration-wizard.sh`
5. **Archive fallback**: Check `backend/migrations_archive/` if needed

## Historical Context

This consolidation was performed to address:
- CircleCI build timeouts from excessive migration count
- New developer onboarding complexity
- Maintenance burden of 190+ individual migrations
- Performance issues in CI/CD pipelines

All historical context is preserved in the archive for future reference and emergency restoration needs.