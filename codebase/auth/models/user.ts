import mongoose, { model, Schema } from 'mongoose';

interface UserLoginData {
    user_name?: string;
    email?: string;
    plain_password: string;
}

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

interface IUserDocument extends mongoose.Document {
    user_name?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    password_hash?: string;
    phone_number?: string;
    is_email_confirmed?: boolean;
    tenant?: string;
}

interface UserModelInterface extends mongoose.Model<IUserDocument> {
    build(attr: IUser): IUserDocument;
}

const userSchema = new Schema({
    user_name: {
        type: String,
        unique: false
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
        unique: false
    },
    is_email_confirmed: {
        type: Boolean,
        default: false,
        unique: false
    },
    account_type: {
        type: String,
        default: 'single',
        // 'single' - singular user account not connected to a tenant
        // 'joined' - a user account joined to a tenant
        // 'admin' - an admin / tenant admin account
        unique: false,
        required: false
    },
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant',
        required: false,
        default: null
    }
})

const User = model<any, UserModelInterface>('User', userSchema);

userSchema.statics.build = (user: IUser) => {
    return new User(user);
};

export { User, IUser, UserLoginData, IUserDocument }