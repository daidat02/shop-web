import mongoose from 'mongoose';
import { DB_SCHEMA } from '../configs/Constants.js';
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

const messageSchema = Schema({
    senderName: { type: String, required: true },
    receiverId: { type: ObjectId, ref: DB_SCHEMA.USER, required: true }, // ID người nhận
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    senderId: { type: String,ref: DB_SCHEMA.USER, required: true },
    role: {type:String , required:true}
});

const Message = mongoose.model(DB_SCHEMA.MESSAGE, messageSchema);

export default Message;
