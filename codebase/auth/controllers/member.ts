import mongoose from "mongoose";
import { IMemberData, Member } from "../models/member";
import Helper from "../utils/helper";

export default class MemberController {
    public addMember(memberData: any, callback: any) {
        const helper = new Helper();
        helper.getAppData(memberData.app, (appData: any) => {
            console.log(appData);
            switch (memberData.user.account_type) {
                case "universal":
                    if (appData.isUniversalSigninProtocolEnabled) {
                        let newMember = new Member({ user: memberData.user._id, app: appData._id });
                        newMember.save((err: any, doc: any) => {
                            if (err) throw err;
                            console.log(err);
                            return callback({ status: 200, data: { doc } })
                        });
                    } else {
                        console.log("user universal, but app is not");
                    }
                    break;
                case "joined":
                    Member.findOne({ user: memberData.user._id }, (err: any, docs: any) => {
                        if (docs) {
                            if (docs.includes(memberData.user._id)) {
                                return callback({ status: 401, data: { message: "This joined user is already a member of another app. Contact your system administrator." } });
                            } else {
                                let newMember = new Member({ user: memberData.user._id, app: memberData.app });
                                newMember.save((err: any, doc: any) => {
                                    if (err) throw err;
                                    return callback({ status: 201, data: { doc } })
                                });
                            }
                        } else {
                            let newMember = new Member({ user: memberData.user._id, app: memberData.app });
                            newMember.save((err: any, doc: any) => {
                                if (err) throw err;
                                return callback({ status: 201, data: { doc } })
                            });
                        }
                    })
                    break;
                default:
                    return callback({ status: 201, data: { message: "User created successfully." } })
                    break;
            }
        })
    }
}