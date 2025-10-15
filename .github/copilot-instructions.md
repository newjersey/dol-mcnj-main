# GitHub Copilot Instructions - My Career NJ

## Project Overview

My Career NJ is a career development platform built for the New Jersey Department of Labor. It's a **monorepo with separate frontend (Next.js) and backend (Express API)** that:
- Serves training programs via Training Explorer
- Provides career insights using O*NET and CareerOneStop APIs
- Stores data in PostgreSQL, encrypted PII in DynamoDB
- Deploys to AWS using PM2 with zero-downtime strategy

**Critical**: Frontend and backend are **independent applications** that communicate via HTTP API proxy (`/api/*` → backend:8080).

## Architecture & Data Flow

### Monorepo Structure
```
/                       # Next.js 15 frontend (React 19 + TypeScript)
├── src/                # Frontend source
│   ├── app/           # Next.js App Router pages
│   ├── components/    # React components (utility, modules, blocks, global)
│   └── utils/         # Frontend utilities
backend/                # Express API server (TypeScript)
├── src/
│   ├── domain/        # Business logic (factory pattern)
│   ├── database/      # PostgreSQL clients (data + search)
│   ├── routes/        # Express route handlers
│   ├── middleware/    # Validation, rate limiting
│   ├── controllers/   # Request controllers
│   └── dynamodb/      # DynamoDB operations (encrypted storage)
└── migrations/        # db-migrate files (200+ migrations)
```

### Key Pattern: Factory-Based Dependency Injection

Backend uses **factory functions** for dependency injection instead of classes:

```typescript
// Domain logic is created via factories
export const findTrainingsByFactory = (dataClient: DataClient): FindTrainingsBy => {
  return async (selector: Selector, values: string[]): Promise<Training[]> => {
    // Business logic here
  };
};

// Wired together in app.ts
const dataClient = new PostgresDataClient(dbConfig);
const findTrainingsBy = findTrainingsByFactory(dataClient);
const router = routerFactory({ findTrainingsBy, /* other dependencies */ });
```

**When modifying backend**: Follow this pattern. Domain functions (`domain/`) take DataClient, return type-safe functions.

### Module Boundaries (good-fences)

Backend enforces strict boundaries:
- **`domain/`** → Business logic, can use DataClient interface
- **`routes/`** → HTTP handlers, imports from domain
- **`database/`** → Implements DataClient interface
- Frontend and backend **cannot import from each other**

Check compliance: `npm --prefix=backend run fences`

## Development Workflow

### Starting Development Servers

**Always use scripts** (not `npm run dev` directly):
```bash
# In separate terminals:
./scripts/backend-start.sh   # Starts backend on :8080 with nodemon
./scripts/frontend-start.sh  # Starts Next.js on :3000
```

Backend runs with `nodemon` watching `src/`, frontend uses Next.js dev server.

### Environment Configuration

Three environment types controlled by `NODE_ENV`:
- **`dev`/`test`** → Local development (localhost PostgreSQL)
- **`awsdev`/`awstest`** → AWS development/staging
- **`awsprod`** → Production

**Critical env vars** (see `.env.local`):
- `REACT_APP_API_URL` → Backend proxy target
- `ONET_*` → O*NET API credentials (lines 23-25 in .env.local)
- `DB_HOST_*`, `DB_PASS_*` → PostgreSQL per environment
- `AWS_KMS_KEY_ID` → Required for PII encryption in AWS envs

### Database Operations

PostgreSQL connection configured in `backend/database.json`:
```json
{
  "dev": { "host": "localhost", "database": "d4adlocal" },
  "awsprod": { "host": "{{DB_HOST_WRITER_AWSPROD}}", ... }
}
```

**Migrations**: Use `db-migrate` via scripts:
```bash
./scripts/db-migrate.sh         # Run all pending migrations
cd backend && npm run db-migrate up    # Manual migration
```

**ETPL updates**: Weekly CSV imports via automated migrations (`backend/data/create_update_etpl_migrations.sh`). Do not modify `etpl` table structure without migration.

## Code Patterns & Conventions

### Frontend Patterns

**Component organization** (by complexity):
- `components/utility/` → Generic UI (Box, Button)
- `components/modules/` → Reusable features (Alert, FormInput, Tag)
- `components/blocks/` → Complex composites (OccupationBanner, ContactFormModal)
- `components/global/` → Site-wide (Header, Footer, NavSubMenu)

**Export pattern**: Named exports only
```typescript
export const OutcomeDetails = ({ outcomes, title, ... }: Props) => { /* */ };
```

**Path aliases** (tsconfig.json):
```typescript
import { Box } from "@components/utility/Box";
import { sanitizeString } from "@utils/sanitizeString";
import { footerData } from "@data/global/navigation/footer";
```

### Backend Patterns

**Type definitions**: `domain/types.ts` defines all function signatures
```typescript
export type FindTrainingsBy = (selector: Selector, values: string[]) => Promise<Training[]>;
```

**Error handling**: Use Sentry for exceptions, but **never log PII**:
```typescript
import { createSafeLogger } from "./utils/piiSafety";
const logger = createSafeLogger(console.log);
logger.info("User action", { email: "redacted@example.com" }); // Auto-redacts
```

**Database queries**: Use Knex query builder in `PostgresDataClient`:
```typescript
await this.kdb("etpl")
  .select("programid", "officialname", "cipcode")
  .leftOuterJoin("indemandcips", "indemandcips.cipcode", "etpl.cipcode")
  .whereIn("etpl.cipcode", values);
```

**Status filtering**: Only show `APPROVED` programs/providers:
```typescript
const APPROVED = "Approved";
programs.filter(p => p.statusname === APPROVED && p.providerstatusname === APPROVED);
```

## Security & PII Handling

### Encrypted Storage (DynamoDB)

All signup emails are encrypted using AWS KMS + AES-256-GCM:
- **Encryption**: `backend/src/utils/piiEncryption.ts` → `encryptPII()`, `decryptPII()`
- **Storage**: `backend/src/dynamodb/writeSignupEmailsEncrypted.ts`
- **Search**: Uses secure hashes for duplicate detection (no plaintext searchable)

**When handling user emails**: Always use encrypted storage in AWS environments. See `docs/security/ENCRYPTION_GUIDE.md`.

### Content Security Policy

Helmet CSP configured in `backend/src/app.ts` with allowlists for:
- Google Tag Manager, Analytics, Ads
- SurveyMonkey widgets
- NJ WDS assets

**Adding new external resources**: Update CSP directives before deploying.

## Testing & Deployment

### Testing Commands

```bash
./scripts/test-all.sh          # Runs all tests + linting (frontend + backend)
./scripts/feature-tests.sh     # Cypress e2e tests (requires servers running)
npm --prefix=backend test      # Backend Jest tests
npm test                       # Frontend Jest + React Testing Library
```

**Test organization**: Tests live alongside source files (`*.test.ts`, `*.test.tsx`).

### Ship-It Script (Required)

**Never push directly**. Always use:
```bash
./scripts/ship-it.sh
```

This runs: format → test-all → build → feature-tests → push. Enforces no uncommitted changes.

### Production Deployment

Uses **PM2 with zero-downtime reloads** (`ecosystem.config.js`):
- **Frontend**: 1 instance (Next.js handles its own optimization)
- **Backend**: 2 instances in cluster mode

Deploy commands:
```bash
npm run deploy:zero-downtime    # Recommended
npm run start:prod              # PM2 start
npm run restart:prod            # Graceful reload
```

**Health checks**: Backend must respond on `:8080/health` for zero-downtime to work.

## External APIs

### O*NET Integration (`backend/src/oNET/`)
- Base URL: `https://services.onetcenter.org/`
- Used for: Occupation details, education requirements, salary estimates
- Credentials: `ONET_USERNAME`, `ONET_PASSWORD` (env vars)
- **Mock in tests**: Use WireMock (`npm run start:wiremock`)

### CareerOneStop (`backend/src/careeronestop/`)
- Used for: Open job counts
- Credentials: `CAREER_ONESTOP_USERID`, `CAREER_ONESTOP_AUTH_TOKEN`

### Contentful CMS
- GraphQL API for site content (FAQs, career pathways)
- Configuration: `REACT_APP_BASE_URL`, `REACT_APP_SPACE_ID`, `REACT_APP_DELIVERY_API`

## Common Pitfalls

1. **Don't modify `etpl` structure manually** → Use migrations + CSV import scripts
2. **Don't log PII** → Use `createSafeLogger()`, never `console.log()` with user data
3. **Don't import backend code in frontend** → API communication only via HTTP
4. **Don't skip `ship-it.sh`** → Prevents broken builds from reaching CI
5. **Don't forget status filtering** → Always check `statusname === "Approved"`

## Feature Flags

Toggle features via environment variables (set in `.env.local`):
- `REACT_APP_FEATURE_MULTILANG` → Spanish translations
- `REACT_APP_FEATURE_CAREER_PATHWAYS` → Career pathways feature
- `REACT_APP_FEATURE_MAINTENANCE` → Site maintenance banner

## Quick Reference

| Task | Command/File |
|------|--------------|
| Start development | `./scripts/backend-start.sh` + `./scripts/frontend-start.sh` |
| Deploy changes | `./scripts/ship-it.sh` |
| Database setup | `psql -c 'create database d4adlocal;' && ./scripts/db-migrate.sh` |
| Check module boundaries | `npm --prefix=backend run fences` |
| View all docs | `docs/README.md` (comprehensive index) |
| Security practices | `docs/security/ENCRYPTION_GUIDE.md` |
| Data model | `docs/database/data_model.md` |
