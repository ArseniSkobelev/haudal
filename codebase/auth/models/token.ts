// ---------------------------- Haudal API Token Model --------------------------
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
// ---------------------- Default configuration and imports ---------------------
//
import mongoose, { model, ObjectId, Schema } from 'mongoose';


interface ITokenData {
    token: string;
    appId: ObjectId;
}


//
// ------------------------- Main app schema definition -------------------------
//
const tokenSchema = new Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    appId: {
        type: mongoose.Schema.Types.ObjectId,
        unique: false,
        required: true,
        ref: 'App'
    }
});


//
// ----------------- Default exports and further configuration ------------------
//
const Token = model<any>('Token', tokenSchema);

export { Token, ITokenData }

