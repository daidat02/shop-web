import mongoose from "mongoose";
import { DB_SCHEMA } from "../configs/Constants.js";
const Schema = mongoose.Schema

const TagSchema = new Schema({
  
    tag:{
        type : String,
        required:true
    },
   })

const Tag = mongoose.model(DB_SCHEMA.TAG,TagSchema);

export default Tag