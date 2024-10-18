import axios from "axios";
import { getCartSucsess } from "../redux/slice/cart";

export const getCart = async (accessToken,dispatch) => {
    try {
        const res = await axios.get(`http://localhost:3000/shopping/`, {
            headers:{token: `Bearer ${accessToken}` } 
        });

        dispatch(getCartSucsess(res.data)); 
    } catch (error) {
        console.log(error);
    }
};
