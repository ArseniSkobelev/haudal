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