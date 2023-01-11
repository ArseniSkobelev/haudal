import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt, { Secret } from 'jsonwebtoken';
import { ObjectId } from 'mongoose';
import { App } from '../models/app';
import { Member } from '../models/member';
import { User } from '../models/user';

dotenv.config();

export default class Helper {
    public async hashPassword(password: string, callback: any): Promise<any> {
        if (process.env.SALT_ROUNDS != undefined) {
            bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS), (err, hash) => {
                return callback({ success: true, data: { hash } });
            })
        }
    }

    public async isPasswordCorrect(password_hash: string, plain_password: string, callback: any): Promise<any> {
        await bcrypt.compare(plain_password, password_hash, async (err, result): Promise<boolean> => {
            if (err) return callback(err);
            return callback(result);
        });
    }

    public async createToken(data: any, callback: any): Promise<any> {
        let SECRET_KEY: Secret = process.env.SECRET_KEY!;

        let token = jwt.sign({ _id: data._id, email: data.email }, SECRET_KEY, {
            expiresIn: '1d'
        });

        return callback(token);
    }

    public async getAppData(appId: string, callback: any): Promise<any> {
        App.findById(appId).exec((err, doc) => {
            if (err) return callback(err);
            if (doc) {
                return callback(doc);
            }
        })
    }

    public async getUserDataById(userId: string, callback: any): Promise<any> {
        User.findById(userId).exec((err, doc) => {
            if (err) return callback(err);
            if (doc) {
                return callback(doc);
            }
        });
    }

    public async getUserDataByEmail(email: string, callback: any): Promise<any> {
        User.findOne({ email: email }, (err: any, doc: any) => {
            if (err) return callback(err);
            if (doc) {
                return callback(doc);
            }
        });
    }

    public async getAppMembers(appId: string, callback: any): Promise<any> {
        let members: any = [];
        Member.find({ appId: appId }, (err: any, docs: any) => {
            docs.forEach((member: any) => {
                members.push(member);
            });
            return callback(members);
        })
    }

    // TODO REMOVE THIS BEFORE PRODUCTION. DEV FUNCTIONALITY ONLY.
    public async clearCollections(callback: any): Promise<any> {
        User.deleteMany({}, (err: any, res: any) => {
            callback(err, res);
        })
    }
}