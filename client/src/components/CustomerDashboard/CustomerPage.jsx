import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Header/Header"
import HomePage from "./HomePage/HomePage"
import Footer from './Footer/Footer';
import Login from '../Auth/Login';

import './customer.css'
import Product from "./Product/Product";
import ProductDetail from "./ProductDetail/ProductDetail";
import Register from "../Auth/register";
import ShoppingCart from "./ShopingCart/ShopingCart";
import OrderPage from "./Order/Order";
const CustomerPage = ()=>{
    return(
        <div className="main">
            <div className="header">
                <Header/>
            </div>
            <div className="body">
            <Routes>
                <Route path='/product' element={<Product/>} />
                <Route path='/product-detail/:productId' element={<ProductDetail/>} />
                <Route path='/login' element = {<Login/>}/>
                <Route path='/register' element = {<Register/>}/>
                <Route path='/cart' element = {<ShoppingCart/>}/>
                <Route path='/order' element = {<OrderPage/>}/>
                {/* <HomePage/> */}
            </Routes>
            </div>
            {/* <div className="footer">
                <Footer/>
            </div> */}
        </div>
    )
}

export default CustomerPage