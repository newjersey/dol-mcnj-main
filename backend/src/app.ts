import { Request, Response } from 'express';
import express from 'express';
import router from "./routes/router";
import path from "path";

const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

export default app;