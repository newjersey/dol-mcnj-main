# D4AD
Data for the American Dream

## Getting Started

This [typescript](https://www.typescriptlang.org/) repo is structured with two primary sub-folders:

 - **backend** - the [express](https://expressjs.com/) API server
 - **frontend** - the [react](https://reactjs.org/) web UI
 
#### npm Dependencies

For npm dependencies:
```shell script
./scripts/install-all.sh
```

#### postgres

If not already installed, install [postgres](https://www.postgresql.org/)

Create postgres local DB:
```shell script
psql -c 'create database d4adlocal;' -U postgres
```

Run database migrations:
```shell script
./scripts/db-migrate.sh
```

Seed the DB:
```shell script
./scripts/db-seed-local.sh
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
./scripts/test-all.sh
```

#### Adding DB migrations

```shell script
npm --prefix=backend db-migrate create [migration-name] -- --sql-file
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
