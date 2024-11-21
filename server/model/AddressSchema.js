import mongoose, { Schema } from 'mongoose';
import { DB_SCHEMA } from '../configs/Constants.js';
import User from './UserSchema.js';
const ObjectId = mongoose.Types.ObjectId;

const addressSchema = new Schema({
    user: {
        type: ObjectId,
        ref: DB_SCHEMA.USER,
        required: true
    },
    recipient_name:{
        type: String,
        required: true
    },
    province: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    ward: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: false // Có thể không bắt buộc
    },
    type:{
        type: String,
        required: false // Có thể không bắt buộc
    },
    isDefault:{
        type:Boolean,
        default:false
    }
});

const Address = mongoose.model(DB_SCHEMA.ADDRESS, addressSchema);

export default Address;
