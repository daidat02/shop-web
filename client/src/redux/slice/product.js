import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
    name:'product',
    initialState:{
        products:[],
        productDetail: null,
        success: false,
        isfetching:false,
        error: false,
        msg: ""
    },

    reducers:{

        createProductSuccess: (state)=>{
            state.isfetching = false
            state.success = true
        },

        getProductsSuccess:(state,action)=>{
            state.isfetching = false
            state.products = action.payload
        },
        deleteProductSuccess:(state,action) =>{
            state.success = true
            state.msg = action.payload
        },

        getproductDetailSuccess:(state,action)=>{
            state.productDetail= action.payload
        },

        addProdToCartSuccess:(state)=>{
            state.success= true
        }
        
    }
});

export const{
    createProductSuccess,
    getProductsSuccess,
    deleteProductSuccess,
    getproductDetailSuccess,
    addProdToCartSuccess
} = categorySlice.actions

export default categorySlice.reducer