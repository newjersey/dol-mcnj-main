import express, { Request, Response } from "express";
import { routerFactory } from "./routes/router";
import path from "path";
import { PostgresDataClient } from "./database/data/PostgresDataClient";
import { searchTrainingsFactory } from "./domain/searchTrainings";
import { findTrainingByIdFactory } from "./domain/findTrainingById";
import { PostgresSearchClient } from "./database/search/PostgresSearchClient";

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

const postgresDataClient = new PostgresDataClient(connection);
const postgresSearchClient = new PostgresSearchClient(connection);

const router = routerFactory({
  searchTrainings: searchTrainingsFactory(postgresDataClient, postgresSearchClient),
  findTrainingById: findTrainingByIdFactory(postgresDataClient),
});

const app = express();

app.use(express.static(path.join(__dirname, "build")));
app.use("/api", router);
app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

export default app;
