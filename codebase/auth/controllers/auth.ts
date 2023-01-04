import { UserLoginData, User } from "../models/user";
import Helper from '../utils/helper';

export default class AuthController {
    public async login(loginData: UserLoginData): Promise<any> {
        const helper = new Helper();

        User.findOne({ $or: [{ 'user_name': loginData.user_name }, { 'email': loginData.email }] }, async (err: any, result: any) => {
            if (!err) {
                await helper.isPasswordCorrect(result.password_hash, loginData.plain_password, async (result: any) => {
                    if (result) {
                        // login success

                    } else {
                        // login failure

                    }
                })
            }
        })
    }
}