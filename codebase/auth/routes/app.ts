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
import { isValidObjectId } from "mongoose";
import AppController from "../controllers/app";

const AppRouter = express.Router();

const _CURRENT_ROUTE_PREFIX = '/api/v1/app'


//
// -------------------------------- External routes -------------------------------
//
AppRouter.post(`${_CURRENT_ROUTE_PREFIX}/`, async (req: Request, res: Response) => {
    const controller = new AppController();
    controller.createApp(req.body.app, (data: any) => {
        return res.status(data.status).json({ data: data.data });
    });
});

AppRouter.get(`${_CURRENT_ROUTE_PREFIX}/:id`, async (req: Request, res: Response) => {
    const controller = new AppController();
    if (isValidObjectId(req.params.id)) {
        let appData = { _id: req.params.id };
        controller.findAppById(appData, (data: any) => {
            return res.status(data.status).json({ data: data.data });
        })
    } else {
        return res.status(500).json({ data: { message: "Internal Server Error" } })
    }
})

AppRouter.get(`${_CURRENT_ROUTE_PREFIX}/user/:id`, async (req: Request, res: Response) => {
    const controller = new AppController();
    if (isValidObjectId(req.params.id)) {
        let appData = { _id: req.params.id };
        controller.findAppByUserId(appData, (data: any) => {
            return res.status(data.status).json({ data: data.data });
        })
    } else {
        return res.status(500).json({ data: { message: "Internal Server Error" } })
    }
})

AppRouter.delete(`${_CURRENT_ROUTE_PREFIX}/:id`, async (req: Request, res: Response) => {
    const controller = new AppController();
    if (isValidObjectId(req.params.id)) {
        let appData = { _id: req.params.id };
        controller.deleteAppById(appData, (data: any) => {
            return res.status(data.status).json({ data: data.data });
        })
    } else {
        return res.status(500).json({ data: { message: "Internal Server Error" } })
    }
})


export default AppRouter;