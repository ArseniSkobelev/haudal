// ------------------------- Haudal Session Microservice -----------------------
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
import AuthController from "../controllers/auth";

const SessionRouter = express.Router();

const _CURRENT_ROUTE_PREFIX = '/api/v1/session'


//
// ------------------------------- Session routes -------------------------------
//
SessionRouter.post(`${_CURRENT_ROUTE_PREFIX}/`, async (req: Request, res: Response) => {
    const controller = new AuthController();
    controller.loginHandler(req.body.session, (data: any) => {
        return res.status(data.status).json(data.data);
    });
});


export default SessionRouter;