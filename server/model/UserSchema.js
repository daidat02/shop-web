// model/UserSchema.js
import mongoose, { Schema } from 'mongoose';
import { DB_SCHEMA } from '../configs/Constants.js';
const ObjectId = mongoose.Types.ObjectId
const UserSchema = new Schema({
    user_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: {
            values: ['staff', 'admin', 'customer'],
            message: 'Role {VALUE} is not supported',
        },
        default: 'customer',
        required: true,
    },
    id: {
        type: String,
        required: true,
        unique: true,
    },
    phonenumber: {
        type: String,
        required: false,
        default: "chưa có số điện thoại"
    },
    address:{
        type:ObjectId,
        ref:DB_SCHEMA.ADDRESS,
        required:false,
    },
    order_quantity:{
        type:Number,
        required:false,
        default: 0
    },
    total_spent:{
        type:Number,
        required:false,
        default: 0
    },
    last_order:{
        type: Date,
        required:false
    },
    isAccount:{
        type: Boolean,
        required:true,
        default:true
    }
});

// Xuất mô hình User
const User = mongoose.model(DB_SCHEMA.USER, UserSchema);
export default User;
