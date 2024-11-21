import { createSlice } from "@reduxjs/toolkit";

const authSlice= createSlice({
    name:'auth',
    initialState:{
        account:null,
        otp:null,
        isfetching:false,
        error: false,
        sucsess:false
    },
    reducers:{
        loginSuccess:(state,action)=>{
            state.account= action.payload
            state.sucsess= true
        },
        registerSuccess:(state)=>{
            state.sucsess=true
        },
        sendOtpSuccess:(state,actions)=>{
            state.sucsess=true
            state.otp=actions.payload
        },
        updateUser:(state,action)=>{
            state.account= action.payload
            state.sucsess= true
        },
        logoutSuccess:(state)=>{
            state.account=null
        }
    }
});

export const{
    loginSuccess,
    registerSuccess,
    sendOtpSuccess,
    updateUser,
    logoutSuccess
}= authSlice.actions


export default authSlice.reducer