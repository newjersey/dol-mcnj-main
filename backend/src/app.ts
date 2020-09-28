import express, { Request, Response } from "express";
import path from "path";
import cors from "cors";
import { routerFactory } from "./routes/router";
import { PostgresDataClient } from "./database/data/PostgresDataClient";
import { PostgresSearchClient } from "./database/search/PostgresSearchClient";
import { findTrainingsByIdsFactory } from "./domain/training/findTrainingsByIds";
import { searchTrainingsFactory } from "./domain/search/searchTrainings";
import { getInDemandOccupationsFactory } from "./domain/occupations/getInDemandOccupations";
import { getOccupationDetailFactory } from "./domain/occupations/getOccupationDetail";
import { ZipcodeClient } from "./zipcodes/ZipcodeClient";
import { OnetClient } from "./oNET/OnetClient";
import { getEducationTextFactory } from "./domain/occupations/getEducationText";
import { getSalaryEstimateFactory } from "./domain/occupations/getSalaryEstimate";
import { CareerOneStopClient } from "./careeronestop/CareerOneStopClient";

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
  zipcodeApiKey: "ZIPCODE_API_KEY",
  zipcodeBaseUrl: "http://localhost:8090",
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
  apiValues.zipcodeApiKey = process.env.ZIPCODE_API_KEY || "ZIPCODE_API_KEY";
  apiValues.zipcodeBaseUrl = process.env.ZIPCODE_BASEURL || "http://localhost:8090";

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
const findTrainingsByIds = findTrainingsByIdsFactory(postgresDataClient);

const router = routerFactory({
  searchTrainings: searchTrainingsFactory(findTrainingsByIds, postgresSearchClient),
  findTrainingsByIds: findTrainingsByIds,
  getInDemandOccupations: getInDemandOccupationsFactory(postgresDataClient),
  getZipCodesInRadius: ZipcodeClient(apiValues.zipcodeBaseUrl, apiValues.zipcodeApiKey),
  getOccupationDetail: getOccupationDetailFactory(
    OnetClient(apiValues.onetBaseUrl, apiValues.onetAuth),
    getEducationTextFactory(postgresDataClient),
    getSalaryEstimateFactory(postgresDataClient),
    CareerOneStopClient(
      apiValues.careerOneStopBaseUrl,
      apiValues.careerOneStopUserId,
      apiValues.careerOneStopAuthToken
    ),
    postgresDataClient
  ),
});

const app = express();

app.use(cors());

app.use(express.static(path.join(__dirname, "build")));
app.use("/api", router);
app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

export default app;
