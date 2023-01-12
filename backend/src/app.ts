import * as dotenv from "dotenv";
dotenv.config();

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
import { credentialEngineFactory } from "./domain/credentialengine/CredentialEngineFactory";

const dbSocketPath = process.env.DB_SOCKET_PATH || "/cloudsql";
const connection = {
  user: process.env.DB_USER || "postgres",
  host: process.env.CLOUD_SQL_CONNECTION_NAME
    ? `${dbSocketPath}/${process.env.CLOUD_SQL_CONNECTION_NAME}`
    : "localhost",
  database: process.env.DB_NAME || "d4adlocal",
  password: process.env.DB_PASS || "",
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
// because in CI, we want to use wiremock jsons, not the real APIs
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

const postgresDataClient = new PostgresDataClient(connection);
const postgresSearchClient = new PostgresSearchClient(connection);
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
  getAllCertificates: credentialEngineFactory(),
});

const app = express();

app.use(cors());

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

export default app;
