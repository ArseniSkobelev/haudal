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
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../models/user");
dotenv_1.default.config();
class Helper {
    hashPassword(password, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (process.env.SALT_ROUNDS != undefined) {
                bcrypt_1.default.hash(password, parseInt(process.env.SALT_ROUNDS), (err, hash) => {
                    return callback({ success: true, data: { hash } });
                });
            }
        });
    }
    isPasswordCorrect(password_hash, plain_password, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            yield bcrypt_1.default.compare(plain_password, password_hash, (err, result) => __awaiter(this, void 0, void 0, function* () {
                if (err)
                    return callback(err);
                return callback(result);
            }));
        });
    }
    createToken(data, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            let SECRET_KEY = process.env.SECRET_KEY;
            let token = jsonwebtoken_1.default.sign({ _id: data._id, email: data.email }, SECRET_KEY, {
                expiresIn: '1d'
            });
            return callback(token);
        });
    }
    // TODO REMOVE THIS BEFORE ANY PRODUCTION. TEST FUNCTIONALITY ONLY.
    clearCollections(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            user_1.User.deleteMany({}, (err, res) => {
                callback(err, res);
            });
        });
    }
}
exports.default = Helper;
