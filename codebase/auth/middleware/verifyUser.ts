import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();


export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    const SECRET_KEY: Secret = process.env.SECRET_KEY!;
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const userId = req.params.userId;

    const decoded = jwt.verify(token!, SECRET_KEY, (err: any, decodedData: any) => {
        if (decodedData._id === userId) {
            next();
        } else {
            return res.status(500).json({ data: { message: "Internal Server Error" } });
        }
    });
}