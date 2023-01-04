import { User, IUser } from '../models/user';
import Helper from '../utils/helper';
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';

export default class UserController {
    public async createUser(userData: IUser): Promise<object> {
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
                await helper.configurationMissing();
                return {};
            }
        } catch (err) {
            console.log(err);
            return { success: false, message: err };
        }
    }
}