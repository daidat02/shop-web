import axios from 'axios';
import { createProductSuccess, getProductsSuccess } from '../redux/slice/product';
import { axiosConfig } from '../configs/axios.config';

export const createProduct = async(dispacth, data)=>{
    try {
        await axiosConfig.post(`/prod/create`,data)
        dispacth(createProductSuccess());
        return { success: true }; // Thêm dòng này để trả về kết quả thành công
    } catch (error) {
        console.log(error);
        return { success: false, error: error.message }; // Trả về thông tin lỗi nếu có
    }
}

export const getProducts =async(dispacth)=>{
    try {
        const res = await axiosConfig.get(`/prod/get`)

        dispacth(getProductsSuccess(res.data));
    } catch (error) {
        console.log(error);
    }
}