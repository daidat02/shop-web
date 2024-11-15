import mongoose, { Schema } from 'mongoose';
import { DB_SCHEMA } from '../configs/Constants.js';
const ObjectId = mongoose.Types.ObjectId;

const OrderSchema = new Schema({
    order_id:{
        type: String,
        required: true,
        unique: true
    },
    user: { type: ObjectId, ref: DB_SCHEMA.USER, required: true }, 
    items: [
        {
            product: { type: ObjectId, ref: DB_SCHEMA.PRODUCT, required: true }, // Sản phẩm đã đặt
            quantity: { type: Number, required: true }, // Số lượng sản phẩm
            priceTotal: { type: Number, required: false } // Tổng giá của sản phẩm đó
        }
    ],
    totalBill: { type: Number, required: false }, // Tổng số tiền của đơn hàng
    discountAmount: { type: Number, required: false }, // Số tiền dudocj giảm sau khi áp voucher
    finalAmount: { type: Number, required: false }, // Tổng số tiền của đơn hàng sau khi giảm giá
    shippingCost: { type: Number, required: false }, //Phí giao hàng
    status: { type: String, enum:{values:['pendding' , 'shipped', 'delivered','canceled','completed']}, default: 'pendding' }, // Trạng thái đơn hàng (pending, shipped, delivered)
    shippingAddress: { type: ObjectId, ref:DB_SCHEMA.ADDRESS, required: false }, // Địa chỉ giao hàng
    payment_method: { type: String, enum: { values: ['vnpay', 'cash_on_delivery','paypal']},default: 'cash_on_delivery'},
    payment_status: { type: String, enum: { values: ['pendding', 'paid','failed','canceled']},default: 'pendding'},
    payment_time:{ type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }, // Ngày tạo đơn hàng
}, { timestamps: true });

const Order = mongoose.model(DB_SCHEMA.ORDER, OrderSchema);

export default Order;
