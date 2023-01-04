"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const tenantSchema = new mongoose_2.Schema({
    users: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'User',
        }],
    admin: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User'
    }
});
