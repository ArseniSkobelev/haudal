"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
console.log(process.env.PORT);
const port = (process.env.PORT != undefined) ? process.env.PORT : 3000;
app.get('/', (req, res) => {
    res.json({ "success": true, "message": "Haudal Authentication Service v1.0" });
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
