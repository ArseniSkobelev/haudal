"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    user_name: {
        type: String,
        unique: true
    },
    first_name: {
        type: String,
        required: false
    },
    last_name: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password_hash: {
        type: String,
        required: true,
        unique: false
    },
    phone_number: {
        type: Number,
        required: false,
        unique: true
    },
    is_email_confirmed: {
        type: Boolean,
        default: false,
        unique: false
    }
});
const User = (0, mongoose_1.model)('User', userSchema);
exports.User = User;
userSchema.statics.build = (user) => {
    return new User(user);
};
