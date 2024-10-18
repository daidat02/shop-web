import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name:'cart',
    initialState:{
        cart:null,
        success:true
    },

    reducers:{
        getCartSucsess:(state,action)=>{
            state.cart = action.payload
        },

        addProductToCartSuccess:(state)=>{
            state.success= true
        },
    }
});

export const{
    getCartSucsess,
    addProductToCartSuccess
} = cartSlice.actions

export default cartSlice.reducer