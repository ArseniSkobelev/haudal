import mongoose from 'mongoose';
import mogoose, { model, Schema } from 'mongoose';

const tenantSchema = new Schema({
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})