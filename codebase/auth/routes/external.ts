// ----------------- Haudal External Authentication Microservice ----------------
//
//     Developed by:         Arseni Skobelev
//     Development started:  10.01.2023
// 
//     Tags:
//         User authentication,
//         Security
//
// ------------------------------------------------------------------------------


//
// --------------------- Default configuration and imports ----------------------
//
import express, { Request, Response } from "express";
import path from 'path';

const ExtenalRouter = express.Router();


//
// -------------------------------- External routes -------------------------------
//
ExtenalRouter.get('/api/v1/external/session', async (req: Request, res: Response) => {
    // console.log(__dirname);
    return res.sendFile(path.join(__dirname, '/static/login/login.html'))
});


export default ExtenalRouter;