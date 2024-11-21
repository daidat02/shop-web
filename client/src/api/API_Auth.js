import axios from "axios"
import { loginSuccess, logoutSuccess, registerSuccess, sendOtpSuccess } from "../redux/slice/auth";


export const loginUser = async(dispatch,loginData)=>{
    try {
        const res = await axios.post(`/auth/login`,loginData);
        dispatch(loginSuccess(res.data));
        return res.data
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

export const logoutUser = async(dispatch,accessToken,axiosJWT) =>{
    try {
      const res = await axiosJWT.post(`/auth/logout`, {
            headers:{token: `Bearer ${accessToken}`}
        });
        dispatch(logoutSuccess());
        return res.data
    } catch (error) {
        console.log(error)
    }
}