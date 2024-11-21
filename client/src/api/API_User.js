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
        const res = await axios.post(`/customer/address/add`,{
            headers:{token: `Bearer ${accessToken}`}
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export const getCustomers = async(accessToken,axiosJWT)=>{
    try {
        const res = await axiosJWT.get(`/customer/`,{
            headers:{token: `Bearer ${accessToken}`}
        })
        return res.data
    } catch (error) {
        console.log(error);
    }
}

export const getProfileUser = async(accessToken,axiosJWT)=>{
    try {
        const res = await axiosJWT.get(`/customer/profile`,{
            headers:{token: `Bearer ${accessToken}`}
        })
        return res.data
    } catch (error) {
        console.log(error);
    }
}

export const addAddress = async(accessToken,axiosJWT,data)=>{
    try {
        const res = await axiosJWT.post(`/customer/address/add`,data,{
            headers:{token: `Bearer ${accessToken}`}
        })
        return res.data
    } catch (error) {
        return error.response.data
    }
}


export const updateAddressDefault = async(addressId)=>{
    try {
        const res = await axios.get(`/customer/update-adress/`+addressId)
        return res.data
    } catch (error) {
        return error.response.data
    }
}