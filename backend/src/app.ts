import * as dotenv from "dotenv";
import * as Sentry from "@sentry/node";
import express, { Request, Response } from "express";
import path from "path";
import cors from "cors";
import { routerFactory } from "./routes/router";
import { PostgresDataClient } from "./database/data/PostgresDataClient";
import { PostgresSearchClient } from "./database/search/PostgresSearchClient";
import { findTrainingsByFactory } from "./domain/training/findTrainingsBy";
import { searchTrainingsFactory } from "./domain/search/searchTrainings";
import { getInDemandOccupationsFactory } from "./domain/occupations/getInDemandOccupations";
import { getOccupationDetailFactory } from "./domain/occupations/getOccupationDetail";
import { OnetClient } from "./oNET/OnetClient";
import { getEducationTextFactory } from "./domain/occupations/getEducationText";
import { getSalaryEstimateFactory } from "./domain/occupations/getSalaryEstimate";
import { CareerOneStopClient } from "./careeronestop/CareerOneStopClient";
import * as databaseConfig from '../database.json';

dotenv.config();
// console.log(process.env);

const app = express();

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({ app }),
    // Automatically instrument Node.js libraries and frameworks
    ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

process.on('uncaughtException', function (exception) {
  Sentry.captureException(exception);
});

process.on('unhandledRejection', (reason) => {
  Sentry.captureException(reason);
});

// RequestHandler creates a separate execution context, so that all
// transactions/spans/breadcrumbs are isolated across requests
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

const env = process.env.NODE_ENV || 'dev';
const dbConfig = databaseConfig[env];

const dbWriterConfig = dbConfig.writer;
const dbReaderConfig = dbConfig.reader;

const connectionWriter = {
  user: process.env[dbWriterConfig.user] || dbWriterConfig.user,
  host: process.env[dbWriterConfig.host.ENV] || dbWriterConfig.host,
  database: dbWriterConfig.database,
  password: process.env[dbWriterConfig.password.ENV] || dbWriterConfig.password,
  port: 5432,
};

const connectionReader = {
  user: process.env[dbReaderConfig.user] || dbReaderConfig.user,
  host: process.env[dbReaderConfig.host.ENV] || dbReaderConfig.host,
  database: dbReaderConfig.database,
  password: process.env[dbReaderConfig.password.ENV] || dbReaderConfig.password,
  port: 5432,
};

const isCI = process.env.IS_CI;

// default external api values
const apiValues = {
  onetBaseUrl: "http://localhost:8090",
  onetAuth: {
    username: "ONET_USERNAME",
    password: "ONET_PASSWORD",
  },
  careerOneStopBaseUrl: "http://localhost:8090",
  careerOneStopUserId: "CAREER_ONESTOP_USERID",
  careerOneStopAuthToken: "CAREER_ONESTOP_AUTH_TOKEN",
};

// try to update to use env vars in all cases EXCEPT running feature tests in CI
// because in CI,f we want to use wiremock jsons, not the real APIs
if (!isCI) {
  apiValues.onetBaseUrl = process.env.ONET_BASEURL || "http://localhost:8090";
  apiValues.onetAuth = {
    username: process.env.ONET_USERNAME || "ONET_USERNAME",
    password: process.env.ONET_PASSWORD || "ONET_PASSWORD",
  };

  apiValues.careerOneStopBaseUrl = process.env.CAREER_ONESTOP_BASEURL || "http://localhost:8090";
  apiValues.careerOneStopUserId = process.env.CAREER_ONESTOP_USERID || "CAREER_ONESTOP_USERID";
  apiValues.careerOneStopAuthToken =
    process.env.CAREER_ONESTOP_AUTH_TOKEN || "CAREER_ONESTOP_AUTH_TOKEN";
}

const postgresDataClient = new PostgresDataClient(connectionWriter);
const postgresSearchClient = new PostgresSearchClient(connectionReader);
const findTrainingsBy = findTrainingsByFactory(postgresDataClient);

const router = routerFactory({
  searchTrainings: searchTrainingsFactory(findTrainingsBy, postgresSearchClient),
  findTrainingsBy: findTrainingsBy,
  getInDemandOccupations: getInDemandOccupationsFactory(postgresDataClient),
  getOccupationDetail: getOccupationDetailFactory(
    OnetClient(
      apiValues.onetBaseUrl,
      apiValues.onetAuth,
      postgresDataClient.find2018OccupationsBySoc2010
    ),
    getEducationTextFactory(postgresDataClient),
    getSalaryEstimateFactory(postgresDataClient),
    CareerOneStopClient(
      apiValues.careerOneStopBaseUrl,
      apiValues.careerOneStopUserId,
      apiValues.careerOneStopAuthToken
    ),
    findTrainingsBy,
    postgresDataClient
  ),
});

app.use(express.static(path.join(__dirname, "build"), { etag: false, lastModified: false }));
app.use("/api", router);
app.get("/", (req: Request, res: Response) => {
  res.setHeader("Cache-Control", "no-cache");
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
app.get("*", (req: Request, res: Response) => {
  res.setHeader("Cache-Control", "no-cache");
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.use(cors());

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

export default app;
