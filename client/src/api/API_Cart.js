import axios from "axios";
import { getCartSucsess } from "../redux/slice/cart";

export const getCart = async (accessToken,dispatch,axiosJWT) => {
    try {
        const res = await axiosJWT.get(`http://localhost:3000/shopping/`, {
            headers:{token: `Bearer ${accessToken}` } 
        });

        dispatch(getCartSucsess(res.data)); 
        return res.data
    } catch (error) {
        console.log(error);
    }
};


export const removeCartItem = async(accessToken,itemId,axiosJWT)=>{
    try {
        const res = await axiosJWT.delete(`/shopping/${itemId}`,{
            headers:{token: `Bearer ${accessToken}`}
        })
        return res.data
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;  // Trả về lỗi từ server nếu có
        }
    }
}
