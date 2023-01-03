import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
console.log(process.env.PORT);
const port = (process.env.PORT != undefined) ? process.env.PORT : 3000;

app.get('/', (req: Request, res: Response) => {
    res.json({ "success": true, "message": "Haudal Authentication Service v1.0" });
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});