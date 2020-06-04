# D4AD
Data for the American Dream

## Getting Started

This [typescript](https://www.typescriptlang.org/) repo is structured with two primary sub-folders:

 - **backend** - the [express](https://expressjs.com/) API server
 - **frontend** - the [react](https://reactjs.org/) web UI
 
### Install Dependencies

```shell script
./scripts/install-all.sh
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

Run [jest](https://jestjs.io/) tests
```shell script
./scripts/test-all.sh
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
