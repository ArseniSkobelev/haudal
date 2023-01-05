// --------------------- Haudal Authentication Microservice --------------------- 
//
//     Developed by:         Arseni Skobelev
//     Development started:  02.01.2023
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
const router = express.Router();


//
// ----------------------------- Middleware imports -----------------------------   
//
import { verifyToken } from "../middleware/verifyToken";
import { verifyUser } from "../middleware/verifyUser";


//
// --------------------------- API Controller imports ---------------------------   
//
import PingController from "../controllers/ping";
import UserController from "../controllers/user";
import AuthController from "../controllers/auth";
import ServiceController from "../controllers/service";


//
// -------------------------------- Index routes --------------------------------   
//
router.get('/api/v1/', async (_req, res) => {
    return res.json({ "success": true, "message": `Haudal Authentication Service v${process.env.VERSION}` });
});


//
// --------------------------------- Test routes ---------------------------------   
// FIXME: Test routes are not supposed to ever be accessible in a production environment.
//
router.get("/api/v1/ping", verifyToken, async (_req, res) => {
    const controller = new PingController();
    const response = await controller.getMessage();
    return res.status(200).send(response);
});


//
// --------------------------------- User routes ---------------------------------   
//
router.post('/api/v1/user', (req: Request, res: Response) => {
    const controller = new UserController();
    if (req.body.user != undefined) {
        controller.createUserFromData(req.body.user, (resp: any) => {
            return res.status(resp.status).json({ data: resp.data });
        });
    } else {
        return res.status(500).json({ data: { message: "Internal Server Error" } });
    }
})

router.get('/api/v1/user/:userId', verifyUser, async (req: Request, res: Response) => {
    let controller = new UserController();
    if (req.params.userId != undefined) {
        let response = await controller.getUserById(req.params.userId, (data: any) => {
            if (data.success) return res.status(200).json(data);
        });
    } else {
        return res.status(500).json({ success: false, data: { message: "Internal Server Error" } });
    }
});

router.delete('/api/v1/user/:userId', verifyUser, async (req: Request, res: Response) => {
    let controller = new UserController();
    if (req.params.userId != undefined) {
        let response = await controller.deleteUser(req.params.userId, (data: any) => {
            if (data.success) return res.status(200).json(data);
        });
    } else {
        return res.status(500).json({ success: false, data: { message: "Internal Server Error" } });
    }
});

router.put('/api/v1/user/:userId', verifyUser, async (req: Request, res: Response) => {
    let controller = new UserController();
    if (req.params.userId != undefined) {
        let response = await controller.updateUser(req.params.userId, req.body.user, (data: any) => {
            if (data.success) return res.status(200).json(data);
        });
    } else {
        return res.status(500).json({ success: false, data: { message: "Internal Server Error" } });
    }
});


//
// -------------------------------- Session routes -------------------------------   
//
router.post('/api/v1/session', async (req: Request, res: Response) => {
    const controller = new AuthController();
    let response = await controller.login(req.body.login_data, (result: any) => {
        return res.json(result);
    });
})

//
// -------------------------------- Service routes -------------------------------   
// FIXME: Service routes are not supposed to ever be accessible in a production environment.
//

// This route clears all of the collections defined in the helper class.
router.get("/api/v1/service/clear", async (_req, res) => {
    const controller = new ServiceController();
    const response = await controller.clearCollections((err: any, resp: any) => {
        if (!err) return res.status(200).json({ success: true, data: resp });
        else return res.status(500).json(err);
    });
});


export default router;