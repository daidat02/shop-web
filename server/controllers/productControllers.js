import { STATUS } from '../configs/Constants.js'; 
import DB_Connection from '../model/DBConnection.js'; 
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;

function generateID(length = 10) {
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 10);
    }
    return otp;
}


const createVariant = async (req, res) => {
  const { option_name, options } = req.body; // Lấy dữ liệu từ req.body

  try {
    // Tạo một đối tượng variant mới
    const newVariant = new DB_Connection.Variant({
      option_name,
      options //  mảng của các object chứa các "type"
    });

    const savedVariant = await newVariant.save();

    // Trả về phản hồi thành công
    res.status(STATUS.CREATED).json({
      success: true,
      message: 'Variant created successfully',
      data: savedVariant
    });
  } catch (error) {
    // Nếu có lỗi, trả về phản hồi lỗi
    res.status(500).json({
      success: false,
      message: 'Error creating variant',
      error: error.message
    });
  }
};


const getVariants = async(req,res)=>{
    try {
        const variants = await DB_Connection.Variant.find();

        res.status(STATUS.OK).json({
            success: true,
            message: 'Get variants successfully',
            data: variants
        });
    } catch (error) {
        res.status(STATUS.SERVER_ERROR).json({
            success: false,
            message: 'Error creating variant',
            error: error.message
          });
    }
}

const createTag = async(req,res)=>{
    const{tag}=req.body
    try {
        const newTag = new DB_Connection.Tag({tag});
        await newTag.save()
        res.status(STATUS.CREATED).json({
            success: true,
            message: 'Tag created successfully',
            data: newTag
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating variant',
            error: error.message
          });
    }
}

const getTags = async(req,res)=>{
    try {
        const tags =await DB_Connection.Tag.find();

        res.status(STATUS.OK).json({
            success: true,
            message: 'Get Tag successfully',
            data: tags
        });
    } catch (error) {
        res.status(STATUS.SERVER_ERROR).json({
            success: false,
            message: 'Error get Tags',
            error: error.message
          });
    }
}



const createProduct = async (req, res) => {
    const {
        product_name, productType, description, brand,
        price, quantity,images,tags,colection,category,discountPercentage
    } = req.body;

    try {
        // const categoryInstance = req.categoryInstance
        // if (!product_id || !product_name || !productType || !brand || !price || !quantity ) {
        //     return res.status(STATUS.BAD_REQUEST).json({ message: 'Vui lòng cung cấp đầy đủ thông tin!' });
        // }

        const productId = generateID()

        let sale_price = 0;
        if(discountPercentage){
            sale_price = price - (price * discountPercentage)/100
        }
        const newProduct = new DB_Connection.Product({
            product_id:productId,
            product_name,
            productType,
            description,
            brand,
            price,
            quantity,
            images,
            tags,
            category,
            colection,
            discountPercentage,
            sale_price:sale_price
        });
        
        await newProduct.save();
        // if (categoryInstance) {
        //     categoryInstance.products.push(newProduct._id); // Thêm sản phẩm vào danh mục
        //     await categoryInstance.save(); // Lưu danh mục đã được cập nhật
        // }
        res.status(STATUS.CREATED).json({
            message: 'Tạo sản phẩm thành công',
            newProduct
        });
    } catch (error) {
        res.status(STATUS.SERVER_ERROR).json({ message: 'Có lỗi xảy ra', error: error.message });
    }
}

const getProduct = async(req,res)=>{
    try {
        const products = await DB_Connection.Product.find().populate([
            { path: 'category' },      
            { path: 'tags' ,
                populate:{
                    path:'tag'
                }
            },  
            { path: 'brand' },  
        ]);
        res.status(STATUS.OK).json(products);
    } catch (error) {
        res.status(STATUS.SERVER_ERROR).json({ 
            message: error.name,
            error: error.message 
        });

    }
}

const getProductByCategory = async(req,res) =>{
    const {categoryId} = req.params;
    try {
        const products = await DB_Connection.Category.findOne({category_id:categoryId}).populate('products');
        res.status(STATUS.OK).json(products);
        
    } catch (error) {
        res.status(STATUS.SERVER_ERROR).json({ 
            message: error.name,
            error: error.message 
        });
    }
}

const getProductDetail = async (req,res) =>{
    const {productId} = req.params;
    try {
        const product = await DB_Connection.Product.findOne({product_id:productId}).populate({
            path:'tags',
            populate:{
                path:'tag'
            }
        });
        if (!product) {
            return res.status(STATUS.NOT_FOUND).json({ message: "Product not found" });
        }
        res.status(STATUS.OK).json(product);
    } catch (error) {
        res.status(STATUS.SERVER_ERROR).json({ 
            message: error.name,
            error: error.message 
        });
    }
}

const deleteProduct = async (req, res) => {
    const { productId } = req.params; // Sử dụng req.params nếu productId được truyền qua URL
    try {
        const productUpdate = await DB_Connection.Product.findByIdAndUpdate(
            productId,
            { state: 'inactive' },
            { new: true } // Trả về sản phẩm đã cập nhật
        );

        // Kiểm tra xem sản phẩm có tồn tại hay không
        if (!productUpdate) {
            return res.status(STATUS.NOT_FOUND).json({ message: 'Sản phẩm không tồn tại' });
        }

        res.status(STATUS.OK).json({ message: 'Xóa sản phẩm thành công!!!' });
    } catch (error) {
        res.status(STATUS.SERVER_ERROR).json({ 
            message: error.name,
            error: error.message 
        });
    }
};

const updateProductToOrderSuccess = async (req, res) => {
    try {
        const { orderId } = req.params; // Giả sử bạn truyền mảng các sản phẩm trong đơn hàng qua body
        const order = await DB_Connection.Order.findOne({order_id:orderId})
        .populate(
            {
                path:'items',
                populate:{
                path:'product'
            }
        }
        );;
        if(!order){
            res.status(STATUS.BAD_REQUEST).json('không tìm thấy đơn hàng');
        }
        const orderItems = order.items
        for (const item of orderItems) {
            const product = await DB_Connection.Product.findById(item.product)
            if (product) {
                // Cập nhật số lượng tồn kho
                product.quantity -= item.quantity;
                // Tăng lượt bán
                product.dealScore = (product.dealScore || 0) + item.quantity;
                // Lưu lại sản phẩm đã được cập nhật
                await product.save();
            }
            console.log(product.quantity);
        }
        res.status(200).json({ message: "Cập nhật trạng thái sản phẩm thành công!", });
    } catch (error) {
        console.error("Error updating product status:", error);
        res.status(500).json({ message: "Có lỗi xảy ra khi cập nhật trạng thái sản phẩm.", error: error.message });
    }
};


const removeProduct = async (req, res) => {
    const { productId } = req.params; // Sử dụng req.params nếu productId được truyền qua URL
    try {
        const product= await DB_Connection.Product.findByIdAndDelete(
            productId,
        );

        res.status(STATUS.OK).json({ message: 'Xóa sản phẩm thành công!!!' });
    } catch (error) {
        res.status(STATUS.SERVER_ERROR).json({ 
            message: error.name,
            error: error.message 
        });
    }
};

const findProductById = async(req,res,next)=> {
    const {product_id} = req.body
    try {
        const productInstance = await DB_Connection.Product.findOne({product_id: product_id});
        if(!productInstance){
            return res.status(STATUS.FORBIDDEN).json({message:'không tìm thấy sản phẩm'});
        } 

        req.productInstance = productInstance
        next();
    } catch (error) {
        res.status(STATUS.SERVER_ERROR).json({ 
            message: error.name,
            error: error.message 
        });
    }

}
export{createProduct, getProduct, deleteProduct, findProductById , getProductByCategory, getProductDetail, 
    createVariant ,getVariants , createTag,getTags,removeProduct ,updateProductToOrderSuccess}