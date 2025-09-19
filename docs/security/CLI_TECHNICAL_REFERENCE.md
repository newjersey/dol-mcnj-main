# CLI Tool Technical Reference

## Prerequisites

### Server Access
- SSH access to application server
- Admin privileges for file operations
- AWS credentials with DynamoDB/KMS permissions

### Environment Variables
```bash
AWS_REGION=us-east-1
DDB_TABLE_NAME=marketing-userEmails  
KMS_KEY_ID=arn:aws:kms:us-east-1:account:key/key-id
AUDIT_LOG_DIR=/var/log/data-export
EXPORT_OUTPUT_DIR=/tmp/secure-exports
```

### File System Setup
```bash
sudo mkdir -p /var/log/data-export /tmp/secure-exports
sudo chmod 750 /var/log/data-export
sudo chmod 700 /tmp/secure-exports
sudo chown app-user:app-group /var/log/data-export /tmp/secure-exports
```

## CLI Usage

The data export tool uses Commander.js for a professional command-line interface with built-in help, validation, and error handling.

### Getting Help
```bash
# General help
npx ts-node src/scripts/data-export-cli.ts --help

# Command-specific help  
npx ts-node src/scripts/data-export-cli.ts export --help
npx ts-node src/scripts/data-export-cli.ts stats --help
npx ts-node src/scripts/data-export-cli.ts validate --help
```

### Commands

#### System Validation
```bash
npx ts-node src/scripts/data-export-cli.ts validate
```
Validates:
- Environment variables are properly set
- AWS credentials and permissions
- Directory permissions and access
- KMS key accessibility

#### Statistics (No Export)
```bash
# Basic table statistics
npx ts-node src/scripts/data-export-cli.ts stats

# Filtered statistics
npx ts-node src/scripts/data-export-cli.ts stats --start-date "2025-01-01" --end-date "2025-12-31"
npx ts-node src/scripts/data-export-cli.ts stats --status "subscribed"
```

#### Data Export
```bash
npx ts-node src/scripts/data-export-cli.ts export [options]

Options:
  -l, --limit <number>     Maximum number of records to export (default: 1000, max: 50000)
  -s, --start-date <date>  Start date filter (ISO 8601 format)
  -e, --end-date <date>    End date filter (ISO 8601 format)
  --status <status>        Filter by subscription status (subscribed, unsubscribed, pending)
  -o, --output <filename>  Output filename prefix (default: "subscribers_export")
  --dry-run                Show export preview without creating files
```

### Example Commands
```bash
# Basic export (1000 records)
npx ts-node src/scripts/data-export-cli.ts export

# Large filtered export
npx ts-node src/scripts/data-export-cli.ts export \
  --limit 10000 \
  --status "subscribed" \
  --output "q4_active_subscribers"

# Date range export
npx ts-node src/scripts/data-export-cli.ts export \
  --start-date "2025-01-01T00:00:00Z" \
  --end-date "2025-12-31T23:59:59Z" \
  --limit 25000

# Preview export without creating files
npx ts-node src/scripts/data-export-cli.ts export \
  --dry-run \
  --limit 5000 \
  --status "subscribed"
```

## Output

### CSV Format
```csv
email,firstName,lastName,status,createdAt,updatedAt
john.doe@example.com,John,Doe,subscribed,2025-01-15T10:30:00Z,2025-01-15T10:30:00Z
```

### File Locations
- **Output**: `/tmp/secure-exports/filename_timestamp.csv`
- **Audit logs**: `/var/log/data-export/export-audit.log`
- **File permissions**: 600 (owner read/write only)

### Audit Log Format
```json
{
  "timestamp": "2025-09-16T14:30:15.123Z",
  "operationId": "12345678-1234-1234-1234-123456789012",
  "operation": "EXPORT_SUCCESS",
  "success": true,
  "user": "admin-user",
  "recordCount": 8542,
  "outputPath": "/tmp/secure-exports/subscribers_export_2025-09-16T14-30-00-000Z.csv"
}
```

## Troubleshooting

### Common Errors

**Environment validation fails:**
- Check environment variables are set
- Ensure not running in web server environment
- Verify directory permissions

**Permission errors:**
- Update IAM role for DynamoDB/KMS access
- Check AWS credentials configuration

**Decryption failures:**
- Verify KMS key permissions and region
- Check network connectivity to AWS

### Log Analysis
```bash
# Count exports in last 30 days
grep "EXPORT_SUCCESS" /var/log/data-export/export-audit.log | \
  jq -r 'select(.timestamp > "2025-08-16T00:00:00Z")' | wc -l

# Find large exports (>10k records)
grep "EXPORT_SUCCESS" /var/log/data-export/export-audit.log | \
  jq 'select(.recordCount > 10000)'
```

## Security Features

- **Environment validation**: Checks secure execution context
- **Access control**: Server access required, no web exposure
- **File permissions**: Restrictive permissions from creation
- **Audit logging**: Complete operation tracking
- **Memory protection**: Keys cleared after use
- **Automatic cleanup**: Time-based file expiration