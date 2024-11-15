import axios from "axios"


export const createPaymentUrl = async(orderId) =>{
    try {
        const res = await axios.get(`/create_payment_url?orderId=${orderId}`);
        return res.data
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;  // Trả về lỗi từ server nếu có
        }    
    }
}

export const vnpayReturn = async(vnpParams)=>{
    try {
        const res = await axios.get(`/vnpay_return${vnpParams}`);
        return res.data
    } catch (error) {
        if (error.response && error.response.data) {
            console.log(error)
            return error.response.data;  // Trả về lỗi từ server nếu có
        }    
    }
}