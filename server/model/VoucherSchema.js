import mongoose, { Schema } from 'mongoose';
import { DB_SCHEMA } from '../configs/Constants.js';

const voucherSchema = new Schema({
  code: { type: String, required: true, unique: true },  // Mã voucher
  discount: { type: Number, required: true },  // Giá trị giảm giá
  type: { type: String, enum: ['fixed', 'percentage'], required: true },  // Loại giảm giá: cố định hoặc phần trăm
  minOrderValue: { type: Number, default: 0 },  // Giá trị đơn hàng tối thiểu để áp dụng voucher
  validUntil: { type: Date, required: true },  // Ngày hết hạn của voucher
  isActive: { type: Boolean, default: true } , // Trạng thái hoạt động của voucher
});

const Voucher = mongoose.model(DB_SCHEMA.VOUCHER, voucherSchema);

export default Voucher;