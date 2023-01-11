// ------------------------------ Haudal User Model -----------------------------
//
//     Developed by:         Arseni Skobelev
//     Development started:  11.01.2023
// 
//     Tags:
//         User authentication,
//         Security
//
// ------------------------------------------------------------------------------


//
// --------------------- Default configuration and imports ----------------------
//
import mongoose, { model, Schema } from 'mongoose';


//
// -------------------------------- Interfaces ----------------------------------
//
interface IMemberData {
    user?: string;
    app?: string;
}


//
// ----------------------------- Schema definition ------------------------------
//
const memberSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    app: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'App',
        required: true
    }
}, {
    timestamps: true,
})


//
// ----------------- Default exports and further configuration ------------------
//
const Member = model<any>('Member', memberSchema);

export { Member, IMemberData }

