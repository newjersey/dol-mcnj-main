# D4AD

[![build](https://circleci.com/gh/newjersey/d4ad.svg?style=shield)](https://circleci.com/gh/newjersey/d4ad)

Data for the American Dream
## Getting Started

This [typescript](https://www.typescriptlang.org/) repo is structured with two primary sub-folders:

 - **backend** - the [express](https://expressjs.com/) API server
 - **frontend** - the [react](https://reactjs.org/) web UI
 
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

## Pushing changes

Always push via ship-it ([why?](https://medium.com/@AnneLoVerso/ship-it-a-humble-script-for-low-risk-deployment-1b8ba99994f7))
```shell script
./scripts/ship-it.sh
```

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
