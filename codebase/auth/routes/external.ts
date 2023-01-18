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
import ExternalController from "../controllers/external";

const _CURRENT_ROUTE_PREFIX = '/api/v1/external'


//
// -------------------------------- External routes -------------------------------
//
ExternalRouter.get(`${_CURRENT_ROUTE_PREFIX}/:token&:redirectUrl`, async (req: Request, res: Response) => {
    const controller = new ExternalController();
    controller.externalAuthentication({
        token: req.params.token,
        redirectUrl: req.params.redirectUrl
    }, (data: any) => {
        if (data.status === 200 && data.data.valid === true) {
            return res.sendFile(path.join(__dirname, '/static/login/login.html'))
        }
    })
});


export default ExternalRouter;