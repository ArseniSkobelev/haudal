import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt, { Secret } from 'jsonwebtoken';

dotenv.config();

export default class Helper {
    public async hashPassword(password: string, callback: any): Promise<any> {
        if (process.env.SALT_ROUNDS != undefined) {
            bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS), (err, hash) => {
                return callback(hash);
            })
        } else {
            return this.configurationMissing();
        }
    }

    public async isPasswordCorrect(password_hash: string, plain_password: string, callback: any): Promise<any> {
        await bcrypt.compare(plain_password, password_hash, async (err, result): Promise<boolean> => {
            if (err) return callback(err);
            return callback(result);
        });
    }

    public async configurationMissing(): Promise<string> {
        console.log("👾 [Haudal | Auth] Some required configuration is missing. Please check the template file for more information.");
        return process.exit(1);
    }

    public async createToken(data: any, callback: any): Promise<any> {
        let SECRET_KEY: Secret = process.env.SECRET_KEY!;

        let token = jwt.sign({ _id: data._id, email: data.email }, SECRET_KEY, {
            expiresIn: '1d'
        });

        return callback(token);
    }
}