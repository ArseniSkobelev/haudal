// -------------------------- Haudal Token Controller ---------------------------
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
import { Token, ITokenData } from '../models/token'
import UserController from './user';
import { v4 as uuidv4 } from 'uuid';
import { IAppData } from '../models/app';


export default class TokenController {
    public async createToken(tokenData: ITokenData, callback: any): Promise<any> {
        if (tokenData != undefined) {
            let token = new Token(tokenData);

            token.token = uuidv4();

            await token.save((err: any, res: any) => {
                if (err) throw err;
                return callback({ status: 200, data: res })
            })
        } else {
            return callback({ status: 500, data: { message: "No application data provided" } })
        }
    }

    public async findTokensByAppId(appId: string, callback: any): Promise<any> {
        if (appId) {
            let foundTokens: any = [];
            Token.find({ appId: appId }).exec((err: any, docs: any) => {
                if (err) {
                    throw err;
                } else {
                    docs.forEach((app: any) => {
                        foundTokens.push(app.toJSON())
                    });

                    if (foundTokens.length > 0) {
                        return callback({ status: 200, data: { foundTokens: foundTokens } })
                    } else {
                        return callback({ status: 404, data: { message: "No tokens found for this app" } })
                    }
                }
            })
        }
    }

    public async deleteTokenById(tokenId: string, callback: any): Promise<any> {
        if (tokenId) {
            Token.deleteOne({ _id: tokenId }).exec((err: any, res: any) => {
                if (err) throw err;
                return callback({ status: 204, data: { res } });
            })
        } else {
            return callback({
                status: 404, data: {
                    message: "No token id has been provided"
                }
            })
        }
    }
}