import mongoose from "mongoose";
import { DB_SCHEMA } from "../configs/Constants.js";
const ObjectId = mongoose.Types.ObjectId
const Schema = mongoose.Schema


const ProductSchema = new Schema({
    product_id: {
        type: String,
        required: true,
        unique:true
    },

    product_name:{
        type : String,
        required:true
    },
    description:{
        type: String,
        required:false
    },
    brand:{
        type : ObjectId,
        ref: DB_SCHEMA.BRAND,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    sale_price:{
        type:Number,
        required:false
    },
    quantity:{
        type:Number,
        required:true
    },
    productType: { type: String, required: true }, 
    images: [
        {
            url: { type: String, required: true }, // URL của ảnh
        }
    ],
    
    tags:[
        {tag:{
            type:ObjectId,
            ref: DB_SCHEMA.TAG,
            required:true
        }}
    ],

    category:{
        type:ObjectId,
        ref:DB_SCHEMA.CATEGORY,
        required:true
    },

    colection:{
        type:String,
    },

    state:{
        type:String,
        enum:{
            values:['active', 'inactive']
        },
        default:'active'
    },
    isTopDeal :{type:Boolean, default:false},
    isBestOffer :{type:Boolean, default:false},
    discountPercentage:{type:Number, required:false},
    dealScore:{type:Number, required:false },
    dealExpiryDate:{type:Date, required:false },
    offerExpiryDate:{type:Date, required:false}
},{ timestamps: true });

const Product = mongoose.model(DB_SCHEMA.PRODUCT, ProductSchema);

export default Product