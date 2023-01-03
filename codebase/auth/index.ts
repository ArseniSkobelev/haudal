import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = (process.env.PORT != undefined) ? process.env.PORT : 3000;

app.get('/', (req: Request, res: Response) => {
    res.json({ "success": true, "message": `Haudal Authentication Service v${process.env.VERSION}` });
});

app.listen(port, () => {
    console.log(`👾 [Haudal | Auth] Authentication server is running at port ${port}`);
});