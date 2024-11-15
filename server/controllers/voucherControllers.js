import { STATUS,generateID } from '../configs/Constants.js'; 
import DB_Connection from '../model/DBConnection.js'; 
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;
const addVoucher = async (req, res) => {
    const { code, discount, type, minOrderValue, validUntil } = req.body;

    try {
        // Kiểm tra mã voucher đã tồn tại chưa
        const existingVoucher = await DB_Connection.Voucher.findOne({ code });
        if (existingVoucher) {
            return res.status(STATUS.CONFLICT).json({
                success: false,
                message: 'Mã voucher đã tồn tại.',
            });
        }

        // Tạo voucher mới
        const newVoucher = new DB_Connection.Voucher({
            code,
            discount,
            type,
            minOrderValue,
            validUntil,
            isActive: true // Voucher mới sẽ được kích hoạt
        });

        // Lưu vào cơ sở dữ liệu
        await newVoucher.save();

        res.status(STATUS.CREATED).json({
            success: true,
            message: 'Voucher đã được thêm thành công.',
            data: newVoucher
        });
    } catch (error) {
        res.status(STATUS.SERVER_ERROR).json({
            success: false,
            message: 'Lỗi khi thêm voucher.',
            error: error.message
        });
    }
};

const getVoucher = async (req, res) => {
    try {
        // Lấy ngày hiện tại
        const currentDate = new Date();

        // Cập nhật trạng thái của các voucher đã hết hạn
        await DB_Connection.Voucher.updateMany(
            { validUntil: { $lt: currentDate }, isActive: true }, // Điều kiện voucher hết hạn và còn active
            { $set: { isActive: false } } // Cập nhật isActive thành false
        );

        // Lấy các voucher còn hạn sử dụng (isActive: true)
        const vouchers = await DB_Connection.Voucher.find();

        res.status(STATUS.CREATED).json({
            success: true,
            data: vouchers
        });
    } catch (error) {
        res.status(STATUS.SERVER_ERROR).json({
            success: false,
            error: error.message
        });
    }
};

export {
    addVoucher,getVoucher
}
