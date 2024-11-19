"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dotenv = tslib_1.__importStar(require("dotenv"));
require("./utils/global");
const Sentry = tslib_1.__importStar(require("@sentry/node"));
const express_1 = tslib_1.__importDefault(require("express"));
const path_1 = tslib_1.__importDefault(require("path"));
const cors_1 = tslib_1.__importDefault(require("cors"));
const aws_sdk_1 = tslib_1.__importDefault(require("aws-sdk"));
const router_1 = require("./routes/router");
const emailRoutes_1 = tslib_1.__importDefault(require("./routes/emailRoutes"));
const index_1 = tslib_1.__importDefault(require("./contentful/index"));
const contactRoutes_1 = tslib_1.__importDefault(require("./routes/contactRoutes"));
const PostgresDataClient_1 = require("./database/data/PostgresDataClient");
const PostgresSearchClient_1 = require("./database/search/PostgresSearchClient");
const findTrainingsBy_1 = require("./domain/training/findTrainingsBy");
const searchTrainings_1 = require("./domain/search/searchTrainings");
const getInDemandOccupations_1 = require("./domain/occupations/getInDemandOccupations");
const getOccupationDetail_1 = require("./domain/occupations/getOccupationDetail");
const OnetClient_1 = require("./oNET/OnetClient");
const getEducationText_1 = require("./domain/occupations/getEducationText");
const getSalaryEstimate_1 = require("./domain/occupations/getSalaryEstimate");
const CareerOneStopClient_1 = require("./careeronestop/CareerOneStopClient");
const getOccupationDetailByCIP_1 = require("./domain/occupations/getOccupationDetailByCIP");
dotenv.config();
const app = (0, express_1.default)();
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
process.on("unhandledRejection", (reason) => {
    Sentry.captureException(reason);
});
const corsOptions = {
    origin: ['https://mycareer.nj.gov', 'http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};
app.use((0, cors_1.default)(corsOptions));
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
const awsConfig = new aws_sdk_1.default.Config({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || undefined,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || undefined,
    region: process.env.AWS_REGION
});
let connection = null;
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
            host: process.env.DB_HOST_WRITER_AWSDEV || '',
            database: "d4addev",
            password: process.env.DB_PASS_AWSDEV || '',
            port: 5432,
        };
        break;
    case "awstest":
        connection = {
            user: "postgres",
            host: process.env.DB_HOST_WRITER_AWSTEST || '',
            database: "d4adtest",
            password: process.env.DB_PASS_AWSTEST || '',
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
const postgresDataClient = new PostgresDataClient_1.PostgresDataClient(connection);
const postgresSearchClient = new PostgresSearchClient_1.PostgresSearchClient(connection);
const findTrainingsBy = (0, findTrainingsBy_1.findTrainingsByFactory)(postgresDataClient);
const router = (0, router_1.routerFactory)({
    searchTrainings: (0, searchTrainings_1.searchTrainingsFactory)(findTrainingsBy, postgresSearchClient),
    findTrainingsBy: findTrainingsBy,
    getInDemandOccupations: (0, getInDemandOccupations_1.getInDemandOccupationsFactory)(postgresDataClient),
    getOccupationDetail: (0, getOccupationDetail_1.getOccupationDetailFactory)((0, OnetClient_1.OnetClient)(apiValues.onetBaseUrl, apiValues.onetAuth, postgresDataClient.find2018OccupationsBySoc2010), (0, getEducationText_1.getEducationTextFactory)(postgresDataClient), (0, getSalaryEstimate_1.getSalaryEstimateFactory)(postgresDataClient), (0, CareerOneStopClient_1.CareerOneStopClient)(apiValues.careerOneStopBaseUrl, apiValues.careerOneStopUserId, apiValues.careerOneStopAuthToken), findTrainingsBy, postgresDataClient),
    getOccupationDetailByCIP: (0, getOccupationDetailByCIP_1.getOccupationDetailByCIPFactory)((0, OnetClient_1.OnetClient)(apiValues.onetBaseUrl, apiValues.onetAuth, postgresDataClient.find2018OccupationsBySoc2010), (0, getEducationText_1.getEducationTextFactory)(postgresDataClient), (0, getSalaryEstimate_1.getSalaryEstimateFactory)(postgresDataClient), (0, CareerOneStopClient_1.CareerOneStopClient)(apiValues.careerOneStopBaseUrl, apiValues.careerOneStopUserId, apiValues.careerOneStopAuthToken), findTrainingsBy, postgresDataClient),
});
app.use(express_1.default.static(path_1.default.join(__dirname, "build"), { etag: false, lastModified: false }));
app.use(express_1.default.json());
app.use("/api", router);
app.use('/api/contact', contactRoutes_1.default);
app.use('/api/emails', emailRoutes_1.default);
app.use('/api/contentful', index_1.default);
app.get("/", (req, res) => {
    res.setHeader("Cache-Control", "no-cache");
    res.sendFile(path_1.default.join(__dirname, "build", "index.html"));
});
app.get("*", (req, res) => {
    res.setHeader("Cache-Control", "no-cache");
    res.sendFile(path_1.default.join(__dirname, "build", "index.html"));
});
app.use(Sentry.Handlers.errorHandler());
exports.default = app;
