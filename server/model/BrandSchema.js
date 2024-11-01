import mongoose from "mongoose";
import { DB_SCHEMA } from "../configs/Constants.js";
const Schema = mongoose.Schema

const BrandSchema = new Schema({
  
    brand_name:{
        type : String,
        required:true
    },
    description:{
        type: String,
        required:false
    },
    origin: { type: String, required: false },  
})

const Brand = mongoose.model(DB_SCHEMA.BRAND,BrandSchema);

export default Brand