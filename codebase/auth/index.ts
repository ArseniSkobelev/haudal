import express, { Express } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';

import Router from './routes';
import ExternalRouter from './routes/external';
import AppRouter from './routes/app';
import SessionRouter from './routes/session';
import mongoose from 'mongoose';

dotenv.config();

const app: Express = express();

app.use(morgan('tiny'));
app.use(express.json());
app.use(Router, ExternalRouter, AppRouter, SessionRouter);

mongoose.connect(process.env.MONGODB_URI || "localhost", {
    authSource: "admin",
    user: process.env.MONGODB_USER,
    pass: process.env.MONGODB_PASS,
    connectTimeoutMS: 150000,
    socketTimeoutMS: 90000,
    maxIdleTimeMS: 60000
}, (err) => {
    if (err) return console.error(err);
    else {
        console.log("👾 [Haudal | Auth] Connection to MongoDB established successfully");
    }
});

const port = (process.env.PORT != undefined) ? process.env.PORT : 3000;

app.listen(port, () => {
    console.log(`👾 [Haudal | Auth] Authentication server is running at port ${port}`);
});

export { app };