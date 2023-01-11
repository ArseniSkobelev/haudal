import mongoose from "mongoose";
import { IMemberData, Member } from "../models/member";
import Helper from "../utils/helper";

export default class MemberController {
    public async addMember(memberData: IMemberData, callback: any) {
        if (memberData) {
            const helper = new Helper();
            helper.getAppData(memberData.app!, (appData: any) => {
                console.log(appData);
                let appId = new mongoose.Types.ObjectId(memberData.app)
                if (appData.isUniversalSigninProtocolEnabled) {
                    helper.getUserDataById(memberData.user!.toString(), (userData: any) => {
                        console.log(userData);
                        if (userData.account_type === 'admin') {
                            console.log("admin tried joining app")
                        } else {
                            let newMember = new Member(memberData);

                            newMember.save((err: any, doc: any) => {
                                if (err) throw err;
                                if (doc) {
                                    return callback({ status: 200, data: { doc } })
                                }
                            })
                        }
                    })
                } else {
                    return callback({ status: 401, data: { message: "user == universal, but app does not support" } })
                }
            })
        }
    }
}