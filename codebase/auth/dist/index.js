"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const routes_1 = __importDefault(require("./routes"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
app.use((0, morgan_1.default)('tiny'));
app.use(express_1.default.json());
app.use(routes_1.default);
mongoose_1.default.connect(process.env.MONGODB_URI || "localhost", {
    authSource: "admin",
    user: process.env.MONGODB_USER,
    pass: process.env.MONGODB_PASS,
    connectTimeoutMS: 150000,
    socketTimeoutMS: 90000,
    maxIdleTimeMS: 60000
}, (err) => {
    if (err)
        return console.error(err);
    else {
        console.log("👾 [Haudal | Auth] Connection to MongoDB established successfully");
    }
});
const port = (process.env.PORT != undefined) ? process.env.PORT : 3000;
app.listen(port, () => {
    console.log(`👾 [Haudal | Auth] Authentication server is running at port ${port}`);
});
