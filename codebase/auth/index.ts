import express, { Express } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import morganBody from 'morgan-body';

import UserRouter from './routes';
import ExternalRouter from './routes/external';
import AppRouter from './routes/app';
import SessionRouter from './routes/session';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

dotenv.config();

const app: Express = express();

app.use(bodyParser.json());

morganBody(app);

// app.use(morgan('dev'));
app.use(express.json());
app.use(UserRouter, ExternalRouter, AppRouter, SessionRouter);

mongoose.connect(process.env.MONGODB_URI!, {
    authSource: "admin",
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