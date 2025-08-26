import * as dotenv from "dotenv";
import "./utils/global";
import * as Sentry from "@sentry/node";
import express, { Request, Response } from "express";
import path from "path";
import cors from "cors";
import AWS from "aws-sdk";
import { routerFactory } from "./routes/router";
import emailSubmissionRouter from "./routes/emailRoutes";
import contentfulRouter from "./contentful/index";
import contactRouter from "./routes/contactRoutes";
import signUpRouter from "./routes/signupRoutes";
import { PostgresDataClient } from "./database/data/PostgresDataClient";
import { RedisDataClient } from "./infrastructure/redis/RedisDataClient";
import { CacheWarmingService } from "./infrastructure/redis/CacheWarmingService";
import { RedisMonitoringService } from "./infrastructure/redis/RedisMonitoringService";
import { redisClient } from "./infrastructure/redis/redisClient";
import { findTrainingsByFactory } from "./domain/training/findTrainingsBy";
import { searchTrainingsFactory } from "./domain/search/searchTrainings";
import { getInDemandOccupationsFactory } from "./domain/occupations/getInDemandOccupations";
import { getOccupationDetailFactory } from "./domain/occupations/getOccupationDetail";
import { OnetClient } from "./oNET/OnetClient";
import { getEducationTextFactory } from "./domain/occupations/getEducationText";
import { getSalaryEstimateFactory } from "./domain/occupations/getSalaryEstimate";
import { CareerOneStopClient } from "./careeronestop/CareerOneStopClient";
import { credentialEngineFactory } from "./domain/credentialengine/CredentialEngineFactory";
import { getOccupationDetailByCIPFactory } from "./domain/occupations/getOccupationDetailByCIP";
import helmet from "helmet";
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
process.on("uncaughtException", function (exception) {
  Sentry.captureException(exception);
});

process.on("unhandledRejection", (reason) => {
  Sentry.captureException(reason);
});

// CORS options
const corsOptions = {
  origin: ["https://mycareer.nj.gov", "http://localhost:3000"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],

      scriptSrc: [
        "'self'",
        "'unsafe-inline'", // for GTM bootstrap
        "'unsafe-eval'", // required for GTM preview & Custom JS
        "'report-sample'",
        "https://www.googletagmanager.com",
        "https://tagmanager.google.com",
        "https://www.google-analytics.com",
        "https://analytics.google.com",
        "https://www.google.com",
        "https://adservice.google.com",
        "https://pagead2.googlesyndication.com",
        "https://*.doubleclick.net",
      ],
      scriptSrcElem: [
        "'self'",
        "'unsafe-inline'",
        "https://www.googletagmanager.com",
        "https://tagmanager.google.com",
        "https://www.google-analytics.com",
        "https://analytics.google.com",
        "https://www.google.com",
        "https://adservice.google.com",
        "https://pagead2.googlesyndication.com",
        "https://*.doubleclick.net",
      ],
      scriptSrcAttr: ["'unsafe-inline'"], // changed from 'none' to allow GTM inline handlers

      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com",
        "https://www.googletagmanager.com",
        "https://tagmanager.google.com",
      ],
      styleSrcElem: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com",
        "https://www.googletagmanager.com",
        "https://tagmanager.google.com",
      ],

      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://fonts.googleapis.com", "data:"],
      imgSrc: [
        "'self'",
        "data:",
        "blob:",
        "https://www.googletagmanager.com",
        "https://www.google-analytics.com",
        "https://ssl.gstatic.com",
        "https://www.gstatic.com",
        "https://fonts.gstatic.com", // added to fix icon image blocking
        "https://*.ctfassets.net",
        "https://pagead2.googlesyndication.com",
        "https://www.googleadservices.com",
        "https://*.doubleclick.net",
      ],
      connectSrc: [
        "'self'",
        "https://www.google-analytics.com",
        "https://region1.google-analytics.com",
        "https://analytics.google.com",
        "https://www.googletagmanager.com",
        "https://pagead2.googlesyndication.com",
        "https://www.googleadservices.com",
        "https://*.ctfassets.net",
      ],
      frameSrc: [
        "'self'",
        "https://www.googletagmanager.com",
        "https://tagmanager.google.com",
        "https://*.doubleclick.net",
        "https://www.google.com",
        "https://www.youtube.com",
        "https://www.youtube-nocookie.com",
      ],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'self'"],
      upgradeInsecureRequests: [], // will be ignored in report-only
      // Optional: enable CSP reporting endpoint if needed
      // reportUri: "/csp-report",
    },
  }),
);

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
  region: process.env.AWS_REGION,
});

type PostgresConnectionConfig = {
  user: string;
  host: string;
  database: string;
  password: string;
  port: number;
};

// Determine if the NODE_ENV begins with "aws"
let connection: PostgresConnectionConfig | null = null;

switch (process.env.NODE_ENV) {
  case "dev":
    connection = {
      user: "postgres",
      host: process.env.DB_HOST_DEV || "",
      database: "d4adlocal",
      password: process.env.DB_PASS_DEV || "",
      port: 5432,
    };
    break;
  case "test":
    connection = {
      user: "postgres",
      host: process.env.DB_HOST_TEST || "",
      database: "d4adtest",
      password: process.env.DB_PASS_TEST || "",
      port: 5432,
    };
    break;
  case "awsdev":
    connection = {
      user: "postgres",
      host: process.env.DB_HOST_WRITER_AWSDEV || "",
      database: "d4addev",
      password: process.env.DB_PASS_AWSDEV || "",
      port: 5432,
    };
    break;
  case "awstest":
    connection = {
      user: "postgres",
      host: process.env.DB_HOST_WRITER_AWSTEST || "",
      database: "d4adlocal",
      password: process.env.DB_PASS_AWSTEST || "",
      port: 5432,
    };
    break;
  case "awsprod":
    connection = {
      user: "postgres",
      host: process.env.DB_HOST_WRITER_AWSPROD || "",
      database: "d4adprod",
      password: process.env.DB_PASS_AWSPROD || "",
      port: 5432,
    };
    break;
  default:
    console.error(
      "Invalid NODE_ENV. Please set NODE_ENV to one of: dev, test, awsdev, awstest, awsprod.",
    );
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

// Initialize Redis infrastructure
let dataClient = postgresDataClient;
let cacheWarmingService: CacheWarmingService | null = null;
let redisMonitoringService: RedisMonitoringService | null = null;

// Only initialize Redis if Redis is configured and enabled
const useRedis = process.env.REDIS_ENABLED === 'true' && process.env.REDIS_HOST;

if (useRedis) {
  try {
    console.log('Initializing Redis infrastructure...');
    
    // Create Redis data client with fallback to PostgreSQL
    const redisDataClient = new RedisDataClient(redisClient, postgresDataClient);
    dataClient = redisDataClient;
    
    // Initialize monitoring service
    redisMonitoringService = new RedisMonitoringService(redisClient);
    redisMonitoringService.startMonitoring(30000); // Monitor every 30 seconds
    
    // Initialize cache warming service
    const findTrainingsBy = findTrainingsByFactory(postgresDataClient);
    cacheWarmingService = new CacheWarmingService(
      redisDataClient,
      postgresDataClient,
      findTrainingsBy,
      {
        batchSize: 50,
        delayBetweenBatches: 500,
        enableAutoWarming: process.env.REDIS_AUTO_WARMING === 'true',
      }
    );
    
    // Connect to Redis
    redisClient.connect().then(() => {
      console.log('Redis infrastructure initialized successfully');
      
      // Start cache warming for critical data
      if (cacheWarmingService) {
        cacheWarmingService.warmCriticalData().catch(error => {
          console.error('Initial cache warming failed:', error);
        });
      }
    }).catch(error => {
      console.error('Failed to connect to Redis, falling back to PostgreSQL only:', error);
      dataClient = postgresDataClient;
    });
    
  } catch (error) {
    console.error('Failed to initialize Redis infrastructure, falling back to PostgreSQL only:', error);
    dataClient = postgresDataClient;
  }
} else {
  console.log('Redis not configured or disabled, using PostgreSQL only');
}

const findTrainingsBy = findTrainingsByFactory(dataClient);

const router = routerFactory({
  allTrainings: allTrainings(),
  searchTrainings: searchTrainingsFactory(dataClient),
  findTrainingsBy: findTrainingsBy,
  getInDemandOccupations: getInDemandOccupationsFactory(dataClient),
  getOccupationDetail: getOccupationDetailFactory(
    OnetClient(
      apiValues.onetBaseUrl,
      apiValues.onetAuth,
      dataClient.find2018OccupationsBySoc2010,
    ),
    getEducationTextFactory(dataClient),
    getSalaryEstimateFactory(dataClient),
    CareerOneStopClient(
      apiValues.careerOneStopBaseUrl,
      apiValues.careerOneStopUserId,
      apiValues.careerOneStopAuthToken,
      ),
      dataClient,
  ),
  getAllCertificates: credentialEngineFactory(),
  getOccupationDetailByCIP: getOccupationDetailByCIPFactory(
    OnetClient(
      apiValues.onetBaseUrl,
      apiValues.onetAuth,
      dataClient.find2018OccupationsBySoc2010,
    ),
    getEducationTextFactory(dataClient),
    getSalaryEstimateFactory(dataClient),
    CareerOneStopClient(
      apiValues.careerOneStopBaseUrl,
      apiValues.careerOneStopUserId,
      apiValues.careerOneStopAuthToken,
    ),
    findTrainingsBy,
    dataClient,
  ),
});

app.use(express.static(path.join(__dirname, "build"), { etag: false, lastModified: false }));
app.use(express.json());
app.use("/api", router);
app.use("/api/contact", contactRouter);
app.use("/api/signup", signUpRouter);
app.use("/api/emails", emailSubmissionRouter);
app.use("/api/contentful", contentfulRouter);

app.get("/faq", (req, res) => {
  res.status(503).send("Service Unavailable: The FAQ page is down for maintenance.");
});

// Redis monitoring and health check endpoints
app.get("/api/health/redis", async (req: Request, res: Response) => {
  try {
    if (!redisMonitoringService) {
      return res.status(200).json({
        status: 'disabled',
        message: 'Redis is not configured or enabled',
        postgresOnly: true
      });
    }

    const healthStatus = redisMonitoringService.getHealthStatus();
    const statusCode = healthStatus.status === 'healthy' ? 200 : 
                      healthStatus.status === 'degraded' ? 206 : 503;
    
    res.status(statusCode).json(healthStatus);
  } catch (error) {
    console.error('Redis health check failed:', error);
    res.status(503).json({ 
      status: 'unhealthy', 
      error: 'Health check failed',
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    });
  }
});

app.get("/api/metrics/redis", async (req: Request, res: Response) => {
  try {
    if (!redisMonitoringService) {
      return res.status(404).json({
        error: 'Redis monitoring not available',
        message: 'Redis is not configured or enabled'
      });
    }

    const metrics = redisMonitoringService.getMetrics();
    res.json(metrics);
  } catch (error) {
    console.error('Failed to get Redis metrics:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve metrics',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get("/api/report/redis", async (req: Request, res: Response) => {
  try {
    if (!redisMonitoringService) {
      return res.status(404).json({
        error: 'Redis monitoring not available',
        message: 'Redis is not configured or enabled'
      });
    }

    const report = await redisMonitoringService.generateReport();
    res.set('Content-Type', 'text/plain');
    res.send(report);
  } catch (error) {
    console.error('Failed to generate Redis report:', error);
    res.status(500).json({ 
      error: 'Failed to generate report',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Credential Engine cache management endpoints
app.get("/api/cache/credential-engine/stats", async (req: Request, res: Response) => {
  try {
    const { credentialEngineCacheService } = await import("./infrastructure/redis/CredentialEngineCacheService");
    const stats = await credentialEngineCacheService.getCacheStats();
    res.json({
      status: 'success',
      cache: 'credential-engine',
      stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to get Credential Engine cache stats:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve cache statistics',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.post("/api/cache/credential-engine/warm", async (req: Request, res: Response) => {
  try {
    const { credentialEngineCacheService } = await import("./infrastructure/redis/CredentialEngineCacheService");
    const { ctids } = req.body;
    
    if (!ctids || !Array.isArray(ctids)) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Expected an array of CTIDs in request body'
      });
    }

    // Start warming in background
    credentialEngineCacheService.warmCache(ctids).catch(error => {
      console.error('Cache warming failed:', error);
    });

    res.json({
      status: 'accepted',
      message: `Started warming cache for ${ctids.length} CTIDs`,
      ctids: ctids.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to start cache warming:', error);
    res.status(500).json({ 
      error: 'Failed to start cache warming',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.delete("/api/cache/credential-engine/clear", async (req: Request, res: Response) => {
  try {
    const { credentialEngineCacheService } = await import("./infrastructure/redis/CredentialEngineCacheService");
    await credentialEngineCacheService.clearCache();
    res.json({
      status: 'success',
      message: 'Credential Engine cache cleared successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to clear Credential Engine cache:', error);
    res.status(500).json({ 
      error: 'Failed to clear cache',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.post("/api/cache/warm", async (req: Request, res: Response) => {
  try {
    if (!cacheWarmingService) {
      return res.status(404).json({
        error: 'Cache warming not available',
        message: 'Redis is not configured or enabled'
      });
    }

    const { type = 'critical', trainingIds, queries } = req.body;
    
    if (type === 'critical') {
      await cacheWarmingService.warmCriticalData();
      res.json({ message: 'Critical data cache warming started' });
    } else if (type === 'training' && trainingIds) {
      await cacheWarmingService.warmTrainingData(trainingIds);
      res.json({ message: `Training data cache warming started for ${trainingIds.length} trainings` });
    } else if (type === 'search' && queries) {
      await cacheWarmingService.warmSearchData(queries);
      res.json({ message: `Search data cache warming started for ${queries.length} queries` });
    } else {
      res.status(400).json({ 
        error: 'Invalid cache warming request',
        message: 'Valid types: critical, training (with trainingIds), search (with queries)'
      });
    }
  } catch (error) {
    console.error('Cache warming failed:', error);
    res.status(500).json({ 
      error: 'Cache warming failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.delete("/api/cache/clear", async (req: Request, res: Response) => {
  try {
    if (!cacheWarmingService) {
      return res.status(404).json({
        error: 'Cache management not available',
        message: 'Redis is not configured or enabled'
      });
    }

    const { pattern } = req.query;
    await cacheWarmingService.clearCache(pattern as string);
    res.json({ 
      message: pattern 
        ? `Cache cleared for pattern: ${pattern}` 
        : 'All cache cleared'
    });
  } catch (error) {
    console.error('Cache clearing failed:', error);
    res.status(500).json({ 
      error: 'Cache clearing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

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
