# GitHub Actions Environment Variables Setup Guide

## 🔐 Required Environment Variables for CI/CD

Based on your CircleCI configuration and codebase analysis, here are the environment variables you need to set up in GitHub Actions.

---

## 📋 Setting Up Secrets in GitHub

1. Go to your repository: `https://github.com/njdol-ori/dol-mcnj-main`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** for each secret below

---

## ✅ CI/CD Environment Variables

### **For Testing (Required)**

These are needed for the CI pipeline to run tests:

| Secret Name | Description | Example/Notes |
|------------|-------------|---------------|
| `IS_CI` | Flag to indicate CI environment | Set to `true` |
| `NODE_ENV` | Node environment | Set to `test` for CI |

### **Database (Optional for CI - uses localhost)**

The CI workflow uses a local PostgreSQL container, so these are **NOT needed** for basic CI:
- ✅ Already configured: `PGHOST=localhost`, `PGPORT=5432`, `PGUSER=postgres`, `PGPASSWORD=''`

---

## 🔒 Production/Deployment Secrets (Optional - only if deploying from GitHub Actions)

If you plan to deploy from GitHub Actions (not just test), you'll need these:

### **AWS Credentials** (for deployment)
```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION (e.g., us-east-1)
```

### **Database** (for deployment environments)
```
DB_HOST_DEV
DB_PASS_DEV
DB_HOST_TEST
DB_PASS_TEST
DB_HOST_WRITER_AWSDEV
DB_PASS_AWSDEV
DB_HOST_WRITER_AWSTEST
DB_PASS_AWSTEST
DB_HOST_WRITER_AWSPROD
DB_PASS_AWSPROD
```

### **Sentry** (error tracking)
```
SENTRY_DSN
```

### **AWS Services** (for email/features)
```
AWS_PINPOINT_PROJECT_ID
AWS_PINPOINT_ENDPOINT (optional)
SHOW_PINPOINT_SEGMENTS (optional)
```

### **Career OneStop API**
```
CAREER_ONESTOP_BASEURL
CAREER_ONESTOP_USERID
CAREER_ONESTOP_AUTH_TOKEN
```

### **DynamoDB & KMS** (for data export)
```
DDB_TABLE_NAME
KMS_KEY_ID
```

### **Next.js Public Variables** (for frontend features)
```
NEXT_PUBLIC_FEATURE_CRC_INFO
NEXT_PUBLIC_SURVEY_URL
```

---

## 🚀 Quick Setup for Basic CI (Minimum Required)

For just running tests (like your CircleCI), you only need:

### **Repository Variables** (not secrets - can be public)
Go to **Settings** → **Secrets and variables** → **Actions** → **Variables** tab:

| Variable Name | Value |
|---------------|-------|
| `IS_CI` | `true` |
| `NODE_ENV` | `test` |

### **No Secrets Required!** ✨
The current CI workflow works without any secrets because:
- PostgreSQL runs as a service container (no credentials needed)
- Tests run with empty password
- No AWS services are called during tests

---

## 📝 How to Reference Secrets in Workflow

If you need to add secrets later, here's the syntax:

```yaml
- name: Step that needs secrets
  env:
    AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
    AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
  run: |
    # Your command here
```

---

## 🔍 Checking What Variables CircleCI Uses

To see what environment variables are set in CircleCI:
1. Go to CircleCI → Your project settings
2. Click **Environment Variables**
3. Copy those to GitHub Secrets (same names)

---

## ⚙️ Current CI Workflow Environment Variables

The `ci-full.yml` workflow already sets these automatically:

```yaml
# In node-tests job - no extra env vars needed

# In build-and-feature-tests job:
env:
  PGHOST: localhost
  PGPORT: 5432
  PGUSER: postgres
  PGPASSWORD: ''
  PGDATABASE: d4adlocal
  DB_ENV: dev
  IS_CI: 'true'
```

---

## ✅ Action Items

### **For Basic CI Testing (Now)**
- [ ] Set `IS_CI=true` as a repository variable (optional, already in workflow)
- [ ] Push the workflow and test it
- [ ] No secrets needed for basic testing!

### **For Production Deployment (Later)**
- [ ] Copy all environment variables from CircleCI
- [ ] Add them as GitHub Secrets
- [ ] Update workflow with deployment steps

---

## 🎯 Recommended Approach

1. **Start Simple**: Push the workflow as-is with no secrets
2. **Test CI Pipeline**: Ensure tests run successfully
3. **Add Secrets Later**: If you need deployment or external services

The good news: Your CircleCI configuration uses local PostgreSQL for tests, so you don't need database credentials for CI! 🎉
