import express, {Request, Response} from 'express';
import {routerFactory} from "./routes/router";
import path from "path";
import {PostgresDataClient} from "./data/PostgresDataClient";

const dbSocketPath = process.env.DB_SOCKET_PATH || "/cloudsql";
const connection = {
    user: process.env.DB_USER || 'postgres',
    host: process.env.CLOUD_SQL_CONNECTION_NAME ? `${dbSocketPath}/${process.env.CLOUD_SQL_CONNECTION_NAME}` : 'localhost',
    database: process.env.DB_NAME || 'd4adlocal',
    password: process.env.DB_PASS || '',
    port: 5432,
};

const postgresDataClient = new PostgresDataClient(connection);

const app = express();

app.use(express.static(path.join(__dirname, 'build')));
app.use('/api', routerFactory(postgresDataClient));
app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

export default app;