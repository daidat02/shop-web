import { STATUS,generateID } from '../configs/Constants.js'; 
import DB_Connection from '../model/DBConnection.js'; 
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;


const calculateVoucherDiscount = async (voucherCode, totalBill) => {
    let discountAmount = 0;

    if (voucherCode) {
        // Kiểm tra voucher trong database
        const voucher = await DB_Connection.Voucher.findOne({ code: voucherCode, isActive: true });

        if (voucher) {
            // Kiểm tra nếu voucher còn hạn
            const currentDate = new Date();
            if (currentDate > new Date(voucher.validUntil)) {
                throw new Error('Voucher đã hết hạn');
            }

            // Kiểm tra điều kiện áp dụng voucher (ví dụ: giá trị đơn hàng tối thiểu)
            if (totalBill < voucher.minOrderValue) {
                throw new Error(`Đơn hàng cần có giá trị tối thiểu là ${voucher.minOrderValue} VND để sử dụng voucher này`);
            }

            // Tính giảm giá
            if (voucher.type === 'percentage') {
                discountAmount = (totalBill * voucher.discount) / 100;
            } else if (voucher.type === 'fixed') {
                discountAmount = voucher.discount;
            }
        } else {
            throw new Error('Voucher không hợp lệ');
        }
    }

    return discountAmount;
};

const createOrder = async (req, res) => {
    const { selectedItems, shippingAddress, voucherCode, payment_method } = req.body; // Nhận voucherCode từ frontend
    const orderId = generateID(6);
    try {
        const user = req.user;
        let totalBill = 0; // Khởi tạo tổng tiền

        // Tìm giỏ hàng của người dùng
        const cart = await DB_Connection.ShoppingCart.findOne({ user: new ObjectId(user.id) }).populate('items.product');
        
        if (!cart) {
            return res.status(STATUS.FORBIDDEN).json({ message: 'Giỏ hàng không tồn tại' });
        }

        const orderItems = [];

        // Duyệt qua các sản phẩm đã chọn
        for (const selectedItem of selectedItems) {
            const item = cart.items.find(cartItem => cartItem.product._id.toString() === selectedItem.product);
            if (item) {
                // Thêm sản phẩm vào danh sách đơn hàng
                orderItems.push({
                    product: item.product._id, // Lấy ID sản phẩm
                    quantity: item.quantity,   // Lấy số lượng từ giỏ hàng
                    priceTotal: item.priceTotal // Tính tổng giá của sản phẩm trong giỏ hàng
                });
                // Tính tổng tiền cho đơn hàng
                totalBill += item.priceTotal;
            }
        }

        if(orderItems.length < 1 ){
            return res.status(STATUS.NOT_FOUND).json({message:'Vui lòng chọn sản phẩm'})
        }
        // Tính toán giảm giá voucher (nếu có)
        let discountAmount = 0;
        try {
            discountAmount = await calculateVoucherDiscount(voucherCode, totalBill);
        } catch (error) {
            return res.status(STATUS.NOT_FOUND).json({ message: error.message });
        }
        const shippingCost = 30;
        // Tính tổng tiền sau khi áp dụng voucher (nếu có)
        const finalAmount =  shippingCost + totalBill - discountAmount;

        // Tạo đơn hàng
        const newOrder = new DB_Connection.Order({
            order_id: orderId,
            user: new ObjectId(user.id),
            items: orderItems, // Mảng sản phẩm đã chọn
            totalBill: totalBill,
            shippingCost:shippingCost,
            discountAmount: discountAmount, // Giá trị giảm giá
            finalAmount: finalAmount, // Tổng tiền sau giảm giá
            shippingAddress: shippingAddress,
            payment_method:payment_method,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await newOrder.save();
        // Cập nhật order_quantity và total spent cho user
        const profileUser = await DB_Connection.User.findById(user.id)
        const oderQuantity = profileUser.order_quantity|| 0
        const totalSpent = profileUser.total_spent|| 0
        const updateData = {
            order_quantity: oderQuantity +1,
            total_spent: totalSpent+ finalAmount,
            last_order: new Date()
        }

        await DB_Connection.User.updateOne(
            {_id: new ObjectId(profileUser._id)},
            { $set:updateData}
        )
        // Xóa các sản phẩm đã đặt khỏi giỏ hàng
        await DB_Connection.ShoppingCart.updateOne(
            { user: new ObjectId(user.id) },
            { 
                $pull: { 
                    items: { 
                        product: { $in: selectedItems.map(item => new ObjectId(item.product)) }
                    } 
                }
            }
        );

        res.status(STATUS.CREATED).json({
            success:true,
            message: 'Đơn hàng đã được tạo thành công',
            order: newOrder 
        });

    } catch (error) {
        res.status(STATUS.SERVER_ERROR).json({
            message: error.name,
            error: error.message,
        });
    }
};


const getOrders = async(req,res)=>{
    try {
        const orders = await DB_Connection.Order.find().populate([
            {path: 'user'},
            {
                path: 'items',
                populate: {
                    path: 'product'
                }
            },
        ]);
        res.status(STATUS.OK).json(orders);
    } catch (error) {
        res.status(STATUS.SERVER_ERROR).json({
            message: error.name,
            error: error.message,
        });
    }
}

const getMyOrders = async(req,res)=>{
    try {
        const user =req.user
        const orders = await DB_Connection.Order.find({
            user:new ObjectId(user.id),
        }).populate({
            path:'user'
        })
        res.status(STATUS.OK).json({
            success:true,
            data:orders
        });
    } catch (error) {
        res.status(STATUS.SERVER_ERROR).json({
            message: error.name,
            error: error.message,
        });
    }
}

const updateStatusOrder = async(req,res)=>{
    const {status} = req.body
    const {orderId} = req.params;
    try {
        const order = await DB_Connection.Order.findOne({_id:orderId});

         // Định nghĩa thứ tự trạng thái hợp lệ
         const statusOrder = ['pendding', 'shipped', 'delivered', 'completed'];
         // Kiểm tra nếu trạng thái mới hợp lệ và thuộc thứ tự hợp lệ
         const currentStatusIndex = statusOrder.indexOf(order.status);
         const newStatusIndex = statusOrder.indexOf(status);
         console.log(currentStatusIndex , newStatusIndex);
        if(order.status =='completed' ){
            return res.status(STATUS.BAD_REQUEST).json({
                message:'Đơn Hàng đã hoàn thành, không được thay đổi trạng thái đơn hàng'
            })
        }
        if(order.status =='canceled' ){
            return res.status(STATUS.BAD_REQUEST).json({
                message:'Đơn Hàng đã hủy, không được thay đổi trạng thái đơn hàng'
            })
        }
        
        if ((status !== 'canceled' && (newStatusIndex - currentStatusIndex > 1 || order.status === 'canceled'))) {
            return res.status(STATUS.BAD_REQUEST).json({ 
                message: "Phải cập nhật trạng thái theo thứ tự" 
            });
        }
        if(status == 'completed'){
            const updateData={
                status:status,
                payment_status:'paid'
            }
            const updatedOrder = await DB_Connection.Order.findByIdAndUpdate(
                orderId, // ID của đơn hàng
                { $set:updateData},
                { new: true } // Tùy chọn để trả về đơn hàng đã được cập nhật
            );
            return res.status(STATUS.OK).json({
                success:true,
                message:'Cập nhật trạng thái thành công',
            })
        }else if(status == 'canceled'){
            if(order.status !='pendding'){
                return res.status(STATUS.BAD_REQUEST).json({message:'Không thể hủy, đơn hàng đã được giao'});
            }
            const updateData={
                status:status,
                payment_status:status
            }
            const updatedOrder = await DB_Connection.Order.findByIdAndUpdate(
                orderId, // ID của đơn hàng
                { $set:updateData},
                { new: true } // Tùy chọn để trả về đơn hàng đã được cập nhật
            );
            return res.status(STATUS.OK).json({
                success:true,
                message:'Cập nhật trạng thái thành công',
            })
        }
        // Cập nhật trạng thái của đơn hàng
        const updatedOrder = await DB_Connection.Order.findByIdAndUpdate(
            orderId, // ID của đơn hàng
            { status: status }, // Trạng thái mới
            { new: true } // Tùy chọn để trả về đơn hàng đã được cập nhật
        );

        res.status(STATUS.OK).json({
            success:true,
            message: 'Cập nhật trạng thái thành công!!!',updatedOrder})
    } catch (error) {
        res.status(STATUS.SERVER_ERROR).json({
            message: error.name,
            error: error.message,
        });
    }
}

const getOrderById = async (req, res) => {
    const { orderId } = req.params;
    try {
        const order = await DB_Connection.Order.findOne({ order_id: orderId }).populate([
            {path: 'user'},
            {
                path: 'items',
                populate: {
                    path: 'product'
                }
            },
            {path:'shippingAddress'}
        ]);

        res.status(STATUS.OK).json({
            success: true,
            data: order,
            message: "Lấy thông tin đơn hàng thành công"
        });
    } catch (error) {
        res.status(STATUS.SERVER_ERROR).json({
            message: error.name,
            error: error.message,
        });
    }
};

const customerCancelOrder = async(req,res)=>{
    const {orderId}= req.params
    try {
        const user = req.user
        const order = await DB_Connection.Order.findById({
            user: new ObjectId(user.id),
            _id: orderId
        });

        if(order && order.status === 'pendding'){
            await DB_Connection.Order.updateOne({_id:orderId},
                {
                    $set:{status:'canceled'},
                    $set:{payment_status:'canceled'}
                },
            );
            res.status(STATUS.OK).json({
                success:true,
                message: 'Hủy đơn hàng thành công!!!'
            })
        }else if(order.status === 'completed'){
            res.status(STATUS.BAD_REQUEST).json({message: 'Đơn hàng đã hoàn thành'})
        }else{
            res.status(STATUS.BAD_REQUEST).json({message: 'Đơn hàng đã được giao cho ĐVVT'})
        }
    } catch (error) {
        res.status(STATUS.SERVER_ERROR).json({
            message: error.name,
            error: error.message,
        });
    }
}
export { createOrder ,getOrders , updateStatusOrder, customerCancelOrder,getMyOrders ,getOrderById};
