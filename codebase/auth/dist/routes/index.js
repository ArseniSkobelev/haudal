"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//
// --------------------- Default configuration and imports ----------------------   
//
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
//
// ----------------------------- Middleware imports -----------------------------   
//
const verifyToken_1 = require("../middleware/verifyToken");
const verifyUser_1 = require("../middleware/verifyUser");
//
// --------------------------- API Controller imports ---------------------------   
//
const ping_1 = __importDefault(require("../controllers/ping"));
const user_1 = __importDefault(require("../controllers/user"));
const auth_1 = __importDefault(require("../controllers/auth"));
const service_1 = __importDefault(require("../controllers/service"));
//
// -------------------------------- Index routes --------------------------------   
//
router.get('/api/v1/', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.json({ "success": true, "message": `Haudal Authentication Service v${process.env.VERSION}` });
}));
//
// --------------------------------- Test routes ---------------------------------   
// FIXME: Test routes are not supposed to ever be accessible in a production environment.
//
router.get("/api/v1/ping", verifyToken_1.verifyToken, (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const controller = new ping_1.default();
    const response = yield controller.getMessage();
    return res.status(200).send(response);
}));
//
// --------------------------------- User routes ---------------------------------   
//
router.post('/api/v1/user', (req, res) => {
    const controller = new user_1.default();
    if (req.body.user != undefined) {
        controller.createUserFromData(req.body.user, (resp) => {
            return res.status(resp.status).json({ data: resp.data });
        });
    }
    else {
        return res.status(500).json({ data: { message: "Internal Server Error" } });
    }
});
router.get('/api/v1/user/:userId', verifyUser_1.verifyUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let controller = new user_1.default();
    if (req.params.userId != undefined) {
        let response = yield controller.getUserById(req.params.userId, (data) => {
            if (data.success)
                return res.status(200).json(data);
        });
    }
    else {
        return res.status(500).json({ success: false, data: { message: "Internal Server Error" } });
    }
}));
router.delete('/api/v1/user/:userId', verifyUser_1.verifyUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let controller = new user_1.default();
    if (req.params.userId != undefined) {
        let response = yield controller.deleteUser(req.params.userId, (data) => {
            if (data.success)
                return res.status(200).json(data);
        });
    }
    else {
        return res.status(500).json({ success: false, data: { message: "Internal Server Error" } });
    }
}));
router.put('/api/v1/user/:userId', verifyUser_1.verifyUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let controller = new user_1.default();
    if (req.params.userId != undefined) {
        let response = yield controller.updateUser(req.params.userId, req.body.user, (data) => {
            if (data.success)
                return res.status(200).json(data);
        });
    }
    else {
        return res.status(500).json({ success: false, data: { message: "Internal Server Error" } });
    }
}));
//
// -------------------------------- Session routes -------------------------------   
//
router.post('/api/v1/session', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const controller = new auth_1.default();
    let response = yield controller.login(req.body.login_data, (result) => {
        return res.json(result);
    });
}));
//
// -------------------------------- Service routes -------------------------------   
// FIXME: Service routes are not supposed to ever be accessible in a production environment.
//
// This route clears all of the collections defined in the helper class.
router.get("/api/v1/service/clear", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const controller = new service_1.default();
    const response = yield controller.clearCollections((err, resp) => {
        if (!err)
            return res.status(200).json({ success: true, data: resp });
        else
            return res.status(500).json(err);
    });
}));
exports.default = router;
