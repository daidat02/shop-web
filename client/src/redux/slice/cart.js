import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name:'cart',
    initialState:{
        cart:null,
        success:true,
        countItems:0,
    },

    reducers:{
        getCartSucsess:(state,action)=>{
            state.cart = action.payload
        },
        addProductToCartSuccess:(state)=>{
            state.success= true
        },
        setCountItems:(state,action)=>{
            state.countItems=action.payload
        },
    }
});

export const{
    getCartSucsess,
    addProductToCartSuccess,
    setCountItems
} = cartSlice.actions

export default cartSlice.reducer