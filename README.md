# D4AD

[![build](https://circleci.com/gh/newjersey/d4ad.svg?style=shield)](https://circleci.com/gh/newjersey/d4ad)

Data for the American Dream

## Getting Started

This [typescript](https://www.typescriptlang.org/) repo is structured with two primary sub-folders:

 - **backend** - the [express](https://expressjs.com/) API server
 - **frontend** - the [react](https://reactjs.org/) web UI

It also includes som resource documents:

- [`decision_log`](https://github.com/newjersey/d4ad/blob/master/decision_log.md) lists architectural decisions and their rationale.
- [`data_model`](https://github.com/newjersey/d4ad/blob/master/data_model.md) details data tables and columns.

### npm Dependencies

For npm dependencies:
```shell script
./scripts/install-all.sh
```

### postgres

If not already installed, install [postgres](https://www.postgresql.org/)

Create postgres local DB:
```shell script
psql -c 'create database d4adlocal;' -U postgres
```

Run database migrations:
```shell script
./scripts/db-migrate.sh
```

## Development

Start frontend dev server:
```shell script
./scripts/frontend-start.sh
```

Start backend dev server:
```shell script
./scripts/backend-start.sh
```

Run all [jest](https://jestjs.io/) tests, and linting:
```shell script
./scripts/test-all.sh
```

Run [cypress](https://www.cypress.io/) feature tests:
```shell script
./scripts/feature-tests.sh
```

### Fences

This repo uses [good-fences](https://github.com/smikula/good-fences) to enforce module boundaries.
Most importantly, the `backend` and `frontend` cannot import from each other.

Additionally, fences are used in the backend subdirectories to enforce [dependency inversion](https://en.wikipedia.org/wiki/Dependency_inversion_principle).
The `routes` and `database` folders depend on the interfaces defined in `domain` (only - not on each other), and `domain` is not allowed to
import from any of these implementation directories.

Fences are enforced via a linting-like command that will fail when any violations are flagged:

```shell script
npm --prefix=backend run fences
npm --prefix=frontend run fences
```

### Adding DB migrations

```shell script
npm --prefix=backend run db-migrate create [migration-name] -- --sql-file
```

#### Seeding

When you want to add a DB migration that is a **seed** operation (that is, inserting
data from a CSV), there's a specific process for this:
- make sure that the CSV source file is in the `backend/data` directory
- ensure that it does not have any leading/trailing newlines
- run the above DB migrate command to create the migration scripts in `backend/migrations`.
I recommend the name to be "seed-[description]"
- run the `csvInserter` script to populate the migration file with insert statements generated from the CSV:
```shell script
node backend/data/csvInserter.js csvFilename.csv tablenameToInsertInto backend/migrations/sqls/seed-migration-name.sql
```

assuming that you want a different seed for testing vs real life, then:

- create a CSV in `/backend/data` with matching structure, and test data
- duplicate the `.sql` migration file and rename it to end with `-TEST.sql`
- run the same node command above, with the test CSV filename and the test sql migration filename
- edit the corresponding `.js` file for the migration by replacing this line:
```javascript
exports.up = function(db) {
  var filePath = path.join(__dirname, 'sqls', 'filename.sql');
```

with this instead:
```javascript
exports.up = function(db) {
  const fileName = process.env.NODE_ENV === 'test' ? 'filename-TEST.sql' : 'filename.sql';
  var filePath = path.join(__dirname, 'sqls', fileName);
```

**Troubleshooting**

If you are trying to run the tests and get an error that looks like:
`RangeError [ERR_CHILD_PROCESS_STDIO_MAXBUFFER]: stdout maxBuffer length exceeded`, this implies that it is running
the real migrations, not the test migrations, and that you forgot to add the `.js` modification above.

If you are trying to run a migration and get an error that looks like:
`ifError got unwanted exception: INSERT has more target columns than expressions`, this implies that there was an
empty line at the end of your CSV, so your migration full of insert statements has a broken INSERT with `null` in it at the end.
Remove this from the CSV and the migration, and it should work.

#### Updating Seeds

When you want to add a DB migration that is a **seed update** operation (that is, replacing data
in a table new fresher data from a CSV), here is what to do:

> **IMPORTANT!**
>
> if we're updating the `etpl` table,
follow the [ETPL table seed guide](https://github.com/newjersey/d4ad/blob/master/etpl_table_seed_guide.md)

First, create a db-migration (with a `update-*.sql` filename pattern).

Next, make sure that both the OLD (previous) CSV and also the NEW (about-to-be-inserted) CSV are in the `backend/data` folder.

Next, we have a script for creating update migrations by finding the changed rows, and then deleting and re-inserting
only those rows.

Run the script:
```shell script
./backend/data/create_update_migrations.sh oldFilename.csv newFilename.csv tablenameToInsertInto backend/migrations/sqls/upFile.sql backend/migrations/sqls/downFile.sql
```

Next, we need to make sure the test migrations are accurate.  Create new files with the same name with the `-TEST.sql` suffix for the test migrations.  Do this for BOTH up AND down migrations.

- if your operation is just an update, leave a comment in BOTH files for "intentionally left blank"
- if your operation adds new columns, your down file should be "intentionally left blank" but your up file should delete from and re-insert the newly restructured test data.  If it's an `etpl` change, also add the programtokens
update code to the up-file.

As per usual, modify the `.js` file for the migration to conditionally load the `-TEST.sql` up and down files.

## Pushing changes

Always push via ship-it ([why?](https://medium.com/@AnneLoVerso/ship-it-a-humble-script-for-low-risk-deployment-1b8ba99994f7))
```shell script
./scripts/ship-it.sh
```

## CI/CD

We use [circleci](https://app.circleci.com/pipelines/github/newjersey/d4ad?branch=master).

The pipeline is:
1. npm install (frontend and backend)
1. run all unit tests (frontend and backend)
1. build code and run feature tests
1. deploy to GCP Dev environment
1. [manual approval step]
1. deploy to GCP Prod environment

## Deployment

Build frontend, build backend, compile all into one directory:
```shell script
./scripts/build.sh
```

Start the production server (frontend & backend)
```shell script
./scripts/prod-start.sh
```

### Deploying to GCP

First, make sure that [Google Cloud SDK](https://cloud.google.com/sdk/install) is installed

Ensure you are logged in to the CLI and pointing to the correct project.

This script generates the `app.yaml` and deploys the app:
```shell script
./scripts/deploy.sh
```

Generally, developers won't have to do this - we have automated deploys to dev and prod via [circleci](https://app.circleci.com/pipelines/github/newjersey/d4ad?branch=master).
