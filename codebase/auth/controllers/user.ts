import { User, IUser } from '../models/user';
import Helper, { IResponse } from '../utils/helper';
import jwt, { Secret } from 'jsonwebtoken';

export default class UserController {
    public async createUser(userData: IUser, callback: any): Promise<any> {
        if (userData) {
            if (Object.keys(userData).length != 0) {
                try {
                    let helper = new Helper();
                    let user = new User(userData);

                    if (userData.password_hash !== undefined) {
                        helper.hashPassword(userData.password_hash, async (hash: any) => {
                            user.password_hash = hash;
                            user.save();
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

    public createUserFromData(userData: object, callback: any): any {
        let user = new User(userData);
        // console.log(user);

        const helper = new Helper();

        helper.hashPassword(user.password_hash, (hash: any) => {
            user.password_hash = hash.data.hash;

            let SECRET_KEY: Secret = process.env.SECRET_KEY!;

            let token = jwt.sign({ _id: user._id, email: user.email }, SECRET_KEY, {
                expiresIn: '1d'
            });

            let tempNewUser = JSON.parse(JSON.stringify(user));
            let { password_hash, ...newUser } = tempNewUser;

            user.save(async (err: any) => {
                if (err && err.code !== 11000) {
                    return callback({ status: 500, data: { message: "Internal Server Error" } })
                }

                if (err && err.code === 11000) {
                    return callback({ status: 500, data: { message: "Internal Server Error" } })
                }

                return callback({ status: 201, data: { newUser, token: token } })
            });
        })
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