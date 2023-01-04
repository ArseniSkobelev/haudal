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
}

interface IUserDocument extends mongoose.Document {
    user_name: string;
    first_name: string;
    last_name: string;
    email: string;
    password_hash: string;
    phone_number: string;
    is_email_confirmed: boolean;
}

interface UserModelInterface extends mongoose.Model<IUserDocument> {
    build(attr: IUser): IUserDocument;
}

const userSchema = new Schema({
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
})

const User = model<any, UserModelInterface>('User', userSchema);

userSchema.statics.build = (user: IUser) => {
    return new User(user);
};

export { User, IUser, UserLoginData }