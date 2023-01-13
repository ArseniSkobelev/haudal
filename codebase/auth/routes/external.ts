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

const ExternalRouter = express.Router();

const _CURRENT_ROUTE_PREFIX = '/api/v1/external'


//
// -------------------------------- External routes -------------------------------
//
ExternalRouter.get(`${_CURRENT_ROUTE_PREFIX}/:appId`, async (req: Request, res: Response) => {
    return res.sendFile(path.join(`C:\\Users\\arsskobe\\Documents\\Arseni\\Code\\Projects\\haudal\\codebase\\auth\\routes\\`, 'static/login/login.html'));
});


export default ExternalRouter;