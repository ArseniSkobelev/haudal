import Helper from '../utils/helper';

export interface ILoginData {
    email?: string;
    plain_password?: string;
    appId?: string;
}

export default class AuthController {
    public async loginHandler(data: ILoginData, callback: any): Promise<any> {
        if (data.hasOwnProperty('token')) {
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
            helper.getAppData(loginData.appId!.toString(), (appData: any) => {
                helper.getUserDataByEmail(loginData.email!, (userData: any) => {
                    switch (userData.account_type) {
                        case "joined":
                            helper.getAppMembers(appData._id, (data: any) => {
                                if (data.includes(userData._id)) {
                                    helper.createToken(userData, (token: string) => {
                                        return callback({ status: 200, data: { message: `Welcome back to ${appData.name}, ${userData.first_name || userData.email}!`, token: token } })
                                    })
                                } else {
                                    return callback({ status: 403, data: { message: "Your account is joined to another application. Please contact your application administrator or create a new account specific to the requested application." } })
                                }
                            })
                            break;
                        case "universal":
                            if (appData.isUniversalSigninProtocolEnabled) {
                                helper.isPasswordCorrect(userData.password_hash, loginData.plain_password!, (data: any) => {
                                    if (data) {
                                        helper.createToken(userData, (token: string) => {
                                            return callback({ status: 200, data: { message: `Welcome back to ${appData.name}, ${userData.first_name || userData.email}!`, token: token } })
                                        })
                                    } else {
                                        return callback({ status: 401, data: { message: "Incorrect username, email or password supplied." } })
                                    }
                                })
                            } else {
                                return callback({ status: 403, data: { message: "The requested application does not support the Universal Signin Protocol. Therefore your account must be joined to the requested application. Please create a new account specific to the application in question." } })
                            }
                            break;
                        default:
                            return callback({ status: 403, data: { message: "This account is an administrator account and is therefore denied access to apps outside off the dashboard." } })
                    }
                })
            })
        } else {
            return callback({ status: 401, data: {} });
        }
    }

    public async dashboardLogin(loginData: ILoginData, callback: any): Promise<any> {
        const helper = new Helper();
        console.log(loginData.email);
        if (loginData.email && loginData.plain_password) {
            helper.getUserDataByEmail(loginData.email, (userData: any) => {
                console.log(userData);
                if (userData.account_type === 'admin') {
                    helper.isPasswordCorrect(userData.password_hash, loginData.plain_password!, (data: any) => {
                        console.log(data);
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
}