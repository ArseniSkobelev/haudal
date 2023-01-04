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
dotenv_1.default.config();
class Helper {
    hashPassword(password, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (process.env.SALT_ROUNDS != undefined) {
                bcrypt_1.default.hash(password, parseInt(process.env.SALT_ROUNDS), (err, hash) => {
                    return callback(hash);
                });
            }
            else {
                return this.configurationMissing();
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
    configurationMissing() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("👾 [Haudal | Auth] Some required configuration is missing. Please check the template file for more information.");
            return process.exit(1);
        });
    }
}
exports.default = Helper;
