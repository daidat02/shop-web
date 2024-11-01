import axios from 'axios';
import { createCategorySuccess, getCategoriesSuccess } from '../redux/slice/category';

export const createCategory = async(dispacth, data)=>{
    try {
        await axios.post(`/cat/create`,data)
        dispacth(createCategorySuccess());
        return { success: true }; // Thêm dòng này để trả về kết quả thành công
    } catch (error) {
        console.log(error);
        return { success: false, error: error.message }; // Trả về thông tin lỗi nếu có
    }
}

export const getCategories =async()=>{
    try {
        const res = await axios.get(`/cat/get`)
        return res.data
        // dispacth(getCategoriesSuccess(res.data));
    } catch (error) {
        console.log(error);
    }
}

export const deleteCategory = async(id)=>{
    try {
        const res = await axios.delete(`/cat/${id}`);
        return res.data
    } catch (error) {
        console.log(error);
    }
}