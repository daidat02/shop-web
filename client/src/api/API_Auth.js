import axios from "axios"
import { loginSuccess, registerSuccess, sendOtpSuccess } from "../redux/slice/auth";


export const loginUser = async(dispatch,navigate,loginData)=>{
    try {
        const res = await axios.post(`/auth/login`,loginData);
        dispatch(loginSuccess(res.data));
        navigate(`/`)
        return {success:true}
    } catch (error) {
        return { success: false, error: error.message };   
    }
}

export const sendOTP = async(dispatch,email)=>{
    try {
        const res = await axios.post(`/otp/send-otp`, {email:email});
        dispatch(sendOtpSuccess(res.data));
        return{success:true}
    } catch (error) {
        return { success: false, error: error.message };    
    }
}

export const registerAccount = async(dispatch,navigate,regData)=>{
    try {
        const res = await axios.post(`/auth/reg`,regData);
        dispatch(registerSuccess(res.data));
        navigate('/login');
        return{success:true}
    } catch (error) {
        return {success:false , error:error.message}
    }
}