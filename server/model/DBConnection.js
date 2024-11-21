import Account from './AccountSchema.js'; 
import User from './UserSchema.js'; 
import Category from './CategorySchema.js';
import Product from './ProductSchema.js';
import Brand from './BrandSchema.js';
import ShoppingCart from './ShoppingCartSChema.js';
import Order from './OrderSchema.js';
import OTP from './OTPSchema.js';
import Variant from './VariantSchema.js';
import Tag from './TagSchema.js';
import Address from './AddressSchema.js';
import Voucher from './VoucherSchema.js';
import MessageModel from './MessageSchema.js';
const DB_Connection = {
     Account,
     User,
     Category,
     Product,
     Brand,
     ShoppingCart,
     Order,
     OTP,
     Variant,
     Tag,
     Address,
     Voucher,
     MessageModel
};

// Xuất DB_Connection
export default DB_Connection;
