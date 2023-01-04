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
const user_1 = require("../models/user");
const helper_1 = __importDefault(require("../utils/helper"));
class AuthController {
    login(loginData, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const helper = new helper_1.default();
            user_1.User.findOne({ $or: [{ 'user_name': loginData.user_name }, { 'email': loginData.email }] }, (err, result) => {
                if (result != null) {
                    helper.isPasswordCorrect(result.password_hash, loginData.plain_password, (res) => {
                        if (res) {
                            helper.createToken(result, (token) => {
                                return callback({ success: true, data: token });
                            });
                        }
                        else {
                            return callback({ success: false, data: "ERROR" });
                        }
                    });
                }
                else {
                    return callback({ success: false, data: "ERROR" });
                }
            });
        });
    }
}
exports.default = AuthController;
