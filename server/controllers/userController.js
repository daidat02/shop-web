import { STATUS,generateID } from '../configs/Constants.js'; 
import DB_Connection from '../model/DBConnection.js'; 
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;
const addShippingAddress = async (req, res) => {
    const { recipient_name, province, district, ward, street, type } = req.body;
    const userId = req.user.id;
    try {

        // Tạo địa chỉ mới
        const newAddress = new DB_Connection.Address({
            user: userId,
            recipient_name,
            province,
            district,
            ward,
            street,
            type
        });

        // Lưu vào cơ sở dữ liệu
        await newAddress.save();

        res.status(STATUS.CREATED).json({
            success:true,
            message: 'Địa chỉ giao hàng đã được thêm thành công.',
            data: newAddress
        });
    } catch (error) {
        res.status(STATUS.SERVER_ERROR).json({
            message: 'Lỗi khi thêm địa chỉ giao hàng.',
            error: error.message
        });
    }
};


const getShippingAddress = async (req, res) => {
    const userId = req.user.id;
    try {
        const address = await DB_Connection.Address.find({
            user: userId,
        });
        res.status(STATUS.CREATED).json({
            success:true,
            data: address
        });
    } catch (error) {
        res.status(STATUS.SERVER_ERROR).json({
            error: error.message
        });
    }
};

const getCustomers = async(req,res)=>{
    try {
        const customers = (await DB_Connection.User.find({role:'customer'}));
        res.status(STATUS.OK).json({
            success:true,
            data:customers,
            message:'Lấy danh sách khách hàng thành công'
        })
    } catch (error) {
        res.status(STATUS.SERVER_ERROR).json({
            error: error.message
        });
    }
}
export {
    addShippingAddress,getShippingAddress,
    getCustomers
}
