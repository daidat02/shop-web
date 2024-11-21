import { STATUS } from '../configs/Constants.js'; 
import DB_Connection from '../model/DBConnection.js'; 
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;


const addProductToShoppingCart = async (req, res) => {
    const { quantity } = req.body;
    try {
        const user = req.user;
        const productInstance = req.productInstance;
        
        // Tính tổng giá của sản phẩm dựa trên số lượng
        const priceTotal = productInstance.price * quantity;

        // Tìm giỏ hàng của người dùng
        const cart = await DB_Connection.ShoppingCart.findOne({ user: new ObjectId(user.id) });

        if (cart) {
            // Kiểm tra nếu sản phẩm đã tồn tại trong giỏ hàng
            const itemIndex = cart.items.findIndex(item => item.product.toString() === productInstance._id.toString());

            if (itemIndex > -1) {
                // Nếu sản phẩm đã có, cập nhật số lượng và giá tổng
                cart.items[itemIndex].quantity += quantity;

                // Giới hạn số lượng tối đa cho mỗi sản phẩm
                if (cart.items[itemIndex].quantity > 99) {
                    cart.items[itemIndex].quantity = 99; // Giới hạn số lượng không vượt quá 99
                }
                // Cập nhật lại giá tổng
                cart.items[itemIndex].priceTotal = productInstance.price * cart.items[itemIndex].quantity; 
            } else {
                // Nếu sản phẩm chưa có, thêm mới
                cart.items.push({
                    product: new ObjectId(productInstance._id),
                    quantity: Math.min(quantity, 99), // Giới hạn số lượng không vượt quá 99
                    priceTotal: productInstance.price * Math.min(quantity, 99) // Tính giá tổng
                });
            }

            // Cập nhật số lượng items trong giỏ hàng
            cart.count = cart.items.length;

            // Lưu giỏ hàng
            await cart.save();
            res.status(STATUS.OK).json({            
                success:true,
                message: 'Sản phẩm đã được thêm vào giỏ hàng',
                data: cart });
        } else {
            // Nếu không có giỏ hàng, tạo mới
            const newCart = new DB_Connection.ShoppingCart({
                user: new ObjectId(user.id),
                items: [{
                    product: new ObjectId(productInstance._id),
                    quantity: Math.min(quantity, 99), // Giới hạn số lượng không vượt quá 99
                    priceTotal: productInstance.price * Math.min(quantity, 99) // Tính giá tổng
                }],
                count: 1 // Khởi tạo số lượng items
            });
            await newCart.save();
            res.status(STATUS.CREATED).json({ 
                success:true,
                message: 'Giỏ hàng đã được tạo và sản phẩm đã được thêm vào',
                data: newCart
             });
        }
    } catch (error) {
        res.status(STATUS.SERVER_ERROR).json({
            success:false,
            message: error.name,
            error: error.message
        });
    }
};


const getShoppingCart = async(req,res)=>{
    try {
        const user = req.user
        const cart = await DB_Connection.ShoppingCart.find({user:new ObjectId(user.id)}).populate({
            path:'items',
            populate:{
                path:'product'
            }
        });
        if(!cart){
            return res.status(STATUS.FORBIDDEN).json({message:'không tìm thấy giỏ hàng '})      
        }
        res.status(STATUS.OK).json(cart);
    } catch (error) {
        res.status(STATUS.SERVER_ERROR).json({
            message: error.name,
            error: error.message
        });
    }
}

const removeItemCart = async (req, res) => {
    try {
        const user = req.user;
        const { itemId } = req.params;
        const cart = await DB_Connection.ShoppingCart.findOneAndUpdate(
            { user: new ObjectId(user.id) },
            { $pull: { items: { _id: new ObjectId(itemId) } } }, // Xóa item theo ID
            { new: true } // Trả về giỏ hàng mới sau khi xóa
        );
        
        if (cart) {
            cart.count = cart.items.length;
            res.status(STATUS.OK).json({
                success:true,
                message: 'Sản phẩm đã được xóa khỏi giỏ hàng',
                data: cart 
            });
        } else {
            res.status(STATUS.NOT_FOUND).json({ message: 'Không tìm thấy giỏ hàng hoặc sản phẩm' });
        }
    } catch (error) {
        res.status(STATUS.SERVER_ERROR).json({
            success:false,
            message: error.name,
            error: error.message
        });
    }
};

export{addProductToShoppingCart, removeItemCart,getShoppingCart}