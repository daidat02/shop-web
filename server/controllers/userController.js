import { STATUS,generateID } from '../configs/Constants.js'; 
import DB_Connection from '../model/DBConnection.js'; 
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;
const addShippingAddress = async (req, res) => {
    const { recipient_name, province, district, ward, street, type,isDefault } = req.body;
    const userId = req.user.id;
    try {
        await  DB_Connection.Address.updateOne({isDefault:true},
            {isDefault:false}
        )
        // Tạo địa chỉ mới
        const newAddress = new DB_Connection.Address({
            user: userId,
            recipient_name,
            province,
            district,
            ward,
            street,
            type,
            isDefault
        });
        await DB_Connection.User.updateOne({_id:newAddress.user},
            {address:new ObjectId(newAddress._id)}
        )
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

const updateDefaultAdress = async(req,res)=>{
    const {addressId}= req.params
    try {
        await  DB_Connection.Address.updateOne({isDefault:true},
            {isDefault:false}
        )

        const address = await DB_Connection.Address.findOneAndUpdate({_id: new ObjectId(addressId)},{
            isDefault:true
        });

        await DB_Connection.User.updateOne({_id:address.user},
            {address:new ObjectId(address._id)}
        )
        res.status(STATUS.OK).json({
            success:true,
            message:'Cập nhật địa chỉ thành công',
            data:address
        })
    } catch (error) {
        res.status(STATUS.SERVER_ERROR).json({
            error: error.message
        });
    }
}


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
        const user = req.user
        if(user.role === 'customer'){
            const customers = await DB_Connection.User.find({role:'admin'});
            res.status(STATUS.OK).json({
                success:true,
                data:customers,
                message:'Lấy danh sách Admin thành công thành công'
            })
        }else{
            const customers = await DB_Connection.User.find({role:'customer'}).populate('address');
            res.status(STATUS.OK).json({
                success:true,
                data:customers,
                message:'Lấy danh sách khách hàng thành công'
            })
        }
    } catch (error) {
        res.status(STATUS.SERVER_ERROR).json({
            error: error.message
        });
    }
}


const getProfileUser = async(req,res)=>{
    try {
            const user = req.user 
            const infoUser = await DB_Connection.User.findOne({_id: user.id}).populate('address');
            res.status(STATUS.OK).json({
                success:true,
                message:'Lấy chi tiết thông tin người dùng thành công',
                data: infoUser
            })
    } catch (error) {
        res.status(STATUS.SERVER_ERROR).json({
            error: error.message
        });
    }
}

export {
    addShippingAddress,getShippingAddress,
    getCustomers,getProfileUser,updateDefaultAdress
}

