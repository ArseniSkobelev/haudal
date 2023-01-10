// ---------------------------- Haudal App Controller ---------------------------
//
//     Developed by:         Arseni Skobelev
//     Development started:  10.01.2023
// 
//     Tags:
//         User authentication,
//         Security
//
// ------------------------------------------------------------------------------


//
// --------------------- Default configuration and imports ----------------------
//
import { User, IUser } from '../models/user';
import Helper from '../utils/helper';
import jwt, { Secret } from 'jsonwebtoken';
import { App, IAppData } from '../models/app'
import UserController from './user';
import { Application } from 'express';


export default class AppController {
    public async createApp(appData: IAppData, callback: any): Promise<any> {
        if (appData != undefined) {
            let app = new App(appData);

            let userController = new UserController();

            await userController.getUserById(app.admin, (data: any) => {
                console.log(data);
                if (data.data.user.hasOwnProperty('_id')) {
                    if (data.data.user.account_type === 'admin') {
                        app.save(async (err: any, res: any) => {
                            console.log(err, res);
                            if (err && err.code !== 11000) {
                                return callback({ status: 500, data: { message: "Internal Server Error" } })
                            }

                            if (err && err.code === 11000) {
                                return callback({ status: 500, data: { message: "Internal Server Error" } })
                            }

                            return callback({ status: 201, data: { app } })
                        });
                    } else {
                        return callback({ status: 500, data: { message: "The user specified is not an admin" } })
                    }
                } else {
                    return callback({ status: 500, data: { message: "No user found with the given admin id" } })
                }
            })
        } else {
            return callback({ status: 500, data: { message: "No application data provided" } })
        }
    }

    public async findAppById(appData: IAppData, callback: any): Promise<any> {
        if (appData != undefined) {
            App.findById(appData._id).exec((err: any, doc: any) => {
                if (err) {
                    throw err;
                } else {
                    let app = doc.toJSON();

                    if (app != undefined) {
                        return callback({ status: 200, data: { app } })
                    } else {
                        return callback({ status: 404, data: { message: "App not found with the given ID" } })
                    }
                }

            })
        }
    }

    public async findAppByUserId(appData: IAppData, callback: any): Promise<any> {
        if (appData != undefined) {
            let foundApps: any = [];
            App.find({ admin: appData._id }).exec((err: any, docs: any) => {
                if (err) {
                    throw err;
                } else {
                    docs.forEach((app: any) => {
                        foundApps.push(app.toJSON())
                    });

                    if (foundApps.length > 0) {
                        return callback({ status: 200, data: { foundApps } })
                    } else {
                        return callback({ status: 404, data: { message: "No apps found at the given user" } })
                    }
                }
            })
        }
    }

    public async deleteAppById(appData: IAppData, callback: any): Promise<any> {
        if (appData != undefined) {
            App.deleteOne({ _id: appData._id }).exec((err: any, res: any) => {
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
}