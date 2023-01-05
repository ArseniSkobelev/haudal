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
    createUser(userData, callback) {
        if (userData) {
            if (Object.keys(userData).length != 0) {
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
                        return callback({
                            success: true,
                            data: {
                                token: token
                            }
                        });
                    }
                    else {
                        helper.configurationMissing();
                        return callback({
                            success: false, data: {
                                message: "Configuration missing"
                            }
                        });
                    }
                }
                catch (err) {
                    console.log(err);
                    return callback({ success: false, data: { message: "Error" } });
                }
            }
        }
    }
    getUserById(userId, callback) {
        if (userId) {
            const foundUser = user_1.User.findById(userId).exec((err, doc) => {
                if (err)
                    throw err;
                let user = doc.toJSON();
                if (user) {
                    return callback({ success: true, data: { user: user } });
                }
                else {
                    return callback({
                        success: false, data: {
                            message: "No user has been found with the provided id"
                        }
                    });
                }
            });
            return callback({ success: false, data: { message: "Internal Server Error" } });
        }
        else {
            return callback({
                success: false, data: {
                    message: "No user id has been provided"
                }
            });
        }
    }
}
exports.default = UserController;
