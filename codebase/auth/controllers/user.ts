import { User, IUser } from '../models/user';
import Helper from '../utils/helper';
import jwt, { Secret } from 'jsonwebtoken';
import { IUserDocument } from '../models/user'

export interface IUserResponse {
    user: IUserDocument,
    jwt: {
        token: string,
    }
}

interface Default {
    success: boolean,
    message: string,
    jwt?: {
        token?: string
    }
}

export default class UserController {
    public createUser(userData: IUser): IUserResponse | Default {
        if (userData) {
            if (Object.keys(userData).length != 0) {
                try {
                    let helper = new Helper();
                    let user = new User(userData);

                    if (userData.password_hash !== undefined) {
                        helper.hashPassword(userData.password_hash, async (hash: any) => {
                            user.password_hash = hash;
                            await user.save();
                        })
                    }

                    if (process.env.SECRET_KEY) {
                        let SECRET_KEY: Secret = process.env.SECRET_KEY;

                        let token = jwt.sign({ _id: user._id, email: userData.email }, SECRET_KEY, {
                            expiresIn: '1d'
                        })

                        return {
                            "user": user,
                            "jwt": {
                                "token": token
                            }
                        };
                    } else {
                        helper.configurationMissing();
                        return { success: false, message: "Configuration missing" };
                    }
                } catch (err) {
                    console.log(err);
                    return { success: false, message: "Error" };
                }
            } else {
                return { success: false, message: "Error" };
            }
        } else {
            return { success: false, message: "Error" };
        }
    }
}