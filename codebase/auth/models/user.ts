// ------------------------------ Haudal User Model -----------------------------
//
//     Developed by:         Arseni Skobelev
//     Development started:  02.01.2023
// 
//     Tags:
//         User authentication,
//         Security
//
// ------------------------------------------------------------------------------


//
// --------------------- Default configuration and imports ----------------------
//
import mongoose, { model, Schema } from 'mongoose';


//
// ----------------------- Interfaces that define a user ------------------------
//
interface IUser {
    user_name?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    password_hash?: string;
    phone_number?: string;
    is_email_confirmed?: boolean;
    tenant?: string;
}


//
// ------------------------ Main user schema definition -------------------------
//
const userSchema = new Schema({
    user_name: {
        type: String,
        unique: true,
        sparse: true
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
        unique: true,
        sparse: true
    },
    is_email_confirmed: {
        type: Boolean,
        default: false,
        unique: false
    },
    account_type: {
        type: String,
        enum: ['single', 'joined', 'admin'],
        default: 'single',
        // 'single' - singular user account not connected to a tenant
        // 'joined' - a user account joined to a tenant
        // 'admin' - an admin / tenant admin account
        // p.s This is yet to be implemented.
        unique: false,
        required: false
    },
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant',
        required: false,
        default: null
    },
    logo: {
        type: String,
        unique: false,
        required: false,
        default: null,
        sparse: true
    }
}, {
    timestamps: true,
})


//
// ----------------- Default exports and further configuration ------------------
//
const User = model<any>('User', userSchema);

export { User, IUser }

