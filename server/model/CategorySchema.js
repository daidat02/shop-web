import mongoose from "mongoose";
import { DB_SCHEMA } from "../configs/Constants.js";
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId
const CategorySchema = new Schema({
    category_id:{
        type: String,
        required: true,
        unique:true
    },
    category_name:{
        type : String,
        required:true
    },
    state:{
        type:String,
        enum:{
            values:['active',' inactive'],
        },
        default: 'active'
    },

    products:{
        type:[ObjectId],
        ref: DB_SCHEMA.PRODUCT
    },
    images: [
        {
            url: { type: String, required: true }, 
        }
    ],
},{timestamps:true});

const Category = mongoose.model(DB_SCHEMA.CATEGORY,CategorySchema);

export default Category;