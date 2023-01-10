// ------------------------------- Haudal App Model -----------------------------
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
import mongoose, { model, Schema } from 'mongoose';


interface IAppData {
    _id?: string,
    name?: string;
    admin?: mongoose.Schema.Types.ObjectId;
}


//
// ------------------------- Main app schema definition -------------------------
//
const appSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    admin: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }],
    url: {
        type: String,
        unique: true,
        required: false,
        sparse: true
    },
    description: {
        type: String,
        unique: false,
        required: false
    },
    logo: {
        type: String,
        unique: false,
        required: false,
        default: null,
        sparse: true
    },
    isUniversalLoginEnabled: {
        type: Boolean,
        unique: false,
        required: false,
        deafult: true,
        sparse: true
    }
});


//
// ----------------- Default exports and further configuration ------------------
//
const App = model<any>('App', appSchema);

export { App, IAppData }

