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
const router = express_1.default.Router();
//  --------------------  import API controllers  -------------------
const ping_1 = __importDefault(require("../controllers/ping"));
const user_1 = __importDefault(require("../controllers/user"));
const auth_1 = __importDefault(require("../controllers/auth"));
//  ----------------------------------------------------------------
//  --------------------  user routes  ------------------------------
router.post('/api/v1/user', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let controller = new user_1.default();
    let response = yield controller.createUser(req.body.user);
    if (response.hasOwnProperty('success')) {
        return res.status(500).json(response);
    }
    else {
        return res.status(201).json({ "success": true, "message": "User created successfully", "user": response });
    }
}));
router.post('/api/v1/session', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const controller = new auth_1.default();
    let response = yield controller.login(req.body.login_data);
}));
//  ----------------------------------------------------------------
router.get("/api/v1/ping", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const controller = new ping_1.default();
    const response = yield controller.getMessage();
    return res.send(response);
}));
router.get('/api/v1/', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.json({ "success": true, "message": `Haudal Authentication Service v${process.env.VERSION}` });
}));
exports.default = router;
