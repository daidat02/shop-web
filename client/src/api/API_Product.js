import axios from 'axios';
import { addProdToCartSuccess, createProductSuccess, deleteProductSuccess, getproductDetailSuccess, getProductsSuccess } from '../redux/slice/product';
import { getProductByCategorySuccess } from '../redux/slice/category';

export const createProduct = async(dispacth, categoryId, data)=>{
    try {
        await axios.post(`/prod/create`,data)
        dispacth(createProductSuccess());
        return { success: true }; // Thêm dòng này để trả về kết quả thành công
    } catch (error) {
        console.log(error);
        return { success: false, error: error.message }; // Trả về thông tin lỗi nếu có
    }
}

export const getProducts =async(dispacth)=>{
    try {
        const res = await axios.get(`/prod/get`, )
        dispacth(getProductsSuccess(res.data));
    } catch (error) {
        console.log(error);
    }
}

export const getProductByCategory = async(dispacth, categoryId) =>{
    try {
        const res = await axios.get(`/prod/${categoryId}`)
        dispacth(getProductByCategorySuccess(res.data));
    } catch (error) {
        
    }
}

export const deleteProduct = async(dispacth,categoryId,productId) =>{
    try {
        const res = await axios.delete(`/prod/${categoryId}/${productId}`)
        dispacth(deleteProductSuccess(res.data));
        return {success:true}
    } catch (error) {
        console.log(error)
    }
}

export const getProductDetail = async(dispacth,productId)=>{
    try {
        const res = await axios.get(`/prod-detail/${productId}` )
        dispacth(getproductDetailSuccess(res.data));
    } catch (error) {
        console.log(error);
    }
}

export const addProdToCart = async(accessToken, dispacth, data)=>{
    try {
        const res = await axios.post(`/shopping/add` , data, {
            headers:{token: `Bearer ${accessToken}`}
        });

        dispacth(addProdToCartSuccess());
        return{success:true}
    } catch (error) {
        return {success:false}
    }
}