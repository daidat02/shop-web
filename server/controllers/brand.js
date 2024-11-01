import { STATUS } from '../configs/Constants.js'; 
import DB_Connection from '../model/DBConnection.js'; 
import mongoose from 'mongoose';


const createBrand = async(req,res)=>{
    const{brand_name, description}=req.body
    try {
        const newbrand = new DB_Connection.Brand({
            brand_name,
            description
        });
        await newbrand.save()
        res.status(STATUS.CREATED).json({
            success: true,
            message: 'brand created successfully',
            data: newbrand
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating brand',
            error: error.message
          });
    }
}

const getBrand= async(req,res)=>{
    try {
        const brands = await DB_Connection.Brand.find();
        res.status(STATUS.OK).json({
            success: true,
            data: brands
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating variant',
            error: error.message
          });
    }
}


export{createBrand, getBrand}