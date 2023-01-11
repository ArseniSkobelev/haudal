import { ObjectId } from "mongoose";
import { User } from "../models/user";
import Helper from '../utils/helper';

export interface ILoginData {
    email?: string;
    plain_password?: string;
    appId?: ObjectId;
}

export default class AuthController {
    public async loginHandler(data: ILoginData, callback: any): Promise<any> {
        if (data.appId) {
            await this.appLogin(data, (data: any) => {
                return callback(data);
            });
        } else {
            await this.dashboardLogin(data, (data: any) => {
                return callback(data);
            });
        }
    }

    public async appLogin(loginData: ILoginData, callback: any): Promise<any> {
        const helper = new Helper();
        if (loginData.email && loginData.plain_password) {
            helper.getAppData(loginData.appId!, (appData: any) => {

            })
            helper.getUserDataByEmail(loginData.email, (userData: any) => {
                switch (userData.account_type) {
                    case "joined":
                        break;
                    case "universal":
                        break;
                    default:
                        return callback({ status: 403, data: { message: "This account is an administrator account and is therefore denied access to apps outside off the dashboard." } })
                }
            })
        } else {
            return callback({ status: 401, data: {} });
        }
    }

    public async dashboardLogin(loginData: ILoginData, callback: any): Promise<any> {
        const helper = new Helper();
        if (loginData.email && loginData.plain_password) {
            helper.getUserDataByEmail(loginData.email, (userData: any) => {
                if (userData.account_type === 'admin') {
                    helper.isPasswordCorrect(userData.password_hash, loginData.plain_password!, (data: any) => {
                        if (data) {
                            helper.createToken(userData, (token: string) => {
                                return callback({ status: 200, data: { message: `Welcome back, ${userData.first_name || userData.email}!`, token: token } })
                            })
                        } else {
                            return callback({ status: 401, data: { message: "Incorrect username, email or password supplied." } })
                        }
                    })
                } else {
                    return callback({ status: 403, data: { message: "This account is not an administrator and therefore is denied access to the dashboard." } })
                }
            });
        } else {
            return callback({ status: 401, data: {} });
        }
    }

    // public async login(loginData: any, callback: any): Promise<any> {
    //     const helper = new Helper();

    //     User.findOne({ 'email': loginData.email }, (err: any, result: any) => {
    //         if (result != null) {
    //             helper.isPasswordCorrect(result.password_hash, loginData.plain_password, (res: any) => {
    //                 if (res) {
    //                     helper.createToken(result, (token: string) => {
    //                         return callback({ success: true, data: token })
    //                     })
    //                 } else {
    //                     return callback({ success: false, data: "ERROR" })
    //                 }
    //             })
    //         } else {
    //             return callback({ success: false, data: "ERROR" })
    //         }
    //     })
    // }
}