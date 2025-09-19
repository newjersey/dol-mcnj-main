# Secure Data Export for Analysts

## Overview

Secure methods for analysts to access encrypted subscriber data with complete audit trails and multi-layer security.

## Export Solutions

### Option 1: Automated Email Export (Recommended for Non-Technical Users)
- **How it works**: Weekly automated emails with password-protected ZIP files
- **Security**: AES-256 encryption, 24-hour expiration, complete audit logs
- **Setup**: Lambda deployment (see [deployment guide](LAMBDA_DEPLOYMENT_GUIDE.md))
- **Requirements**: Corporate email accounts, encrypted devices

### Option 2: Secure CLI Tool (For Technical Users)
- **How it works**: Command-line tool on secure server with direct database access
- **Security**: Air-gapped execution, no web exposure, immediate file cleanup
- **Setup**: Server access required
- **Best for**: One-time exports or technical staff

## CLI Tool Usage

### Prerequisites
- Server SSH access with admin privileges
- AWS credentials with DynamoDB/KMS permissions
- Secure environment variables configured

### Quick Commands
```bash
# Validate configuration
npm run data-export validate

# Get statistics (no export)
npm run data-export stats --start-date "2025-01-01" --end-date "2025-12-31"

# Export data
npm run data-export export --limit 10000 --status "subscribed" --output "q4_subscribers"

# Preview only (dry run)
npm run data-export export --dry-run --limit 5000
```

### Output
- CSV format with email, firstName, lastName, status, timestamps
- Files saved to `/tmp/secure-exports/` with 600 permissions
- Complete audit logging to `/var/log/data-export/export-audit.log`

## Security Requirements

### All Users
- Corporate email accounts only (no Gmail, Yahoo, etc.)
- Encrypted devices with endpoint protection
- Security training completion
- Incident reporting procedures

### Data Handling
- **Store**: Company-approved devices only
- **Delete**: Immediately after analysis completion
- **Never**: Forward emails, share passwords, use personal cloud storage

## Getting Started

1. **Request access**: Submit data access request with business justification
2. **Complete training**: Data handling security protocols
3. **Choose method**: Email automation (easier) or CLI tool (more secure)
4. **Contact IT**: For deployment assistance

## Support

- **Technical issues**: IT Support
- **Security concerns**: IT Security team
- **Training**: HR security awareness portal