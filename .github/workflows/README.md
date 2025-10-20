# GitHub Actions Workflows

## Overview

The CI/CD pipeline is organized into modular, composable workflows for better maintainability and parallel execution.

## Workflow Structure

### Main Orchestrator
- **`ci.yml`** - Main CI pipeline that coordinates all checks
  - Runs on push/PR to `main` and `develop` branches
  - Calls all other workflows using `workflow_call`
  - Orchestrates parallel and sequential execution

### Individual Workflows (Reusable)

Each workflow can be:
- Called by `ci.yml` via `workflow_call`
- Triggered independently on push/PR
- Run manually via `workflow_dispatch` (where applicable)

#### 1. **`lint.yml`** - Code Quality
- **Timeout:** 15 minutes
- **Checks:** ESLint (frontend & backend), Prettier, Good-Fences
- **Dependencies:** Node.js dependencies (Cypress install skipped)

#### 2. **`security.yml`** - Security Checks
- **Timeout:** 15 minutes
- **Checks:** NPM audit (high/critical), outdated packages, license summary
- **Schedule:** Also runs weekly on Mondays at 10am UTC
- **Continues on error:** Yes (informational only)

#### 3. **`jsdoc-coverage.yml`** - Documentation Coverage
- **Timeout:** 15 minutes
- **Checks:** JSDoc coverage for backend and frontend exports
- **Artifacts:** Coverage badge JSON (90 day retention)
- **PR Comments:** Posts coverage report table on pull requests
- **Threshold:** 20% minimum (currently informational, doesn't fail builds)

#### 4. **`test-frontend.yml`** - Frontend Unit Tests
- **Timeout:** 30 minutes
- **Runs:** Next.js Jest tests with coverage
- **Artifacts:** Frontend coverage reports (30 day retention)
- **Configuration:** Single worker, 6144MB heap size

#### 5. **`test-backend.yml`** - Backend Unit Tests
- **Timeout:** 30 minutes
- **Runs:** Backend Jest tests with coverage
- **Artifacts:** Backend coverage reports (30 day retention)
- **Services:** PostgreSQL 12.7
- **Configuration:** 2 workers, 4096MB heap size

#### 6. **`build.yml`** - Production Build
- **Timeout:** 20 minutes
- **Runs:** Next.js production build
- **Artifacts:** `.next/` build output (7 day retention)
- **Secrets:** Requires Contentful, feature flags, and API credentials

#### 7. **`test-e2e.yml`** - End-to-End Tests
- **Timeout:** 45 minutes
- **Runs:** Cypress feature tests with full stack
- **Artifacts:** Screenshots (on failure), videos, test output (30 day retention)
- **Services:** PostgreSQL 12.7
- **Database:** Uses `backend/test-schema.sql` for minimal test data
- **Timeout:** 30 minutes
- **Runs:** Backend Jest tests with coverage
- **Artifacts:** Backend coverage reports (30 day retention)
- **Services:** PostgreSQL 12.7
- **Configuration:** 2 workers, 4096MB heap size

#### 5. **`build.yml`** - Production Build
- **Timeout:** 20 minutes
- **Runs:** Next.js production build
- **Artifacts:** `.next/` build output (7 day retention)
- **Secrets:** Requires Contentful, feature flags, and API credentials

#### 6. **`test-e2e.yml`** - End-to-End Tests
- **Timeout:** 45 minutes
- **Runs:** Cypress feature tests with full stack
- **Artifacts:** Screenshots (on failure), videos, test output (30 day retention)
- **Services:** PostgreSQL 12.7
- **Database:** Uses `backend/test-schema.sql` for minimal test data

## Execution Flow

```
ci.yml (Main Orchestrator)
├── Parallel Phase 1
│   ├── lint.yml
│   ├── security.yml
│   ├── jsdoc-coverage.yml
│   ├── test-frontend.yml
│   └── test-backend.yml
├── Sequential Phase 2
│   └── build.yml (waits for: lint, test-frontend, test-backend)
└── Sequential Phase 3
    └── test-e2e.yml (waits for: build)
```

## Benefits of Modular Structure

### Parallel Execution
- Independent checks run simultaneously
- Failures are visible earlier in the pipeline

### Easier Debugging
- Each workflow has a single, focused purpose
- Clear artifact separation
- Can re-run individual workflows without running the full pipeline

### Maintainability
- Smaller, focused workflow files
- Easier to update specific checks
- Clear dependencies between workflows

### Reusability
- Workflows can be called from other workflows via `workflow_call`
- Can be triggered independently for testing
- Enable manual execution via `workflow_dispatch`

## Running Workflows Locally

While workflows are designed for GitHub Actions, you can simulate them locally:

```bash
# Lint checks
./scripts/ship-it.sh  # Runs all formatting + tests

# Frontend tests
npm test

# Backend tests
npm --prefix=backend test

# Build
npm run build:prod

# E2E tests (requires servers running)
./scripts/feature-tests.sh
```

## Workflow Details

### Common Configuration

**Node Version:** 20.11.0 (all workflows)

**NPM Configuration:** All workflows configure npm with retry settings:
- `fetch-retry-mintimeout`: 20000ms
- `fetch-retry-maxtimeout`: 120000ms
- `fetch-retries`: 5

**Cypress Installation:** Skipped in lint, security, build, and test-frontend workflows via `CYPRESS_INSTALL_BINARY=0`

### PostgreSQL Service

Used in `test-backend.yml` and `test-e2e.yml`:
- **Image:** postgres:12.7
- **Authentication:** Trust mode (no password)
- **Health checks:** Enabled with 10s interval
- **Port:** 5432

### Test Database Setup

**Backend unit tests** (`test-backend.yml`):
- Creates `d4adlocal` database
- Initializes migrations table
- Uses live database connection for tests

**E2E tests** (`test-e2e.yml`):
- Creates both `d4adlocal` and `d4adtest` databases
- Loads `backend/test-schema.sql` (minimal schema, no LFS downloads)
- Includes Cypress system dependencies (libgtk, libgbm, etc.)

## Secrets Required

Build and E2E workflows require these GitHub repository secrets (inherited via `secrets: inherit`):

### Contentful/CMS
- `REACT_APP_SITE_NAME`
- `REACT_APP_API_URL`
- `REACT_APP_SITE_URL`
- `REACT_APP_BASE_URL`
- `REACT_APP_SPACE_ID`
- `REACT_APP_ENVIRONMENT`
- `REACT_APP_DELIVERY_API`
- `REACT_APP_PREVIEW_API`

### Feature Flags
- `REACT_APP_FEATURE_CAREER_PATHWAYS`
- `REACT_APP_FEATURE_MULTILANG`
- `REACT_APP_FEATURE_PINPOINT`
- `REACT_APP_FEATURE_CAREER_NAVIGATOR`
- `REACT_APP_FEATURE_LP_CAREER_ROW`
- `REACT_APP_FEATURE_MAINTENANCE`
- `REACT_APP_FEATURE_BETA`
- `REACT_APP_FEATURE_BETA_MESSAGE`
- `REACT_APP_FEATURE_SHOW_PINPOINT_SEGMENTS`

### External APIs
- `ONET_BASEURL`, `ONET_USERNAME`, `ONET_PASSWORD`
- `CE_AUTH_TOKEN`, `CE_ENVIRONMENT`
- `REACT_APP_GOOGLE_CLIENTID`, `REACT_APP_GOOGLE_CLIENT_SECRET`
- `REACT_APP_SIGNUP_FOR_UPDATES`
- `NEXT_PUBLIC_SURVEY_URL`
- `NEXT_PUBLIC_FEATURE_CRC_INFO`

**Note:** Lint, security, test-frontend, and test-backend workflows do not require secrets.

## Artifacts

### Coverage Reports
- **`nextjs-coverage`** - Frontend Jest coverage (from `test-frontend.yml`, 30 day retention)
- **`backend-coverage-unit`** - Backend Jest coverage (from `test-backend.yml`, 30 day retention)
- **`jsdoc-coverage-badge`** - JSDoc coverage badge data (from `jsdoc-coverage.yml`, 90 day retention)

### Build Outputs (7 day retention)
- **`nextjs-build`** - Production build output from `.next/` (from `build.yml`)

### Test Results (30 day retention)
- **`feature-test-output`** - E2E test logs (from `test-e2e.yml`)
- **`cypress-screenshots`** - Screenshots on test failure (from `test-e2e.yml`)
- **`cypress-videos`** - Video recordings of all tests (from `test-e2e.yml`)

## Troubleshooting

### Workflow not found error
- Ensure the workflow file exists on the branch being tested
- Verify workflow syntax is valid YAML

### Tests pass locally but fail in CI
- Check that all required environment variables are set
- Verify Node.js version matches (`20.11.0`)
- Review uploaded artifacts for detailed logs

### E2E tests timeout
- Current timeout is 45 minutes
- Check PostgreSQL service health in workflow logs
- Review Cypress videos to identify where tests are stuck

### Build failures with missing env vars
- Verify all required secrets are configured in repository settings
- Check that `secrets: inherit` is present in `ci.yml` for build and E2E jobs

### NPM install failures
- All workflows include npm retry configuration
- Check GitHub Actions status page for registry issues
- Ensure `package-lock.json` is up to date
