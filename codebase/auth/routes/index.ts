import express, { Request, Response } from "express";

import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();


//                     import API controllers
import PingController from "../controllers/ping";
import UserController from "../controllers/user";
import AuthController from "../controllers/auth";
import ServiceController from "../controllers/service";
import { verifyUser } from "../middleware/verifyUser";


//                          index route
router.get('/api/v1/', async (_req, res) => {
    return res.json({ "success": true, "message": `Haudal Authentication Service v${process.env.VERSION}` });
});


//                          test routes
router.get("/api/v1/ping", verifyToken, async (_req, res) => {
    const controller = new PingController();
    const response = await controller.getMessage();
    return res.status(200).send(response);
});


//                          user routes
router.post('/api/v1/user', async (req: Request, res: Response) => {
    let controller = new UserController();
    if (req.body.user != undefined) {
        let response = await controller.createUser(req.body.user, (data: any) => {
            if (data.success) return res.status(201).json(data);
            return res.status(500).json(data);
        });
    } else {
        return res.status(500);
    }
})

router.get('/api/v1/user/:userId', verifyUser, async (req: Request, res: Response) => {
    let controller = new UserController();
    if (req.params.userId != undefined) {
        let response = await controller.getUserById(req.params.userId, (data: any) => {
            if (data.success) return res.status(200).json(data);
        });
    }
});


//                        session routes
router.post('/api/v1/session', async (req: Request, res: Response) => {
    const controller = new AuthController();
    let response = await controller.login(req.body.login_data, (result: any) => {
        return res.json(result);
    });
})

//                        service routes
router.get("/api/v1/service/clear", async (_req, res) => {
    const controller = new ServiceController();
    const response = await controller.clearCollections((err: any, resp: any) => {
        if (!err) return res.status(200).json({ success: true, data: resp });
        else return res.status(500).json(err);
    });
});


export default router;