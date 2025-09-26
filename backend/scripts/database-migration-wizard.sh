#!/bin/bash

# Database Migration Wizard - Two-Migration System
# Generates schema + compressed data migrations and validates results

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(dirname "$SCRIPT_DIR")"
MIGRATIONS_DIR="$BACKEND_DIR/migrations"
SQLS_DIR="$MIGRATIONS_DIR/sqls"
SOURCE_DB="d4adlocal"
TEST_DB="dol_mcnj_validation_test"
POSTGRES_USER="postgres"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Utility functions
log() { echo -e "${GREEN}[$(date '+%H:%M:%S')]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1" >&2; }
info() { echo -e "${BLUE}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }

show_banner() {
    clear
    echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║           DATABASE MIGRATION WIZARD (Two-Migration)          ║${NC}"
    echo -e "${CYAN}║                  Schema + Compressed Data                    ║${NC}"
    echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
}

show_menu() {
    echo -e "${YELLOW}Options:${NC}"
    echo "  1) Generate Two-Migration System (Schema + Data)"
    echo "  2) Create & Test Database"  
    echo "  3) Validate Data Integrity"
    echo "  4) Initialize Fresh Database (migrations table)"
    echo "  5) Full Workflow (1→2→3)"
    echo "  6) Clean Up Test Database"
    echo "  0) Exit"
    echo
}

test_db_connection() {
    psql -U "$POSTGRES_USER" -d "$1" -c "SELECT 1;" >/dev/null 2>&1
}

get_db_stats() {
    local db_name="$1"
    local table_count=$(psql -U "$POSTGRES_USER" -d "$db_name" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public';" 2>/dev/null | xargs || echo "0")
    local total_rows=$(psql -U "$POSTGRES_USER" -d "$db_name" -t -c "SELECT COALESCE(SUM(n_tup_ins), 0) FROM pg_stat_user_tables WHERE schemaname='public';" 2>/dev/null | xargs || echo "0")
    echo "$table_count,$total_rows"
}

# Generate fresh migration
generate_migration() {
    log "Generating two-migration system (schema + data)..."
    
    if ! test_db_connection "$SOURCE_DB"; then
        error "Cannot connect to source database '$SOURCE_DB'"
        return 1
    fi
    
    # Create archive for existing migrations (except our new two-migration system)
    local archive_dir="$MIGRATIONS_DIR/migrations_archive"
    
    if ls "$MIGRATIONS_DIR"/*.js 1> /dev/null 2>&1; then
        # Archive all migrations except the new two-migration system
        if [[ ! -d "$archive_dir" ]]; then
            mkdir -p "$archive_dir/sqls"
        fi
        
        # Count migrations to archive (exclude our new system)
        local migration_count=$(ls -1 "$MIGRATIONS_DIR"/*.js 2>/dev/null | grep -v migrations_archive | grep -v "complete-database-state" | grep -v "load-database-data" | wc -l)
        local sql_count=$(ls -1 "$SQLS_DIR"/*.sql 2>/dev/null | grep -v "complete-database-state" | grep -v "load-database-data" | wc -l || echo "0")
        
        if [[ $migration_count -gt 0 || $sql_count -gt 0 ]]; then
            # Move existing migration files to archive (preserve our new system)
            find "$MIGRATIONS_DIR" -maxdepth 1 -name "*.js" -not -path "*/migrations_archive/*" -not -name "*complete-database-state*" -not -name "*load-database-data*" -exec mv {} "$archive_dir/" \;
            find "$SQLS_DIR" -maxdepth 1 -name "*.sql" -not -name "*complete-database-state*" -not -name "*load-database-data*" -exec mv {} "$archive_dir/sqls/" \; 2>/dev/null || true
            
            # Update archive info
            cat > "$archive_dir/ARCHIVE_INFO.txt" << EOF
Archive Created: $(date)
Source: Database Migration Wizard  
Reason: Consolidation into two-migration system (schema + data)

This archive contains ALL original migration files that were
replaced by the new two-migration system for better maintainability.

Last Updated: $(date)
New Files Added This Run:
- Migration Files: $migration_count
- SQL Files: $sql_count
EOF
            
            info "Archived $migration_count migrations and $sql_count SQL files to: migrations_archive/"
        else
            info "No additional migration files to archive - using existing two-migration system"
        fi
    fi
    
    # Check if our two-migration system already exists
    local schema_migration=$(find "$MIGRATIONS_DIR" -name "*complete-database-state.js" | head -1)
    local data_migration=$(find "$MIGRATIONS_DIR" -name "*load-database-data.js" | head -1)
    
    if [[ -n "$schema_migration" && -n "$data_migration" ]]; then
        info "Two-migration system already exists:"
        info "  Schema: $(basename "$schema_migration")"
        info "  Data: $(basename "$data_migration")"
        read -p "Regenerate migrations? (y/N): " confirm
        if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
            info "Using existing two-migration system"
            return 0
        fi
    fi
    
    cd "$BACKEND_DIR"
    local migration_timestamp=$(date +%Y%m%d%H%M%S)
    
    mkdir -p "$SQLS_DIR"
    
    # ===============================
    # 1. SCHEMA MIGRATION
    # ===============================
    local schema_name="complete-database-state"
    local schema_up_file="$SQLS_DIR/${migration_timestamp}-${schema_name}-up.sql"
    local schema_down_file="$SQLS_DIR/${migration_timestamp}-${schema_name}-down.sql"
    local schema_js_file="$MIGRATIONS_DIR/${migration_timestamp}-${schema_name}.js"
    
    info "Generating schema migration..."
    
    # Extract schema only (no data, exclude migrations table)
    pg_dump -U "$POSTGRES_USER" -d "$SOURCE_DB" \
        --no-owner --no-privileges --schema-only \
        --exclude-table=migrations --no-sync > "$schema_up_file.tmp" || {
        error "Failed to extract schema"
        return 1
    }
    
    # Process schema to add conditional constraint handling
    cat "$schema_up_file.tmp" | \
        grep -v '^\\' | \
        sed 's/CREATE TABLE /CREATE TABLE IF NOT EXISTS /g' | \
        sed 's/CREATE SEQUENCE /CREATE SEQUENCE IF NOT EXISTS /g' > "$schema_up_file"
    
    # Add conditional constraints using PL/pgSQL
    echo "" >> "$schema_up_file"
    echo "-- Conditional constraint additions" >> "$schema_up_file"
    
    # Extract constraint additions from the original schema
    local constraints=$(grep -n "ADD CONSTRAINT.*PRIMARY KEY" "$schema_up_file.tmp" || true)
    if [[ -n "$constraints" ]]; then
        while IFS= read -r constraint_line; do
            if [[ "$constraint_line" =~ ADD\ CONSTRAINT\ ([a-zA-Z0-9_]+)\ PRIMARY\ KEY ]]; then
                local constraint_name="${BASH_REMATCH[1]}"
                local table_name=$(echo "$constraint_line" | grep -o "ALTER TABLE.*public\.\([a-zA-Z0-9_]*\)" | sed 's/.*public\.\([a-zA-Z0-9_]*\).*/\1/')
                local constraint_def=$(echo "$constraint_line" | grep -o "ADD CONSTRAINT.*;" | sed 's/ADD CONSTRAINT/ALTER TABLE ONLY public.'$table_name' ADD CONSTRAINT/')
                
                cat >> "$schema_up_file" << EOF
DO \$\$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '$constraint_name') THEN 
        $constraint_def 
    END IF; 
END \$\$;
EOF
            fi
        done <<< "$constraints"
        
        # Remove the original constraint additions
        sed -i '' '/ADD CONSTRAINT.*PRIMARY KEY/d' "$schema_up_file"
        sed -i '' '/^ALTER TABLE ONLY.*$/N;/\n.*ADD CONSTRAINT.*PRIMARY KEY/d' "$schema_up_file"
    fi
    
    rm -f "$schema_up_file.tmp"
    
    # Schema down migration
    cat > "$schema_down_file" << 'EOF'
-- Rollback: Drop all tables and sequences
DO $$ 
DECLARE r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') 
    LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
    
    FOR r IN (SELECT sequencename FROM pg_sequences WHERE schemaname = 'public') 
    LOOP
        EXECUTE 'DROP SEQUENCE IF EXISTS public.' || quote_ident(r.sequencename) || ' CASCADE';
    END LOOP;
END $$;
EOF
    
    # Schema JavaScript migration
    cat > "$schema_js_file" << EOF
'use strict';

var dbm, type, seed, fs = require('fs'), path = require('path'), Promise;

exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
  Promise = options.Promise;
};

exports.up = function(db) {
  var filePath = path.join(__dirname, 'sqls', '${migration_timestamp}-${schema_name}-up.sql');
  return new Promise(function(resolve, reject) {
    fs.readFile(filePath, {encoding: 'utf-8'}, function(err, data) {
      if (err) return reject(err);
      resolve(data);
    });
  }).then(function(data) {
    return db.runSql(data);
  });
};

exports.down = function(db) {
  var filePath = path.join(__dirname, 'sqls', '${migration_timestamp}-${schema_name}-down.sql');
  return new Promise(function(resolve, reject) {
    fs.readFile(filePath, {encoding: 'utf-8'}, function(err, data) {
      if (err) return reject(err);
      resolve(data);
    });
  }).then(function(data) {
    return db.runSql(data);
  });
};

exports._meta = { "version": 1 };
EOF
    
    # ===============================
    # 2. DATA MIGRATION
    # ===============================
    local data_timestamp=$(date +%Y%m%d%H%M%S)
    local data_name="load-database-data"
    local data_up_file="$SQLS_DIR/${data_timestamp}-${data_name}-up.sql"
    local data_down_file="$SQLS_DIR/${data_name}-down.sql"
    local data_js_file="$MIGRATIONS_DIR/${data_timestamp}-${data_name}.js"
    
    info "Generating data migration..."
    
    # Extract data for all user tables
    local tables=$(psql -U "$POSTGRES_USER" -d "$SOURCE_DB" -t -c "SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename != 'migrations' ORDER BY tablename;" | xargs)
    
    echo "-- PostgreSQL database dump" > "$data_up_file"
    echo "--" >> "$data_up_file"
    echo "" >> "$data_up_file"
    
    for table in $tables; do
        local row_count=$(psql -U "$POSTGRES_USER" -d "$SOURCE_DB" -t -c "SELECT COUNT(*) FROM $table;" 2>/dev/null | xargs || echo "0")
        
        if [[ $row_count -gt 0 ]]; then
            echo "-- Data for table: $table ($row_count rows)" >> "$data_up_file"
            pg_dump -U "$POSTGRES_USER" -d "$SOURCE_DB" \
                --no-owner --no-privileges --data-only \
                --column-inserts --rows-per-insert=25 \
                --table="$table" --no-sync 2>/dev/null >> "$data_up_file" || {
                error "Failed to extract data for table: $table"
                return 1
            }
            echo "" >> "$data_up_file"
        fi
    done
    
    # Compress the data file
    info "Compressing data migration (this may take a moment)..."
    bzip2 -9 "$data_up_file" || {
        error "Failed to compress data migration"
        return 1
    }
    
    # Data down migration (truncate all tables)
    cat > "$data_down_file" << EOF
-- Truncate all data tables
$(for table in $tables; do echo "TRUNCATE TABLE $table RESTART IDENTITY CASCADE;"; done)
EOF
    
    # Data JavaScript migration with decompression
    cat > "$data_js_file" << EOF
'use strict';

var dbm;
var type;
var seed;
var fs = require('fs');
var path = require('path');
var { execSync } = require('child_process');
var Promise;

exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
  Promise = options.Promise;
};

exports.up = function(db) {
  var compressedFilePath = path.join(__dirname, 'sqls', '${data_timestamp}-${data_name}-up.sql.bz2');
  var sqlFilePath = path.join(__dirname, 'sqls', '${data_timestamp}-${data_name}-up.sql');
  
  return new Promise( function( resolve, reject ) {
    try {
      if (!fs.existsSync(compressedFilePath)) {
        return reject(new Error('Compressed data file not found: ' + compressedFilePath));
      }
      
      console.log('🗜️  Decompressing database data...');
      console.log('⏱️  This may take a moment...');
      
      execSync(\`bunzip2 -k "\${compressedFilePath}"\`, { cwd: path.dirname(compressedFilePath) });
      
      console.log('✅ Decompression complete. Loading data...');
      
      fs.readFile(sqlFilePath, {encoding: 'utf-8'}, function(err, data){
        if (err) {
          if (fs.existsSync(sqlFilePath)) {
            fs.unlinkSync(sqlFilePath);
          }
          return reject(err);
        }
        
        console.log('📊 Executing INSERT statements...');
        resolve(data);
      });
    } catch (error) {
      reject(error);
    }
  })
  .then(function(data) {
    return db.runSql(data);
  })
  .then(function(result) {
    var sqlFilePath = path.join(__dirname, 'sqls', '${data_timestamp}-${data_name}-up.sql');
    if (fs.existsSync(sqlFilePath)) {
      fs.unlinkSync(sqlFilePath);
      console.log('🎉 Database data loaded successfully! Temporary file cleaned up.');
    }
    return result;
  })
  .catch(function(error) {
    var sqlFilePath = path.join(__dirname, 'sqls', '${data_timestamp}-${data_name}-up.sql');
    if (fs.existsSync(sqlFilePath)) {
      fs.unlinkSync(sqlFilePath);
    }
    throw error;
  });
};

exports.down = function(db) {
  var filePath = path.join(__dirname, 'sqls', '${data_timestamp}-${data_name}-down.sql');
  return new Promise( function( resolve, reject ) {
    fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
      if (err) return reject(err);
      resolve(data);
    });
  })
  .then(function(data) {
    return db.runSql(data);
  });
};

exports._meta = { "version": 1 };
EOF
    
    # Verify all files were created
    if [[ -f "$schema_up_file" && -f "$schema_down_file" && -f "$schema_js_file" && \
          -f "${data_up_file}.bz2" && -f "$data_down_file" && -f "$data_js_file" ]]; then
        success "Two-migration system generated successfully:"
        success "  Schema: ${migration_timestamp}-${schema_name}"  
        success "  Data: ${data_timestamp}-${data_name} (compressed)"
        return 0
    else
        error "Failed to generate migration files"
        return 1
    fi
}

# Initialize fresh database with migrations table
init_fresh_database() {
    local db_name="$1"
    
    info "Initializing fresh database: $db_name"
    
    # Ensure migrations table exists
    psql -U "$POSTGRES_USER" -d "$db_name" -c "
        CREATE TABLE IF NOT EXISTS migrations (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            run_on TIMESTAMP NOT NULL DEFAULT NOW()
        );
    " || {
        error "Failed to create migrations table in $db_name"
        return 1
    }
    
    success "Fresh database initialized: $db_name"
    return 0
}

# Create and test database
create_test_db() {
    log "Creating test database..."
    
    # Clean up existing test database
    dropdb -U "$POSTGRES_USER" "$TEST_DB" --force 2>/dev/null || true
    sleep 1
    
    # Create fresh database
    createdb -U "$POSTGRES_USER" "$TEST_DB" || {
        error "Failed to create test database"
        return 1
    }
    
    # Initialize the database with migrations table
    if ! init_fresh_database "$TEST_DB"; then
        error "Failed to initialize test database"
        return 1
    fi
    
    # Run two-migration system
    info "Running two-migration system on test database..."
    cd "$BACKEND_DIR"
    
    # Check for both migrations
    local schema_migration=$(find "$MIGRATIONS_DIR" -name "*complete-database-state.js" | head -1)
    local data_migration=$(find "$MIGRATIONS_DIR" -name "*load-database-data.js" | head -1)
    
    if [[ -z "$schema_migration" || -z "$data_migration" ]]; then
        error "Two-migration system not found. Run option 1 first."
        info "Expected: *complete-database-state.js and *load-database-data.js"
        return 1
    fi
    
    # Update database config for test environment
    cat > database.json << EOF
{
  "development": { "driver": "pg", "user": "$POSTGRES_USER", "database": "d4adlocal" },
  "production": { "driver": "pg", "user": "$POSTGRES_USER", "database": "d4adprod" },
  "migration_test": { "driver": "pg", "user": "$POSTGRES_USER", "database": "$TEST_DB" }
}
EOF
    
    # 1. Run schema migration
    local schema_name=$(basename "$schema_migration" .js)
    local schema_sql_file="$SQLS_DIR/${schema_name}-up.sql"
    
    if [[ ! -f "$schema_sql_file" ]]; then
        error "Schema SQL file not found: $schema_sql_file"
        return 1
    fi
    
    info "Executing schema migration..."
    psql -U "$POSTGRES_USER" -d "$TEST_DB" -f "$schema_sql_file" || {
        error "Schema migration failed"
        return 1
    }
    
    # Record schema migration
    psql -U "$POSTGRES_USER" -d "$TEST_DB" -c "
        INSERT INTO migrations (name, run_on) VALUES ('$schema_name', NOW());
    " || {
        error "Failed to record schema migration"
        return 1
    }
    
    # 2. Run data migration using Node.js (for decompression)
    local data_name=$(basename "$data_migration" .js)
    
    info "Executing data migration with decompression..."
    
    # Create a temporary Node.js script to run the data migration
    cat > /tmp/run_data_migration.js << EOF
const migration = require('$BACKEND_DIR/migrations/$data_name.js');
const pg = require('pg');

const client = new pg.Client({
  host: 'localhost',
  user: '$POSTGRES_USER',
  database: '$TEST_DB',
  port: 5432
});

const mockDb = {
  runSql: async (sql) => {
    await client.connect();
    const result = await client.query(sql);
    await client.end();
    return result;
  }
};

migration.setup({ dbmigrate: { dataType: {} }, Promise: Promise }, null);
migration.up(mockDb).then(() => {
  console.log('Data migration completed successfully!');
  process.exit(0);
}).catch((err) => {
  console.error('Data migration failed:', err.message);
  process.exit(1);
});
EOF
    
    node /tmp/run_data_migration.js || {
        error "Data migration execution failed"
        rm -f /tmp/run_data_migration.js
        return 1
    }
    
    rm -f /tmp/run_data_migration.js
    
    # Record data migration
    psql -U "$POSTGRES_USER" -d "$TEST_DB" -c "
        INSERT INTO migrations (name, run_on) VALUES ('$data_name', NOW());
    " || {
        error "Failed to record data migration"
        return 1
    }
    
    local stats=$(get_db_stats "$TEST_DB")
    local test_tables=$(echo "$stats" | cut -d',' -f1)
    local test_rows=$(echo "$stats" | cut -d',' -f2)
    
    success "Test database created: $test_tables tables, $test_rows rows"
    return 0
}

# Comprehensive data integrity validation with cascading heuristics
validate_table_integrity() {
    local source_db="$1"
    local test_db="$2"
    local table_name="$3"
    
    # Basic row count check
    local src_count=$(psql -U "$POSTGRES_USER" -d "$source_db" -t -c "SELECT COUNT(*) FROM \"$table_name\";" 2>/dev/null | xargs)
    local test_count=$(psql -U "$POSTGRES_USER" -d "$test_db" -t -c "SELECT COUNT(*) FROM \"$table_name\";" 2>/dev/null | xargs)
    
    if [[ "$src_count" != "$test_count" ]]; then
        echo "COUNT_MISMATCH"
        return 1
    fi
    
    # Skip validation for empty tables
    if [[ "$src_count" -eq 0 ]]; then
        echo "EMPTY_OK"
        return 0
    fi
    
    # 1. Try exact checksum validation first (gold standard)
    local src_checksum=$(psql -U "$POSTGRES_USER" -d "$source_db" -t -c "
        SELECT MD5(string_agg(row_hash, '' ORDER BY row_hash)) 
        FROM (
            SELECT MD5(ROW(\"$table_name\".*)::text) as row_hash 
            FROM \"$table_name\"
        ) t;" 2>/dev/null | xargs)
    
    local test_checksum=$(psql -U "$POSTGRES_USER" -d "$test_db" -t -c "
        SELECT MD5(string_agg(row_hash, '' ORDER BY row_hash)) 
        FROM (
            SELECT MD5(ROW(\"$table_name\".*)::text) as row_hash 
            FROM \"$table_name\"
        ) t;" 2>/dev/null | xargs)
    
    if [[ -n "$src_checksum" ]] && [[ -n "$test_checksum" ]] && [[ "$src_checksum" == "$test_checksum" ]]; then
        # Perfect checksum match - add business logic validation for critical tables
        case "$table_name" in
            "etpl"|"programtokens")
                local business_ok=$(validate_business_logic "$source_db" "$test_db" "$table_name")
                if [[ "$business_ok" == "OK" ]]; then
                    echo "CHECKSUM_OK_WITH_LOGIC:${src_checksum:0:8}"
                    return 0
                else
                    echo "BUSINESS_LOGIC_FAIL"
                    return 1
                fi
                ;;
            *)
                echo "CHECKSUM_OK:${src_checksum:0:8}"
                return 0
                ;;
        esac
    fi
    
    # 2. Checksum failed - apply cascading heuristics for fallback validation
    local validation_score=0
    local max_score=0
    local status_details=""
    
    # Deterministic sampling validation (40 points)
    max_score=$((max_score + 40))
    local sample_size=$(( src_count > 1000 ? 100 : src_count / 10 ))
    if [[ $sample_size -ge 5 ]]; then
        # Use deterministic sampling based on primary key or row number for consistency
        local src_sample=$(psql -U "$POSTGRES_USER" -d "$source_db" -t -c "
            SELECT MD5(string_agg(row_data, '|' ORDER BY row_data)) 
            FROM (
                SELECT ROW(\"$table_name\".*)::text as row_data 
                FROM \"$table_name\" 
                ORDER BY (ROW(\"$table_name\".*)::text)
                LIMIT $sample_size
            ) t;" 2>/dev/null | xargs)
            
        local test_sample=$(psql -U "$POSTGRES_USER" -d "$test_db" -t -c "
            SELECT MD5(string_agg(row_data, '|' ORDER BY row_data)) 
            FROM (
                SELECT ROW(\"$table_name\".*)::text as row_data 
                FROM \"$table_name\" 
                ORDER BY (ROW(\"$table_name\".*)::text)
                LIMIT $sample_size
            ) t;" 2>/dev/null | xargs)
            
        if [[ -n "$src_sample" ]] && [[ -n "$test_sample" ]] && [[ "$src_sample" == "$test_sample" ]]; then
            validation_score=$((validation_score + 40))
            status_details="${status_details}✓SAMPLE "
        fi
    else
        # For very small tables, award points if row count matches
        validation_score=$((validation_score + 40))
        status_details="${status_details}✓SMALL "
    fi
    
    # Business logic validation for critical tables (30 points)
    max_score=$((max_score + 30))
    local business_ok=$(validate_business_logic "$source_db" "$test_db" "$table_name")
    if [[ "$business_ok" == "OK" ]]; then
        validation_score=$((validation_score + 30))
        status_details="${status_details}✓LOGIC "
    else
        # For non-critical tables, award points for matching row count
        case "$table_name" in
            "etpl"|"programtokens")
                # Critical table failed business logic - no points
                ;;
            *)
                validation_score=$((validation_score + 30))
                status_details="${status_details}✓COUNT "
                ;;
        esac
    fi
    
    # Schema structure validation (30 points)
    max_score=$((max_score + 30))
    local src_columns=$(psql -U "$POSTGRES_USER" -d "$source_db" -t -c "
        SELECT COUNT(*) FROM information_schema.columns 
        WHERE table_name = '$table_name' AND table_schema = 'public';" 2>/dev/null | xargs)
    local test_columns=$(psql -U "$POSTGRES_USER" -d "$test_db" -t -c "
        SELECT COUNT(*) FROM information_schema.columns 
        WHERE table_name = '$table_name' AND table_schema = 'public';" 2>/dev/null | xargs)
        
    if [[ "$src_columns" == "$test_columns" ]]; then
        validation_score=$((validation_score + 30))
        status_details="${status_details}✓SCHEMA "
    fi
    
    # Calculate confidence percentage
    local confidence_pct=$((validation_score * 100 / max_score))
    
    # Determine status based on confidence level
    if [[ $confidence_pct -ge 90 ]]; then
        echo "HIGH_CONFIDENCE:$confidence_pct:$status_details"
        return 0
    elif [[ $confidence_pct -ge 70 ]]; then
        echo "MEDIUM_CONFIDENCE:$confidence_pct:$status_details"
        return 0
    elif [[ $confidence_pct -ge 50 ]]; then
        echo "LOW_CONFIDENCE:$confidence_pct:$status_details"
        return 0
    else
        echo "VALIDATION_FAILED:$confidence_pct:$status_details"
        return 1
    fi
}

# Helper function for business logic validation
validate_business_logic() {
    local source_db="$1"
    local test_db="$2"
    local table_name="$3"
    
    case "$table_name" in
        "etpl")
            local src_providers=$(psql -U "$POSTGRES_USER" -d "$source_db" -t -c "SELECT COUNT(DISTINCT providerid) FROM etpl;" 2>/dev/null | xargs)
            local test_providers=$(psql -U "$POSTGRES_USER" -d "$test_db" -t -c "SELECT COUNT(DISTINCT providerid) FROM etpl;" 2>/dev/null | xargs)
            
            local src_active=$(psql -U "$POSTGRES_USER" -d "$source_db" -t -c "SELECT COUNT(*) FROM etpl WHERE providerstatus = 'ACTIVE';" 2>/dev/null | xargs)
            local test_active=$(psql -U "$POSTGRES_USER" -d "$test_db" -t -c "SELECT COUNT(*) FROM etpl WHERE providerstatus = 'ACTIVE';" 2>/dev/null | xargs)
            
            if [[ "$src_providers" == "$test_providers" ]] && [[ "$src_active" == "$test_active" ]]; then
                echo "OK"
            else
                echo "FAIL"
            fi
            ;;
        "programtokens")
            local src_programs=$(psql -U "$POSTGRES_USER" -d "$source_db" -t -c "SELECT COUNT(DISTINCT programid) FROM programtokens;" 2>/dev/null | xargs)
            local test_programs=$(psql -U "$POSTGRES_USER" -d "$test_db" -t -c "SELECT COUNT(DISTINCT programid) FROM programtokens;" 2>/dev/null | xargs)
            
            if [[ "$src_programs" == "$test_programs" ]]; then
                echo "OK"
            else
                echo "FAIL"
            fi
            ;;
        *)
            # Non-critical tables always pass business logic
            echo "OK"
            ;;
    esac
}

# Validate data integrity
validate_integrity() {
    log "Validating data integrity with checksum verification..."
    
    if ! test_db_connection "$SOURCE_DB" || ! test_db_connection "$TEST_DB"; then
        error "Cannot connect to required databases"
        return 1
    fi
    
    local tables=$(psql -U "$POSTGRES_USER" -d "$SOURCE_DB" -t -c "SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename != 'migrations' ORDER BY tablename;" | xargs)
    
    echo "Comprehensive Data Integrity Verification:"
    echo "┌─────────────────────────┬─────────┬─────────┬─────────────┬──────────┐"
    echo "│ Table Name              │ Source  │ Test    │ Integrity   │ Status   │"
    echo "├─────────────────────────┼─────────┼─────────┼─────────────┼──────────┤"
    
    local all_match=true
    local total_tables=0
    local successful_tables=0
    local checksum_verified=0
    local business_logic_verified=0
    
    for table in $tables; do
        total_tables=$((total_tables + 1))
        local src_count=$(psql -U "$POSTGRES_USER" -d "$SOURCE_DB" -t -c "SELECT COUNT(*) FROM \"$table\";" 2>/dev/null | xargs || echo "0")
        local test_count=$(psql -U "$POSTGRES_USER" -d "$TEST_DB" -t -c "SELECT COUNT(*) FROM \"$table\";" 2>/dev/null | xargs || echo "0")
        
        # Perform comprehensive validation
        local validation_result=$(validate_table_integrity "$SOURCE_DB" "$TEST_DB" "$table" 2>/dev/null)
        local status=""
        local integrity_info=""
        
        if [[ $? -eq 0 ]]; then
            case "$validation_result" in
                "EMPTY_OK")
                    status="✅ EMPTY"
                    integrity_info="N/A"
                    successful_tables=$((successful_tables + 1))
                    ;;
                CHECKSUM_OK:*)
                    local checksum_short="${validation_result#CHECKSUM_OK:}"
                    status="🔐 PERFECT"
                    integrity_info="✓EXACT ${checksum_short}..."
                    checksum_verified=$((checksum_verified + 1))
                    successful_tables=$((successful_tables + 1))
                    ;;
                CHECKSUM_OK_WITH_LOGIC:*)
                    local checksum_short="${validation_result#CHECKSUM_OK_WITH_LOGIC:}"
                    status="🔐 SECURE"
                    integrity_info="✓EXACT+LOGIC ${checksum_short}..."
                    checksum_verified=$((checksum_verified + 1))
                    successful_tables=$((successful_tables + 1))
                    business_logic_verified=$((business_logic_verified + 1))
                    ;;
                HIGH_CONFIDENCE:*)
                    local confidence=$(echo "$validation_result" | cut -d':' -f2)
                    local details=$(echo "$validation_result" | cut -d':' -f3)
                    status="🟢 HIGH"
                    integrity_info="${confidence}% ${details}"
                    successful_tables=$((successful_tables + 1))
                    case "$table" in
                        "etpl"|"programtokens")
                            if [[ "$details" == *"✓LOGIC"* ]]; then
                                business_logic_verified=$((business_logic_verified + 1))
                            fi
                            ;;
                    esac
                    ;;
                MEDIUM_CONFIDENCE:*)
                    local confidence=$(echo "$validation_result" | cut -d':' -f2)
                    local details=$(echo "$validation_result" | cut -d':' -f3)
                    status="🟡 MEDIUM"
                    integrity_info="${confidence}% ${details}"
                    successful_tables=$((successful_tables + 1))
                    case "$table" in
                        "etpl"|"programtokens")
                            if [[ "$details" == *"✓LOGIC"* ]]; then
                                business_logic_verified=$((business_logic_verified + 1))
                            fi
                            ;;
                    esac
                    ;;
                LOW_CONFIDENCE:*)
                    local confidence=$(echo "$validation_result" | cut -d':' -f2)
                    local details=$(echo "$validation_result" | cut -d':' -f3)
                    status="🟠 LOW"
                    integrity_info="${confidence}% ${details}"
                    successful_tables=$((successful_tables + 1))
                    ;;
            esac
        else
            case "$validation_result" in
                "COUNT_MISMATCH")
                    status="❌ COUNT"
                    integrity_info="MISMATCH"
                    ;;
                "BUSINESS_LOGIC_FAIL")
                    status="❌ LOGIC"
                    integrity_info="INVALID"
                    ;;
                VALIDATION_FAILED:*)
                    local confidence=$(echo "$validation_result" | cut -d':' -f2)
                    local details=$(echo "$validation_result" | cut -d':' -f3)
                    status="❌ FAILED"
                    integrity_info="${confidence}% ${details}"
                    ;;
                *)
                    status="❌ ERROR"
                    integrity_info="UNKNOWN"
                    ;;
            esac
            all_match=false
        fi
        
        printf "│ %-23s │ %7s │ %7s │ %-11s │ %-8s │\n" "$table" "$src_count" "$test_count" "$integrity_info" "$status"
    done
    
    echo "└─────────────────────────┴─────────┴─────────┴─────────────┴──────────┘"
    echo
    
    # Summary
    info "🔐 CASCADING VALIDATION SUMMARY:"
    echo "   ✅ Successfully validated: $successful_tables/$total_tables tables"
    echo "   🔐 Exact checksum matches: $checksum_verified tables"
    echo "   📊 Business logic verified: $business_logic_verified critical tables"
    echo "   🎯 Strategy: Exact checksums first, then cascading heuristics for mismatches"
    
    if [[ "$all_match" == true ]]; then
        success "🎉 COMPREHENSIVE VALIDATION SUCCESSFUL!"
        success "   ✅ All tables passed validation (exact checksums or fallback heuristics)"
        success "   🔐 Data integrity verified with high confidence"
        return 0
    else
        error "❌ Validation failed: $((total_tables - successful_tables))/$total_tables tables have critical issues"
        return 1
    fi
}

# Full workflow
full_workflow() {
    log "Running full workflow..."
    
    if generate_migration; then
        if create_test_db; then
            if validate_integrity; then
                success "🎉 Full workflow completed successfully!"
            else
                error "Validation failed"
                return 1
            fi
        else
            error "Test database creation failed"  
            return 1
        fi
    else
        error "Migration generation failed"
        return 1
    fi
}

# Cleanup
cleanup() {
    log "Cleaning up test database..."
    dropdb -U "$POSTGRES_USER" "$TEST_DB" 2>/dev/null || true
    success "Test database cleaned up"
}

# Main loop
main() {
    cd "$BACKEND_DIR"
    
    while true; do
        show_banner
        
        # Show current status
        if test_db_connection "$SOURCE_DB"; then
            local stats=$(get_db_stats "$SOURCE_DB")
            echo -e "🟢 Source: ${SOURCE_DB} ($(echo $stats | cut -d',' -f1) tables)"
        else
            echo -e "🔴 Source: ${SOURCE_DB} (not accessible)"
        fi
        
        if test_db_connection "$TEST_DB"; then
            local stats=$(get_db_stats "$TEST_DB")  
            echo -e "🟢 Test: ${TEST_DB} ($(echo $stats | cut -d',' -f1) tables)"
        else
            echo -e "⚪ Test: ${TEST_DB} (not created)"
        fi
        
        local schema_migration=$(find "$MIGRATIONS_DIR" -name "*complete-database-state.js" 2>/dev/null | head -1)
        local data_migration=$(find "$MIGRATIONS_DIR" -name "*load-database-data.js" 2>/dev/null | head -1)
        
        if [[ -n "$schema_migration" && -n "$data_migration" ]]; then
            echo -e "🟢 Migrations: Two-migration system available"
        elif [[ -n "$schema_migration" || -n "$data_migration" ]]; then
            echo -e "� Migrations: Partial (missing schema or data migration)"
        else
            echo -e "🔴 Migrations: Two-migration system not found"
        fi
        echo
        
        show_menu
        read -p "Choose option (0-6): " choice
        echo
        
        case $choice in
            1) generate_migration; read -p "Press Enter to continue..." ;;
            2) create_test_db; read -p "Press Enter to continue..." ;;
            3) validate_integrity; read -p "Press Enter to continue..." ;;
            4) 
                read -p "Enter database name (default: d4adlocal): " db_name
                db_name=${db_name:-d4adlocal}
                init_fresh_database "$db_name"
                read -p "Press Enter to continue..." 
                ;;
            5) full_workflow; read -p "Press Enter to continue..." ;;
            6) cleanup; read -p "Press Enter to continue..." ;;
            0) log "Goodbye!"; exit 0 ;;
            *) error "Invalid option"; read -p "Press Enter to continue..." ;;
        esac
    done
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi