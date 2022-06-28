# [New Jersey Training Explorer](https://training.njcareers.org)

[![build](https://circleci.com/gh/newjersey/d4ad.svg?style=shield)](https://circleci.com/gh/newjersey/d4ad)

## Overview

This [Typescript](https://www.typescriptlang.org/) repo is structured with two primary sub-folders:

- **backend** - the [Express](https://expressjs.com/) API server
- **frontend** - the [React](https://reactjs.org/) web UI, based on [`create-react-app`](https://create-react-app.dev/) skeleton

It also includes some resource documents:

- [`decision_log`](https://github.com/newjersey/d4ad/blob/master/decision_log.md) lists architectural decisions and their rationale
- [`data_model`](https://github.com/newjersey/d4ad/blob/master/data_model.md) details data tables and columns
- [`db_migration_guide`](https://github.com/newjersey/d4ad/blob/master/db_migration_guide.md) gives steps on how to update our databases
- [`etpl_table_seed_guide`](https://github.com/newjersey/d4ad/blob/master/etpl_table_seed_guide.md) gives steps on how to specifically update the ETPL database

## Getting started

After cloning this repo, run through the following steps to run the app locally.

### Install node (npm) dependencies

```shell script
./scripts/install-all.sh
```

### Install and set up Postgres DB

1. If not already installed, install [postgres](https://www.postgresql.org/)

2. Create postgres database on your local machine:

```shell script
psql -c 'create database d4adlocal;' -U postgres
```

3. Run database migrations from `d4ad` directory:

```shell script
./scripts/db-migrate.sh
```

> Note: If you get a key error when running the script, make sure that you have the correct DB password for the user `postgres` updated in the code. It assumes the password is an empty string, but it will be what you entered when you initially set up the `postgres` user after installation. You need to update it in [`database.json`](https://github.com/newjersey/d4ad/blob/master/backend/database.json#L6) and the fall-back value in [`app.ts`](https://github.com/newjersey/d4ad/blob/master/backend/src/app.ts#L23).

### Start server and client

To run the app locally, start the backend server in one terminal and the frontend server in another terminal. It should automatically open up `localhost:3000` in your browser when you run the latter.

Start backend dev server:

```shell script
./scripts/backend-start.sh
```

Start frontend dev server:

```shell script
./scripts/frontend-start.sh
```

## Development

### Pushing changes

Always push via ship-it ([why?](https://medium.com/@AnneLoVerso/ship-it-a-humble-script-for-low-risk-deployment-1b8ba99994f7))

```shell script
./scripts/ship-it.sh
```

### CI/CD

We use [circleci](https://app.circleci.com/pipelines/github/newjersey/d4ad?branch=master) for CI/CD and deploy both the development and production versions to Google Cloud Platform (GCP) environments. Our pipeline is:

1. `npm install` (frontend and backend)
1. run all unit tests (frontend and backend)
1. build code and run feature tests
1. deploy to GCP Dev environment
1. _Manual approval step_ - go to CircleCI build and "prod-approval" step, and click "Approve" button.
1. deploy to GCP Prod environment

### Deployment

Build frontend, build backend, compile all into one directory:

```shell script
./scripts/build.sh
```

Start the production server (frontend & backend)

```shell script
./scripts/prod-start.sh
```

Generally, developers won't have to do this - we have automated deploys to dev and prod via [circleci](https://app.circleci.com/pipelines/github/newjersey/d4ad?branch=master).

1. Ensure that [Google Cloud SDK](https://cloud.google.com/sdk/install) is installed
2. Ensure you are logged in to the CLI and pointing to the correct project.
3. Run this script generates the `app.yaml` and deploys the app:

```shell script
./scripts/deploy.sh
```

### Testing and linting

Use these two scripts below in order to run our normal testing flows, which include:

- Linting with [ESLint](https://eslint.org/) on frontend and backend
- Unit tests on frontend and backend using [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- End to end tests using [Cypress](https://www.cypress.io/)

Run all [jest](https://jestjs.io/) tests, and linting:

```shell script
./scripts/test-all.sh
```

Run [cypress](https://www.cypress.io/) feature tests:

```shell script
./scripts/feature-tests.sh
```

### Tools and libraries

- **UI Components**: We use a combination of [Material UI](https://mui.com/) React components and modular CSS from the [New Jersey Web Design System](https://github.com/newjersey/njwds), which is a customized version of the [U.S. Web Design System](https://designsystem.digital.gov/).
- **Internationalization (i18n)**: We use the [i18next](https://react.i18next.com/) library to implement the logic of storing English and Spanish content and switching between the two on the client-side. All the content is stored in JSON files in `frontend/src/locales`.
- **Routing**: We add client-side routing to this single page app using the [Reach Router](https://reach.tech/router/) library, similar to the more common React Router.
- **User engagement**: We track user engagement using [Google Analytics](https://analytics.google.com/), including pageviews and specific event-based interactions that we implement manually in different parts of the app, such as tracking what filters a user clicks on the training search page. Please request access from the NJ Office of Innovation in order to view our analytics dashboards.
- **Accessibility**: We have automated a11y tests that run as part of our [Cypress](https://www.cypress.io/) feature tests using the [`cypress-axe`](https://www.npmjs.com/package/cypress-axe) package. We also use tools such as [axe DevTools](https://www.deque.com/axe/devtools/) and [WAVE](https://chrome.google.com/webstore/detail/wave-evaluation-tool/jbbplnpkjmmeebjpijfedlgcdilocofh) Chrome extensions to do manual checks.
- **External APIs**: We fetch data from the following Web APIs: [O\*NET Web API](https://services.onetcenter.org/), [CareerOneStop](https://www.careeronestop.org/Developers/WebAPI/web-api.aspx). To access the development URLs and API keys to set as environment variables, request access for the NJInnovation Bitwarden account, and check the "Training Explorer Secrets" file in it.

### Structure with fences

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
