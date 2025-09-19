# Encryption Guide

This guide covers the encryption implementation for signup email storage.

## Overview

All signup emails are encrypted using AWS KMS and AES-256-GCM encryption before storage in DynamoDB.

## How It Works

1. **Signup Request**: User submits email via signup form
2. **Encryption**: Email is encrypted using AWS KMS + AES-256-GCM
3. **Search Hash**: A secure hash is generated for duplicate detection
4. **Storage**: Encrypted data and hash are stored in DynamoDB
5. **Retrieval**: Data is decrypted when needed for business operations

## Implementation

### Main Controller
**File**: `backend/src/controllers/signUpController.ts`
- Handles all signup requests
- Always uses encrypted storage
- Validates and sanitizes input

### Encryption Service
**File**: `backend/src/utils/piiEncryption.ts`
- `encryptPII()` - Encrypts email addresses
- `decryptPII()` - Decrypts when needed  
- `generateSearchHash()` - Creates searchable hash

### Storage Service
**File**: `backend/src/dynamodb/writeSignupEmailsEncrypted.ts`
- Stores encrypted data in DynamoDB
- Handles duplicate detection via search hash
- Includes audit logging

## Environment Setup

Required environment variables:
```bash
AWS_KMS_KEY_ID=your-kms-key-id
AWS_REGION=your-aws-region
DYNAMODB_TABLE_NAME=your-table-name
```

## Security Features

- **PII Redaction**: Sensitive data is redacted from logs
- **Input Validation**: Email format and length validation
- **Duplicate Detection**: Using secure search hashes
- **Audit Logging**: All operations are logged securely
- **Error Handling**: No sensitive data in error messages

## Testing

Run encryption tests:
```bash
cd backend
npm test -- --testPathPattern=piiEncryption
```

## Monitoring

- Check CloudWatch logs for audit events
- Monitor KMS key usage in AWS Console
- Review DynamoDB metrics for performance