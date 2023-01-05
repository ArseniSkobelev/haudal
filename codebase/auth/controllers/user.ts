import { User, IUser } from '../models/user';
import Helper, { IResponse } from '../utils/helper';
import jwt, { Secret } from 'jsonwebtoken';

export default class UserController {
    public createUser(userData: IUser, callback: any): any {
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
                        });

                        let tempNewUser = JSON.parse(JSON.stringify(user));
                        let { password_hash, ...newUser } = tempNewUser;

                        return callback({
                            success: true,
                            data: {
                                token: token,
                                user: newUser,
                            }
                        })
                    } else {
                        helper.configurationMissing();
                        return callback({
                            success: false, data: {
                                message: "Configuration missing"
                            }
                        });
                    }
                } catch (err) {
                    console.log(err);
                    return callback({ success: false, data: { message: "Error" } });
                }
            }
        }
    }

    public getUserById(userId: string, callback: any): (IResponse) {
        if (userId) {
            const foundUser = User.findById(userId).exec((err: any, doc: any) => {
                if (err) throw err;
                let user = doc.toJSON();

                if (user) {
                    return callback({ success: true, data: { user: user } })
                } else {
                    return callback({
                        success: false, data: {
                            message: "No user has been found with the provided id"
                        }
                    });
                }
            });

            return callback({ success: false, data: { message: "Internal Server Error" } })
        } else {
            return callback({
                success: false, data: {
                    message: "No user id has been provided"
                }
            })
        }
    }

    public deleteUser(userId: string, callback: any): (IResponse) {
        if (userId) {
            User.deleteOne({ _id: userId }).exec((err: any, res: any) => {
                if (err) throw err;
                return callback({ success: true, data: { res } });
            })
        } else {
            return callback({
                success: false, data: {
                    message: "No user id has been provided"
                }
            })
        }
        return callback({ success: false, data: { message: "Internal Server Error" } });
    }

    public updateUser(userId: string, newUser: IUser, callback: any): (IResponse) {
        User.updateOne({ _id: userId }, newUser, (err: any, doc: any) => {
            if (err) throw err;
            if (doc) {
                return callback({
                    success: true, data: {
                        doc
                    }
                })
            }
        });
        return callback({
            success: false, data: {
                message: "Internal Server Error"
            }
        })
    }
}