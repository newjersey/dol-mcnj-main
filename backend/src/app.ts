import * as dotenv from "dotenv";
import "./utils/global";
import * as Sentry from "@sentry/node";
import express, { Request, Response } from "express";
import path from "path";
import cors from "cors";
import AWS from 'aws-sdk';
import { routerFactory } from "./routes/router";
import emailSubmissionRouter from './routes/emailRoutes';
import contentfulRouter from './contentful/index';
import contactRouter from './routes/contactRoutes'
import { PostgresDataClient } from "./database/data/PostgresDataClient";
import { findTrainingsByFactory } from "./domain/training/findTrainingsBy";
import { searchTrainingsFactory } from "./domain/search/searchTrainings";
import { getInDemandOccupationsFactory } from "./domain/occupations/getInDemandOccupations";
import { getOccupationDetailFactory } from "./domain/occupations/getOccupationDetail";
import { OnetClient } from "./oNET/OnetClient";
import { getEducationTextFactory } from "./domain/occupations/getEducationText";
import { getSalaryEstimateFactory } from "./domain/occupations/getSalaryEstimate";
import { CareerOneStopClient } from "./careeronestop/CareerOneStopClient";
import { credentialEngineFactory } from "./domain/credentialengine/CredentialEngineFactory";
import {getOccupationDetailByCIPFactory} from "./domain/occupations/getOccupationDetailByCIP";
import { allTrainings } from "./domain/search/allTrainings";
// import { rateLimiter } from "./utils/rateLimiter";

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
  tracesSampleRate: 1.0,
});

// Error handling for uncaught exceptions and unhandled rejections...
process.on('uncaughtException', function (exception) {
  Sentry.captureException(exception);
});

process.on("unhandledRejection", (reason) => {
  Sentry.captureException(reason);
});


// CORS options
const corsOptions = {
  origin: ['https://mycareer.nj.gov', 'http://localhost:3000'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200

};


// const contentfulLimiter = rateLimiter(60, 100) // max 100 requests in 1 min per ip
// const contactLimiter = rateLimiter(3600, 20) // max 20 emails in 1 hour per ip
// app.set('trust proxy', 1)
app.use(cors(corsOptions));

// RequestHandler and TracingHandler configuration...
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const awsConfig = new AWS.Config({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || undefined,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || undefined,
  region: process.env.AWS_REGION
});

type PostgresConnectionConfig = {
  user: string,
  host: string,
  database: string,
  password: string,
  port: number,
};

// Determine if the NODE_ENV begins with "aws"
let connection: PostgresConnectionConfig | null = null;

switch (process.env.NODE_ENV) {
  case "dev":
    connection = {
      user: "postgres",
      host: process.env.DB_HOST_DEV || '',
      database: "d4adlocal",
      password: process.env.DB_PASS_DEV || '',
      port: 5432,
    };
    break;
  case "test":
    connection = {
      user: "postgres",
      host: process.env.DB_HOST_TEST || '',
      database: "d4adtest",
      password: process.env.DB_PASS_TEST || '',
      port: 5432,
    };
    break;
  case "awsdev":
    connection = {
      user: "postgres",
      host: process.env.DB_HOST_WRITER_DEV || '',
      database: "d4addev",
      password: process.env.DB_PASS_DEV || '',
      port: 5432,
    };
    break;
  case "awstest":
    connection = {
      user: "postgres",
      host: process.env.DB_HOST_WRITER_TEST || '',
      database: "d4adtest",
      password: process.env.DB_PASS_TEST || '',
      port: 5432,
    };
    break;
  case "awsprod":
    connection = {
      user: "postgres",
      host: process.env.DB_HOST_WRITER_AWSPROD || '',
      database: "d4adprod",
      password: process.env.DB_PASS_AWSPROD || '',
      port: 5432,
    };
    break;
  default:
    console.error("Invalid NODE_ENV. Please set NODE_ENV to one of: dev, test, awsdev, awstest, awsprod.");
    process.exit(1);
}

const isCI = process.env.IS_CI;

// Default external API values
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

// Update external API values if not running in CI environment
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
const findTrainingsBy = findTrainingsByFactory(postgresDataClient);

const router = routerFactory({
  allTrainings: allTrainings(),
  searchTrainings: searchTrainingsFactory(postgresDataClient),
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
      postgresDataClient
  ),
  getAllCertificates: credentialEngineFactory(),
  getOccupationDetailByCIP: getOccupationDetailByCIPFactory(
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
app.use(express.json());
app.use("/api", router);
app.use('/api/contact', contactRouter)
app.use('/api/emails', emailSubmissionRouter);
app.use('/api/contentful', contentfulRouter);

// Routes for handling root and unknown routes...
app.get("/", (req: Request, res: Response) => {
  res.setHeader("Cache-Control", "no-cache");
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.get("*", (req: Request, res: Response) => {
  res.setHeader("Cache-Control", "no-cache");
  res.sendFile(path.join(__dirname, "build", "index.html"));
});


// Error handler for Sentry...
app.use(Sentry.Handlers.errorHandler());

export default app;
