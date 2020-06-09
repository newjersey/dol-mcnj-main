import express, {Request, Response} from 'express';
import {routerFactory} from "./routes/router";
import path from "path";
import {PostgresDataClient} from "./data/PostgresDataClient";

const connection = {
    user: 'postgres',
    host: 'localhost',
    database: 'd4adlocal',
    password: '',
    port: 5432,
};
const postgresDataClient = new PostgresDataClient(connection);

const app = express();

app.use(express.static(path.join(__dirname, 'build')));
app.use('/api', routerFactory(postgresDataClient));
app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

export default app;