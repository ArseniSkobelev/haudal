import { User, IUser } from '../models/user';
import Helper from '../utils/helper';

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

            return user;
        } catch (err) {
            console.log(err);
            return { success: false, message: err };
        }
    }
}