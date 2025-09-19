# Security Documentation

This folder contains security-related documentation for the DOL-MCNJ application.

## Quick Start

For a fresh start migration from Mailchimp:
1. Follow [`../deployment/ENCRYPTED_SIGNUP_DEPLOYMENT.md`](../deployment/ENCRYPTED_SIGNUP_DEPLOYMENT.md) for complete deployment steps
2. Review [`ENCRYPTION_GUIDE.md`](./ENCRYPTION_GUIDE.md) for technical details
3. Reference [`KMS_KEY_MANAGEMENT.md`](./KMS_KEY_MANAGEMENT.md) for AWS setup

## Documentation Files

### Core Security Guides
- **[`ENCRYPTION_GUIDE.md`](./ENCRYPTION_GUIDE.md)** - Encryption implementation overview
- **[`PII_SAFETY_AWS_GUIDE.md`](./PII_SAFETY_AWS_GUIDE.md)** - PII safety measures and logging
- **[`KMS_KEY_MANAGEMENT.md`](./KMS_KEY_MANAGEMENT.md)** - AWS KMS setup and management

### Deployment
- **[`../deployment/ENCRYPTED_SIGNUP_DEPLOYMENT.md`](../deployment/ENCRYPTED_SIGNUP_DEPLOYMENT.md)** - Complete deployment guide

## Key Features

- **Always Encrypted**: All signup emails are encrypted by default
- **Fresh Start**: No legacy data migration needed
- **PII Safe**: All logging and error handling protects sensitive data
- **AWS KMS**: Enterprise-grade key management
- **Search Capable**: Encrypted data with searchable hashes for duplicates