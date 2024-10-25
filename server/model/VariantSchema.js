import mongoose, { Schema } from 'mongoose';
import { DB_SCHEMA } from '../configs/Constants.js';

const VariantSchema = new Schema({
    option_name:{
        type:String,
        required:true
    },
   
    options:[{
        type:{
            type:String,
            required:true     
        }
    }]

    
});

const  variant = mongoose.model(DB_SCHEMA.VARIANT, VariantSchema);

export default variant