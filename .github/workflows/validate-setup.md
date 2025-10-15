# GitHub Actions Setup Validation Checklist

## ✅ Pre-Push Checklist

Before pushing to trigger the workflow, verify:

### 1. Files in Place
- [x] `.github/workflows/ci-full.yml` - Main CI pipeline
- [x] `.github/workflows/security-audit.yml` - Security scanning
- [x] `.github/workflows/codeql-analysis.yml` - Code analysis
- [x] All scripts referenced exist:
  - [x] `scripts/feature-tests.sh`
  - [x] `scripts/build.sh`

### 2. Dependencies
- [ ] `package.json` and `package-lock.json` are in sync
- [ ] `backend/package.json` and `backend/package-lock.json` are in sync
- [ ] No uncommitted changes to lock files

### 3. Environment Variables
Check if you need to add any secrets in GitHub:
- Go to: `Settings → Secrets and variables → Actions`
- Currently, the workflow uses:
  - `POSTGRES_USER: postgres`
  - `POSTGRES_PASSWORD: ''` (empty)
  - `DB_ENV: dev`
  
### 4. Branch Protection (Recommended)
- [ ] Set up branch protection rules in `Settings → Branches`
- [ ] Require status checks: `node-tests`, `build-and-feature-tests`
- [ ] Require PR reviews before merging

### 5. Permissions
- [ ] Verify in `Settings → Actions → General`
- [ ] "Read and write permissions" enabled
- [ ] "Allow GitHub Actions to create and approve pull requests" (if using Dependabot)

## 🧪 Testing the Workflow

### Local Pre-flight Check
Run these commands locally before pushing:

```bash
# 1. Ensure dependencies install cleanly
npm ci --frozen-lockfile
npm --prefix=backend ci --frozen-lockfile

# 2. Run linting
npm run lint
cd backend && npm run lint && cd ..

# 3. Run unit tests
npm test
cd backend && npm test && cd ..

# 4. Try building
npm run build:prod
```

### First Workflow Run
1. **Commit and push** your changes:
   ```bash
   git add .github/workflows/ci-full.yml
   git commit -m "Add GitHub Actions CI pipeline from CircleCI"
   git push
   ```

2. **Monitor the run**:
   - Go to: `Actions` tab in GitHub
   - Click on the latest workflow run
   - Watch both jobs: `node-tests` and `build-and-feature-tests`

3. **Check artifacts** (after completion):
   - Coverage reports
   - Cypress videos/screenshots (if tests fail)
   - Feature test output

## 📊 Expected Run Times

Based on CircleCI configuration:
- **node-tests**: ~15-30 minutes (with 30m timeout)
- **build-and-feature-tests**: ~30-45 minutes (with 60m timeout)

## 🔍 Troubleshooting

### If the workflow fails:

1. **Check the logs** in the Actions tab
2. **Common issues**:
   - Network timeouts → Retry logic should handle this
   - PostgreSQL not ready → Health checks should prevent this
   - Cypress failures → Check screenshots/videos artifacts
   - Memory issues → Already configured with increased heap sizes

### Workflow Status Badge
Add to your README.md:
```markdown
[![CI Full Pipeline](https://github.com/njdol-ori/dol-mcnj-main/actions/workflows/ci-full.yml/badge.svg)](https://github.com/njdol-ori/dol-mcnj-main/actions/workflows/ci-full.yml)
```

## 🎯 Key Differences from CircleCI

1. **Parallel Execution**: Both jobs run in parallel (no `requires` needed)
2. **Caching**: Node setup action handles npm caching automatically
3. **PostgreSQL**: Uses GitHub Actions services instead of Docker image
4. **Artifacts**: 30-day retention vs CircleCI's artifact storage
5. **Resource Classes**: 
   - `ubuntu-latest` ≈ CircleCI `medium`
   - For larger resources, use `ubuntu-latest` with more memory

## ✨ Next Steps

After successful first run:
- [ ] Add workflow status badge to README
- [ ] Update any deployment scripts referencing CircleCI
- [ ] Consider adding workflow concurrency controls
- [ ] Set up GitHub Environments for production deployments
