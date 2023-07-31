import * as dotenv from "dotenv";
import * as Sentry from "@sentry/node";
import express, { Request, Response } from "express";
import cors from "cors";
import { routerFactory } from "./routes/router";
import { PostgresDataClient } from "./database/data/PostgresDataClient";
import { findTrainingsByFactory } from "./domain/training/findTrainingsBy";
import { searchTrainingsFactory } from "./domain/search/searchTrainings";
import { getInDemandOccupationsFactory } from "./domain/occupations/getInDemandOccupations";
import { getOccupationDetailFactory } from "./domain/occupations/getOccupationDetail";
import { OnetClient } from "./oNET/OnetClient";
import { getEducationTextFactory } from "./domain/occupations/getEducationText";
import { getSalaryEstimateFactory } from "./domain/occupations/getSalaryEstimate";
import { CareerOneStopClient } from "./careeronestop/CareerOneStopClient";
import fs from "fs";
import path from "path";
import {PostgresSearchClient} from "./database/search/PostgresSearchClient";

dotenv.config();

const app = express();

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app }),
    ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
  ],
  tracesSampleRate: 1.0,
});

process.on('uncaughtException', function (exception) {
  Sentry.captureException(exception);
});

process.on('unhandledRejection', (reason) => {
  Sentry.captureException(reason);
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// Load DB configurations from JSON file
const dbConfigPath = path.join(__dirname, "..", "database.json");
const dbConfigs = JSON.parse(fs.readFileSync(dbConfigPath, "utf-8"));
const dbConfig = dbConfigs[process.env.NODE_ENV || "dev"];

// Define connection settings for reader and writer
const readerConfig = {
  driver: dbConfig.reader.driver,
  user: dbConfig.reader.user,
  host: process.env[dbConfig.reader.host.ENV],
  database: dbConfig.reader.database,
  password: process.env[dbConfig.reader.password.ENV],
  port: 5432,
};

/*const writerConfig = {
  user: dbConfig.writer.user,
  host: process.env[dbConfig.writer.host.ENV],
  database: dbConfig.writer.database,
  password: process.env[dbConfig.writer.password.ENV],
  port: 5432,
};*/

const isCI = process.env.IS_CI;

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

const postgresDataClientReader = new PostgresDataClient(readerConfig);
console.log(JSON.stringify(readerConfig));
const postgresSearchClientReader = new PostgresSearchClient(readerConfig);
const findTrainingsBy = findTrainingsByFactory(postgresDataClientReader);

const router = routerFactory({
  searchTrainings: searchTrainingsFactory(findTrainingsBy, postgresSearchClientReader),
  findTrainingsBy: findTrainingsBy,
  getInDemandOccupations: getInDemandOccupationsFactory(postgresDataClientReader),
  getOccupationDetail: getOccupationDetailFactory(
      OnetClient(
          apiValues.onetBaseUrl,
          apiValues.onetAuth,
          postgresDataClientReader.find2018OccupationsBySoc2010
      ),
      getEducationTextFactory(postgresDataClientReader),
      getSalaryEstimateFactory(postgresDataClientReader),
      CareerOneStopClient(
          apiValues.careerOneStopBaseUrl,
          apiValues.careerOneStopUserId,
          apiValues.careerOneStopAuthToken
      ),
      findTrainingsBy,
      postgresDataClientReader
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

app.use(Sentry.Handlers.errorHandler());

export default app;
