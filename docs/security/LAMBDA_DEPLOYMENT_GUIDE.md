# Secure Email Export - Deployment Guide

## Quick Setup

### 1. Install Dependencies
```bash
cd backend
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner @aws-sdk/client-sesv2 @types/aws-lambda archiver
```

### 2. Build and Package
```bash
npm run build
cd dist
zip -r ../secure-export-lambda.zip . -x "*.test.*" "*.spec.*"
```

### 3. Deploy Lambda
```bash
# Create function
aws lambda create-function \
  --function-name secure-data-export \
  --runtime nodejs18.x \
  --role arn:aws:iam::ACCOUNT:role/secure-export-lambda-role \
  --handler automatedExportLambda.handler \
  --zip-file fileb://secure-export-lambda.zip \
  --timeout 300 \
  --memory-size 512

# Configure environment
aws lambda update-function-configuration \
  --function-name secure-data-export \
  --environment Variables='{
    "DDB_TABLE_NAME":"your-table-name",
    "FROM_EMAIL":"no-reply@dol.nj.gov",
    "ANALYST_EMAILS":"analyst1@dol.nj.gov,analyst2@dol.nj.gov",
    "CC_SECURITY_EMAIL":"security@dol.nj.gov",
    "EXPORT_S3_BUCKET":"your-secure-bucket",
    "EXPORT_SCHEDULE":"weekly"
  }'
```

### 4. Schedule Weekly Execution
```bash
# Create weekly schedule (Mondays at 9 AM)
aws events put-rule \
  --name secure-export-weekly \
  --schedule-expression "cron(0 9 ? * MON *)" \
  --description "Weekly secure data export"

# Link Lambda target
aws events put-targets \
  --rule secure-export-weekly \
  --targets "Id"="1","Arn"="arn:aws:lambda:us-east-1:ACCOUNT:function:secure-data-export"
```

## Security Features

✅ **Analyst-friendly**: Email delivery, password-protected ZIP extraction  
✅ **Multi-layer encryption**: KMS → AES-256 ZIP → S3 encryption  
✅ **Time-limited**: 24-hour download expiration with auto-cleanup  
✅ **Complete audit trail**: All operations logged and monitored  
✅ **No persistent storage**: Automatic file deletion

## Trade-offs

The solution balances security with usability for non-technical users. Files temporarily exist in email systems but are encrypted and time-limited, significantly more secure than unprotected attachments or manual processes.