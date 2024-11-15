import axios from "axios";

export const getShippingAddress = async (accessToken)=>{
    try {
        const res = await axios.get(`/address/`,{
            headers:{token: `Bearer ${accessToken}`}
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export const addShippingAddress = async (accessToken)=>{
    try {
        const res = await axios.post(`/address/add`,{
            headers:{token: `Bearer ${accessToken}`}
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export const getCustomers = async()=>{
    try {
        const res = await axios.get(`/customer/`)
        return res.data
    } catch (error) {
        console.log(error);
    }
}