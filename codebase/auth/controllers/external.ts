import TokenController from "./token";

export interface IExternalAuthentication {
    token: string;
    redirectUrl: string;
}

export default class ExternalController {
    public externalAuthentication(authenticationData: IExternalAuthentication, callback: any) {
        if (authenticationData.redirectUrl && authenticationData.token) {
            const controller = new TokenController();
            controller.verifyAppToken(authenticationData.token, (data: any) => {
                if (data.data.valid) {
                    return callback({ status: 200, data: { valid: true } })
                } else {
                    return callback({ status: 401, data: { valid: false, message: "The redirect URL or the token is missing and or are invalid" } })
                }
            })
        } else {
            return callback({ status: 401, data: { valid: false, message: "The redirect URL or the token is missing and or are invalid" } })
        }
    }
}