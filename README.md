# My Career NJ

[![build](https://circleci.com/gh/newjersey/d4ad.svg?style=shield)](https://circleci.com/gh/newjersey/d4ad)

## Overview

This repo is the home for the My Career NJ web app ([mycareer.nj.gov](https://mycareer.nj.gov/)), a one-stop shop for New Jerseyans seeking to explore training programs, in-demand career insights, and data-driven career advice custom-tailored to users’ experiences. Note that this repository does not yet include Career Navigator.

### Architecture

- The frontend is written in [Typescript](https://www.typescriptlang.org/), a single page app built with [React](https://reactjs.org/) using the [`create-react-app`](https://create-react-app.dev/) setup.
- The backend is written in [Typescript](https://www.typescriptlang.org/), with an [Express](https://expressjs.com/)-based server API.
- The databases include multiple [PostgreSQL](https://www.postgresql.org/) tables (which are imported from raw CSV files stored in `backend/data` directory). For more information on the tables, see the [`data_model`](https://github.com/newjersey/d4ad/blob/master/data_model.md) guide.
- The entire app is deployed to production [Amazon Web Services](https://cloud.google.com/](https://aws.amazon.com/)) (AWS) instances in a [Node](https://nodejs.org/en/) 18 environment. We use [CircleCI](https://app.circleci.com/pipelines/github/newjersey/d4ad?branch=master) for continuous integration/deployment.


### References

- [`decision_log`](https://github.com/newjersey/d4ad/blob/master/decision_log.md) lists architectural decisions and their rationale
- [`data_model`](https://github.com/newjersey/d4ad/blob/master/data_model.md) lists data tables and columns
- [`db_migration_guide`](https://github.com/newjersey/d4ad/blob/master/db_migration_guide.md) gives steps on how to update our databases
- [`etpl_table_seed_guide`](https://github.com/newjersey/d4ad/blob/master/etpl_table_seed_guide.md) gives steps on how to specifically update the ETPL database

## Getting started

After cloning this repo, run through the following steps to run the app locally.

### Install prerequisites

If you are using a newer Mac (Apple Silicon), you will likely need to install jq. Run `brew install jq` or install a pre-built
binary [here](https://jqlang.github.io/jq/download/).

### Install node dependencies

```shell script
./scripts/install-all.sh
```

### Set up Postgres DB

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

### Run app locally

In one terminal window, start backend dev server:

```shell script
./scripts/backend-start.sh
```

In another window, start frontend dev server. It should automatically open up `localhost:3000` in your browser.

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
1. deploy to GCP Dev environment (reach out to developer for dev URL or look in D4AD Dev App Engine settings)
1. _Manual approval step_ - go to CircleCI build and "prod-approval" step, and click "Approve" button.
1. deploy to GCP Prod environment

#### Environment Variables

##### Amazon Web Services

TBD

##### Feature Flags

This will likely change as features are rolled out.

* `REACT_APP_FEATURE_MULTILANG` - Enable/disable multi-language support in the React app.
* `REACT_APP_FEATURE_CAREER_PATHWAYS` - Toggle the display of career pathways feature as well as any reference to it.
* `REACT_APP_FEATURE_CAREER_NAVIGATOR` - Toggle the display of the Career Navigator landing page as well as any references to it.
* `REACT_APP_FEATURE_PINPOINT` - Show or hide any instance of the Pinpoint email collection tool.

##### Database

Dev, QA, and production databases are hosted in AWS as SQL instances running PostgreSQL.

* `DB_DEV_PASS` - Password for `postgres` user in dev environment

##### CareerOneStop

Dev and prod environments use a CareerOneStop account owned by NJ Office of Innovation.

* `CAREER_ONESTOP_USERID` - account username used both in dev and prod
* `CAREER_ONESTOP_AUTH_TOKEN` - account auth token used both in dev and prod

##### O*NET

* `ONET_BASEURL` - O*NET account base URL (dev + prod)
* `ONET_USERNAME`- O*NET account username (dev + prod)
* `ONET_PASSWORD`- O*NET account password (dev + prod)

##### Contentful GraphQL Content API

* `BASE_URL` - Typically `https://graphql.contentful.com`
* `ENVIRONMENT` - `master`, unless you have [multiple environments](https://www.contentful.com/developers/docs/concepts/multiple-environments/)
* `SPACE_ID` - Your project's unique [space ID](https://www.contentful.com/help/find-space-id/)

##### Sentry

* `SENTRY_DSN` - [Sentry Data Source Name (DSN)](https://docs.sentry.io/product/sentry-basics/dsn-explainer/)

##### General

* `IS_CI` - boolean flag for whether environment is deployed using continuous integration
* `NO_COLOR`
* `ZIPCODE_BASEURL`
* `ZIPCODE_API_KEY`

### Deployment

Generally, developers won't have to do this - we have automated deploys to dev and prod via [circleci](https://app.circleci.com/pipelines/github/newjersey/d4ad?branch=master).

Build frontend, build backend, compile all into one directory:

```shell script
./scripts/build.sh
```

Start the production server (frontend & backend):

```shell script
./scripts/prod-start.sh
```

### Testing and linting

Use these two scripts below in order to run our normal testing flows, which include:

- Formatting with [Prettier](https://prettier.io/)
- Linting with [ESLint](https://eslint.org/)
- Unit tests with [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- End to end tests with [Cypress](https://www.cypress.io/)

To run all [jest](https://jestjs.io/) tests, and linting:

```shell script
./scripts/test-all.sh
```

To run [cypress](https://www.cypress.io/) feature tests:

```shell script
./scripts/feature-tests.sh
```

### Tools and libraries

- **UI Components**: We use a combination of [Material UI](https://mui.com/) React components and modular CSS from the [New Jersey Web Design System](https://github.com/newjersey/njwds), which is a customized version of the [U.S. Web Design System](https://designsystem.digital.gov/).
- **Internationalization (i18n)**: We use the [i18next](https://react.i18next.com/) library to implement the logic of storing English and Spanish content and switching between the two on the client-side. All the content is stored in JSON files in `frontend/src/locales`.
- **Routing**: We add client-side routing to this single page app using the [Reach Router](https://reach.tech/router/) library, similar to the more common React Router.
- **User engagement**: We track user engagement using [Google Analytics](https://analytics.google.com/), including pageviews and specific event-based interactions that we implement manually in different parts of the app, such as tracking what filters a user clicks on the training search page. Please request access from the NJ Office of Innovation in order to view our analytics dashboards.
- **Accessibility**: We have automated a11y tests that run as part of our [Cypress](https://www.cypress.io/) feature tests using the [`cypress-axe`](https://www.npmjs.com/package/cypress-axe) package. We also use tools such as [axe DevTools](https://www.deque.com/axe/devtools/) and [WAVE](https://chrome.google.com/webstore/detail/wave-evaluation-tool/jbbplnpkjmmeebjpijfedlgcdilocofh) Chrome extensions to do manual checks.
- **Data APIs**: We fetch data from the following Web APIs: [O\*NET Web API](https://services.onetcenter.org/), [CareerOneStop](https://www.careeronestop.org/Developers/WebAPI/web-api.aspx). To access API keys to set as environment variables, request access for the NJInnovation Bitwarden account, and see the "Training Explorer Secrets" file in it.
- **SDKs** - We use [AWS SDK for JavaScript for Node.js](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started-nodejs.html) to collect user email address signups and retrieve secrets on the back-end.

### Dependency inversion

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
