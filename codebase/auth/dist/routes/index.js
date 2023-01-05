"use strict";
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
const express_1 = __importDefault(require("express"));
const verifyToken_1 = require("../middleware/verifyToken");
const router = express_1.default.Router();
//                     import API controllers
const ping_1 = __importDefault(require("../controllers/ping"));
const user_1 = __importDefault(require("../controllers/user"));
const auth_1 = __importDefault(require("../controllers/auth"));
const service_1 = __importDefault(require("../controllers/service"));
const verifyUser_1 = require("../middleware/verifyUser");
//                          index route
router.get('/api/v1/', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.json({ "success": true, "message": `Haudal Authentication Service v${process.env.VERSION}` });
}));
//                          test routes
router.get("/api/v1/ping", verifyToken_1.verifyToken, (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const controller = new ping_1.default();
    const response = yield controller.getMessage();
    return res.status(200).send(response);
}));
//                          user routes
router.post('/api/v1/user', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let controller = new user_1.default();
    if (req.body.user != undefined) {
        let response = yield controller.createUser(req.body.user, (data) => {
            if (data.success)
                return res.status(201).json(data);
            return res.status(500).json(data);
        });
    }
    else {
        return res.status(500);
    }
}));
router.get('/api/v1/user/:userId', verifyUser_1.verifyUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let controller = new user_1.default();
    if (req.params.userId != undefined) {
        let response = yield controller.getUserById(req.params.userId, (data) => {
            if (data.success)
                return res.status(200).json(data);
        });
    }
}));
//                        session routes
router.post('/api/v1/session', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const controller = new auth_1.default();
    let response = yield controller.login(req.body.login_data, (result) => {
        return res.json(result);
    });
}));
//                        service routes
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
