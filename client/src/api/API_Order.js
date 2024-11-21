import axios from "axios";

export const createOrder = async(accessToken,orderData,axiosJWT)=>{
    try {
        const res = await axiosJWT.post(`/order/create`,orderData,{
            headers:{token: `Bearer ${accessToken}`}
        })

        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export const getOrder = async()=>{
    try {
        const res =await axios.get(`/order/`)
        return res.data;
    } catch (error) {
        console.log(error)
    }
}

export const getDetailOrder = async(orderId)=>{
    try {
        const res = await axios.get(`/order/order-detail/${orderId}`);
        return res.data;
    } catch (error) {
        return error.response.data
    }
}

export const updateStatusOrder = async(orderId,orderStatus)=>{
    try {
        const res = await axios.post(`/order/update/${orderId}`,{status:orderStatus});
        return res.data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;  // Trả về lỗi từ server nếu có
        }
    }
}

export const getMyOrder = async(accessToken,axiosJWT)=>{
    try {
        const res = await axiosJWT.get(`/order/me`,{
            headers:{token: `Bearer ${accessToken}`}
        });
        return res.data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;  // Trả về lỗi từ server nếu có
        }
    }
}