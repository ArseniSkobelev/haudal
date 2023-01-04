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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UserController {
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let helper = new helper_1.default();
                let user = new user_1.User(userData);
                if (userData.password_hash !== undefined) {
                    helper.hashPassword(userData.password_hash, (hash) => __awaiter(this, void 0, void 0, function* () {
                        user.password_hash = hash;
                        yield user.save();
                    }));
                }
                if (process.env.SECRET_KEY) {
                    let SECRET_KEY = process.env.SECRET_KEY;
                    let token = jsonwebtoken_1.default.sign({ _id: user._id, email: userData.email }, SECRET_KEY, {
                        expiresIn: '1d'
                    });
                    return {
                        "user": user,
                        "jwt": {
                            "token": token
                        }
                    };
                }
                else {
                    yield helper.configurationMissing();
                    return {};
                }
            }
            catch (err) {
                console.log(err);
                return { success: false, message: err };
            }
        });
    }
}
exports.default = UserController;
