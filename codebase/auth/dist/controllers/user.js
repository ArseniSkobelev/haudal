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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
        return __awaiter(this, void 0, void 0, function* () {
            if (userData) {
                if (Object.keys(userData).length != 0) {
                    try {
                        let helper = new helper_1.default();
                        let user = new user_1.User(userData);
                        if (userData.password_hash !== undefined) {
                            helper.hashPassword(userData.password_hash, (hash) => __awaiter(this, void 0, void 0, function* () {
                                user.password_hash = hash;
                                user.save();
                            }));
                        }
                        if (process.env.SECRET_KEY) {
                            let SECRET_KEY = process.env.SECRET_KEY;
                            let token = jsonwebtoken_1.default.sign({ _id: user._id, email: userData.email }, SECRET_KEY, {
                                expiresIn: '1d'
                            });
                            let tempNewUser = JSON.parse(JSON.stringify(user));
                            let { password_hash } = tempNewUser, newUser = __rest(tempNewUser, ["password_hash"]);
                            return callback({
                                success: true,
                                data: {
                                    token: token,
                                    user: newUser,
                                }
                            });
                        }
                        else {
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
        });
    }
    createUserFromData(userData, callback) {
        let user = new user_1.User(userData);
        // console.log(user);
        const helper = new helper_1.default();
        helper.hashPassword(user.password_hash, (hash) => {
            user.password_hash = hash.data.hash;
            let SECRET_KEY = process.env.SECRET_KEY;
            let token = jsonwebtoken_1.default.sign({ _id: user._id, email: user.email }, SECRET_KEY, {
                expiresIn: '1d'
            });
            let tempNewUser = JSON.parse(JSON.stringify(user));
            let { password_hash } = tempNewUser, newUser = __rest(tempNewUser, ["password_hash"]);
            user.save((err) => __awaiter(this, void 0, void 0, function* () {
                if (err && err.code !== 11000) {
                    return callback({ status: 500, data: { message: "Internal Server Error" } });
                }
                if (err && err.code === 11000) {
                    return callback({ status: 500, data: { message: "Internal Server Error" } });
                }
                return callback({ status: 201, data: { newUser, token: token } });
            }));
        });
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
    deleteUser(userId, callback) {
        if (userId) {
            user_1.User.deleteOne({ _id: userId }).exec((err, res) => {
                if (err)
                    throw err;
                return callback({ success: true, data: { res } });
            });
        }
        else {
            return callback({
                success: false, data: {
                    message: "No user id has been provided"
                }
            });
        }
        return callback({ success: false, data: { message: "Internal Server Error" } });
    }
    updateUser(userId, newUser, callback) {
        user_1.User.updateOne({ _id: userId }, newUser, (err, doc) => {
            if (err)
                throw err;
            if (doc) {
                return callback({
                    success: true, data: {
                        doc
                    }
                });
            }
        });
        return callback({
            success: false, data: {
                message: "Internal Server Error"
            }
        });
    }
}
exports.default = UserController;
