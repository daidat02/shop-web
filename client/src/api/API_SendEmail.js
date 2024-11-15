import axios from "axios";

export const sendInfoOrder = async(dispatch,email,orderId)=>{
    try {
        const res = await axios.post(`/send/info-order`, {email:email , order_id:orderId});
        return res.data;
    } catch (error) {
        return { success: false, error: error.message };    
    }
}
