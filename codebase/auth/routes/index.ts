import express, { Request, Response } from "express";

import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();


//                       import API controllers
import PingController from "../controllers/ping";
import UserController from "../controllers/user";
import AuthController from "../controllers/auth";


//                          import models
import { User, IUser } from "../models/user";


//                          index route
router.get('/api/v1/', async (_req, res) => {
    return res.json({ "success": true, "message": `Haudal Authentication Service v${process.env.VERSION}` });
});


//                          test routes
router.get("/api/v1/ping", async (_req, res) => {
    const controller = new PingController();
    const response = await controller.getMessage();
    return res.status(200).send(response);
});


//                          user routes
router.post('/api/v1/user', async (req: Request, res: Response) => {
    let controller = new UserController();
    if (req.body.user != undefined) {
        let response = await controller.createUser(req.body.user);
        if (response.hasOwnProperty('success')) {
            return res.status(500).json(response);
        } else {
            return res.status(201).json({ "success": true, "message": "User created successfully", response });
        }
    } else {
        return res.status(500);
    }
})


//                        session routes
router.post('/api/v1/session', async (req: Request, res: Response) => {
    const controller = new AuthController();
    let response = await controller.login(req.body.login_data);
})


export default router;