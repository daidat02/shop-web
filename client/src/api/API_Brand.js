import axios from "axios"

export const getBrand = async()=>{
    try {
        const res = await axios.get('/brand/');
        return res.data
    } catch (error) {
        
    }
}