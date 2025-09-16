# AWS KMS Key Management for PII Encryption

## Overview

This document outlines the AWS KMS (Key Management Service) setup required for application-level PII encryption in the DOL-MCNJ application.

## KMS Key Configuration

### Customer Managed Key (CMK) Requirements

```yaml
# Terraform Configuration
resource "aws_kms_key" "pii_encryption_key" {
  description = "Customer managed key for PII encryption in DOL-MCNJ"
  
  # Key policy
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "Enable IAM User Permissions"
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"
        }
        Action   = "kms:*"
        Resource = "*"
      },
      {
        Sid    = "Allow application encryption/decryption"
        Effect = "Allow"
        Principal = {
          AWS = [
            "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/dol-mcnj-app-role",
            "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/dol-mcnj-lambda-role"
          ]
        }
        Action = [
          "kms:Encrypt",
          "kms:Decrypt", 
          "kms:ReEncrypt*",
          "kms:GenerateDataKey*",
          "kms:DescribeKey"
        ]
        Resource = "*"
      }
    ]
  })
  
  # Enable key rotation
  enable_key_rotation = true
  
  # Deletion window
  deletion_window_in_days = 30
  
  tags = {
    Environment = var.environment
    Application = "dol-mcnj"
    Purpose     = "pii-encryption"
  }
}

resource "aws_kms_alias" "pii_encryption_key_alias" {
  name          = "alias/${var.environment}-dol-mcnj-pii-encryption"
  target_key_id = aws_kms_key.pii_encryption_key.key_id
}
```

### CloudFormation Template

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'KMS Customer Managed Key for PII Encryption'

Parameters:
  Environment:
    Type: String
    Default: 'dev'
    AllowedValues: ['dev', 'staging', 'prod']
  
  ApplicationRoleArn:
    Type: String
    Description: 'ARN of the application IAM role'

Resources:
  PIIEncryptionKey:
    Type: AWS::KMS::Key
    Properties:
      Description: !Sub 'Customer managed key for PII encryption in DOL-MCNJ ${Environment}'
      KeyPolicy:
        Version: '2012-10-17'
        Statement:
          - Sid: Enable IAM User Permissions
            Effect: Allow
            Principal:
              AWS: !Sub 'arn:aws:iam::${AWS::AccountId}:root'
            Action: 'kms:*'
            Resource: '*'
          - Sid: Allow application encryption/decryption
            Effect: Allow
            Principal:
              AWS: !Ref ApplicationRoleArn
            Action:
              - 'kms:Encrypt'
              - 'kms:Decrypt'
              - 'kms:ReEncrypt*'
              - 'kms:GenerateDataKey*'
              - 'kms:DescribeKey'
            Resource: '*'
      EnableKeyRotation: true
      KeyRotationEnabled: true
      PendingWindowInDays: 30
      Tags:
        - Key: Environment
          Value: !Ref Environment
        - Key: Application
          Value: 'dol-mcnj'
        - Key: Purpose
          Value: 'pii-encryption'

  PIIEncryptionKeyAlias:
    Type: AWS::KMS::Alias
    Properties:
      AliasName: !Sub 'alias/${Environment}-dol-mcnj-pii-encryption'
      TargetKeyId: !Ref PIIEncryptionKey

Outputs:
  KMSKeyId:
    Description: 'KMS Key ID for PII encryption'
    Value: !Ref PIIEncryptionKey
    Export:
      Name: !Sub '${Environment}-PIIEncryptionKeyId'
  
  KMSKeyArn:
    Description: 'KMS Key ARN for PII encryption'
    Value: !GetAtt PIIEncryptionKey.Arn
    Export:
      Name: !Sub '${Environment}-PIIEncryptionKeyArn'
  
  KMSKeyAlias:
    Description: 'KMS Key Alias for PII encryption'
    Value: !Ref PIIEncryptionKeyAlias
    Export:
      Name: !Sub '${Environment}-PIIEncryptionKeyAlias'
```

## IAM Role Configuration

### Application Role Permissions

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "KMSPIIEncryption",
      "Effect": "Allow",
      "Action": [
        "kms:Encrypt",
        "kms:Decrypt",
        "kms:ReEncrypt*",
        "kms:GenerateDataKey*",
        "kms:DescribeKey"
      ],
      "Resource": [
        "arn:aws:kms:*:*:key/*"
      ],
      "Condition": {
        "StringEquals": {
          "kms:ViaService": [
            "dynamodb.us-east-1.amazonaws.com"
          ]
        },
        "ForAllValues:StringEquals": {
          "kms:EncryptionContext:Purpose": "pii-encryption"
        }
      }
    }
  ]
}
```

## Security Best Practices

### 1. Key Rotation
- **Automatic rotation**: Enabled annually
- **Manual rotation**: When suspected compromise
- **Application support**: Handle multiple key versions

### 2. Access Control
- **Principle of least privilege**: Only necessary permissions
- **Environment isolation**: Separate keys per environment  
- **Audit trail**: CloudTrail logging enabled

### 3. Encryption Context
```typescript
// Use encryption context for additional security
const encryptionContext = {
  'Purpose': 'pii-encryption',
  'Environment': process.env.NODE_ENV,
  'Application': 'dol-mcnj'
};
```

### 4. Key Validation
```typescript
// Validate key access during application startup
export async function validateKMSSetup(): Promise<void> {
  const kmsKeyId = process.env.KMS_KEY_ID;
  if (!kmsKeyId) {
    throw new Error('KMS_KEY_ID environment variable not set');
  }
  
  const isValid = await validateKMSKey(kmsKeyId);
  if (!isValid) {
    throw new Error(`KMS key ${kmsKeyId} is not accessible`);
  }
  
  logger.info('KMS key validation successful', { keyId: kmsKeyId });
}
```

## Monitoring and Alerting

### CloudWatch Metrics
- KMS API calls frequency
- Encryption/decryption success rates
- Key usage patterns

### CloudTrail Events
- Key creation/deletion
- Permission changes  
- Unusual access patterns

### Alarms
```yaml
KMSEncryptionFailureAlarm:
  Type: AWS::CloudWatch::Alarm
  Properties:
    AlarmDescription: 'High KMS encryption failure rate'
    MetricName: Errors
    Namespace: AWS/KMS
    Statistic: Sum
    Period: 300
    EvaluationPeriods: 2
    Threshold: 5
    ComparisonOperator: GreaterThanThreshold
    AlarmActions:
      - !Ref SNSTopicArn
```

## Deployment Checklist

### Pre-deployment
- [ ] KMS key created with proper permissions
- [ ] IAM roles configured with minimal required permissions
- [ ] Environment variables configured
- [ ] Key validation tests pass

### Post-deployment  
- [ ] Verify encryption/decryption operations
- [ ] Check CloudTrail logs for KMS activity
- [ ] Validate monitoring and alerting
- [ ] Test key rotation procedures

### Environment-Specific Setup

#### Development
```bash
export KMS_KEY_ID="alias/dev-dol-mcnj-pii-encryption"
export SEARCH_SALT="$(openssl rand -base64 32)"
```

#### Staging
```bash
export KMS_KEY_ID="alias/staging-dol-mcnj-pii-encryption"
export SEARCH_SALT="$(aws secretsmanager get-secret-value --secret-id staging/dol-mcnj/search-salt --query SecretString --output text)"
```

#### Production
```bash
export KMS_KEY_ID="alias/prod-dol-mcnj-pii-encryption"
export SEARCH_SALT="$(aws secretsmanager get-secret-value --secret-id prod/dol-mcnj/search-salt --query SecretString --output text)"
```

## Troubleshooting

### Common Issues

1. **Access Denied Errors**
   - Verify IAM role has KMS permissions
   - Check key policy allows the application role
   - Ensure correct AWS region

2. **Key Not Found**
   - Verify KMS_KEY_ID environment variable
   - Check key exists in correct AWS account/region
   - Validate key alias spelling

3. **Encryption Context Mismatch**
   - Ensure consistent encryption context usage
   - Check for environment variable differences
   - Validate context key-value pairs

### Recovery Procedures

1. **Key Compromise**
   - Immediately disable the compromised key
   - Create new key with updated permissions
   - Re-encrypt all data with new key
   - Update application configuration

2. **Data Recovery**
   - Maintain backup of encryption metadata
   - Document key versions and rotation dates
   - Test recovery procedures regularly