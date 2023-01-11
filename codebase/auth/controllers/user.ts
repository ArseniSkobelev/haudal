import { User, IUser } from '../models/user';
import Helper from '../utils/helper';
import jwt, { Secret } from 'jsonwebtoken';

export default class UserController {
    public createUser(userData: object, callback: any): any {
        let user = new User(userData);

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

    public getUserById(userId: string, callback: any): any {
        if (userId) {
            const foundUser = User.findById(userId).exec((err: any, doc: any) => {
                if (err) throw err;
                let user = doc.toJSON();

                if (!user) {
                    return callback({
                        status: 400, data: {
                            message: "No user has been found with the provided id"
                        }
                    });
                }

                let tempUser = JSON.parse(JSON.stringify(user));
                let { password_hash, ...foundUser } = tempUser;

                return callback({ status: 200, data: { user: foundUser } })
            });
        } else {
            return callback({
                status: 404, data: {
                    message: "No user id has been provided"
                }
            })
        }
    }

    public deleteUser(userId: string, callback: any): any {
        if (userId) {
            User.deleteOne({ _id: userId }).exec((err: any, res: any) => {
                if (err) throw err;
                return callback({ status: 204, data: { res } });
            })
        } else {
            return callback({
                status: 404, data: {
                    message: "No user id has been provided"
                }
            })
        }
    }

    public updateUser(userId: string, newUser: IUser, callback: any): any {
        User.updateOne({ _id: userId }, newUser, (err: any, doc: any) => {
            if (err) throw err;
            if (doc) {
                return callback({
                    status: 200, data: {
                        doc
                    }
                })
            } else {
                return callback({
                    status: 500, data: {
                        message: "Internal Server Error"
                    }
                })
            }
        });
    }
}