# Deployment Checklist for Encrypted Signups

**For fresh start migrations (like Mailchimp → encrypted signup)**

## 📋 **Simple Deployment Approach**

Since you're starting fresh, this is much simpler:
- ✅ No legacy data to migrate
- ✅ No feature flags needed  
- ✅ Single encrypted table
- ✅ Encryption enabled from day one

---

## Pre-Deployment

### 1. Infrastructure Setup (30 minutes)
- [ ] Deploy KMS key using [`KMS_KEY_MANAGEMENT.md`](../security/KMS_KEY_MANAGEMENT.md)
- [ ] Create encrypted DynamoDB table `signup-emails-encrypted`
- [ ] Update IAM permissions for KMS and DynamoDB access
- [ ] Test KMS key access: `aws kms describe-key --key-id alias/dol-mcnj-signup-encryption`

### 2. Environment Configuration (5 minutes)
- [ ] Set `KMS_KEY_ID=alias/dol-mcnj-signup-encryption`
- [ ] Set `SEARCH_SALT=$(openssl rand -base64 32)`
- [ ] Set `DDB_TABLE_NAME=signup-emails-encrypted`
- [ ] Set `AWS_REGION=us-east-1`
- [ ] Verify: `[ -n "$KMS_KEY_ID" ] && [ -n "$SEARCH_SALT" ] && echo "✅ Ready"`

### 3. Application Deployment (15 minutes)
- [ ] Verify `signUpController.ts` uses `addSubscriberToDynamoEncrypted`
- [ ] Deploy application with encryption code
- [ ] Verify health check: `curl /health` shows encryption enabled
- [ ] Test signup: `curl -X POST /api/signup -d '{"email":"test@example.com"}'`
- [ ] Confirm data encrypted in DynamoDB
- [ ] Run integration tests with encryption enabled

## Deployment Steps

### 1. Deploy Infrastructure
```bash
# Using Terraform
cd infrastructure/
terraform apply

# Using CloudFormation
aws cloudformation deploy \
  --template-file kms-key.yaml \
  --stack-name signup-encryption \
  --capabilities CAPABILITY_IAM
```

### 2. Configure Environment
```bash
# Set environment variables
export ENCRYPTION_ENABLED=true
export KMS_KEY_ID="arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012"
export SEARCH_SALT="your-secure-random-salt-32-chars-minimum"
export DDB_ENCRYPTED_TABLE_NAME="signup-emails-encrypted"
```

### 3. Deploy Application
```bash
# Deploy backend with new code
./scripts/deploy.sh

# Verify deployment
curl https://your-api.example.com/health
```

## Post-Deployment Verification

### 1. Health Checks
- [ ] `/health` endpoint shows encryption as healthy
- [ ] KMS key accessibility verified
- [ ] Application logs show successful encryption validation

### 2. Functional Testing
- [ ] Submit test signup with encryption enabled
- [ ] Verify data is encrypted in DynamoDB
- [ ] Verify search functionality works with encrypted data
- [ ] Test decryption and data retrieval

### 3. Monitoring Setup
- [ ] Monitor encryption/decryption errors
- [ ] Set up alerts for KMS key access failures
- [ ] Monitor performance impact of encryption
- [ ] Track encrypted vs plaintext data ratios

## Rollback Plan

### If Issues Occur
1. **Disable encryption immediately**:
   ```bash
   export ENCRYPTION_ENABLED=false
   ./scripts/deploy.sh
   ```

2. **Verify fallback to plaintext**:
   - Check that new signups go to original table
   - Verify application functionality
   - Monitor error rates

3. **Investigate issues**:
   - Check KMS key permissions
   - Verify environment variables
   - Review application logs
   - Check DynamoDB table configuration

### Recovery Steps
1. Fix identified issues
2. Re-run pre-deployment checklist
3. Deploy with fixes
4. Re-enable encryption
5. Monitor closely

## Success Criteria

### Deployment Successful When:
- [ ] Health check shows encryption as healthy
- [ ] New signups are encrypted and stored in encrypted table
- [ ] Search functionality works correctly
- [ ] No increase in error rates
- [ ] Performance within acceptable limits

### Metrics to Monitor:
- **Encryption Success Rate**: >99.9%
- **KMS API Latency**: <100ms p95
- **Application Response Time**: <2x baseline
- **Error Rate**: <0.1% increase
- **Search Query Performance**: <20% degradation

## Emergency Contacts

- **Infrastructure Team**: For KMS/DynamoDB issues
- **Security Team**: For encryption concerns
- **On-call Engineer**: For application issues
- **Product Owner**: For business impact decisions

## Documentation Updates

After successful deployment:
- [ ] Update API documentation
- [ ] Update operational runbooks
- [ ] Document encryption key rotation procedures
- [ ] Update disaster recovery procedures
- [ ] Train support team on encrypted data handling

## Security Validation

- [ ] Verify PII is encrypted at rest
- [ ] Confirm search hashes work correctly
- [ ] Validate audit logging captures encryption events
- [ ] Test data access patterns with encrypted data
- [ ] Verify key rotation procedures work

---

**Note**: This is a full release for new data only. Existing data remains unencrypted. Consider running a gradual encryption migration for existing data if required by compliance needs.