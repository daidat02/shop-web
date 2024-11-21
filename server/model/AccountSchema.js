// Đảm bảo rằng bạn chỉ định nghĩa Account như sau trong AccountSchema.js
import mongoose from 'mongoose';
import { DB_SCHEMA } from '../configs/Constants.js';

const AccountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: DB_SCHEMA.USER,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        minlength: 6,
    },
    isAcount:{
        type: Boolean,
        required:true,
        default:true
    },
    resetPasswordToken :{
        type: String,
    },
    resetPasswordExpires:{
        type: Date
    }

});

const Account = mongoose.model(DB_SCHEMA.ACCOUNT, AccountSchema);
export default Account; // Sử dụng export default
