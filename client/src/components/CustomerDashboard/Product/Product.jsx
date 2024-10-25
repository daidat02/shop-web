import React, { useEffect } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './product.css'; 
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getProducts } from '../../../api/API_Product';
import { getCategories } from '../../../api/API_Category';

import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Card ,Rate} from 'antd';

const { Meta } = Card;


const Product = () => {

    const initialProducts = useSelector((state) => state.products.products);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        getProducts(dispatch);
    }, [dispatch]);
    

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000
    };


    // Dữ liệu sản phẩm mẫu cho slider
    const slider = {
        images: [
            "/images/drceutics_sp_1.jpg",
            "/images/drceutics_sp_1.jpg",
            "/images/drceutics_sp_1.jpg",
            "/images/drceutics_sp_1.jpg"
        ]
    };

    const handleOnClick = (id)=>{
        navigate(`/product-detail/${id}`)
    }

    return (
        <div className="customer-product-container">
            <div className="product-slider">
                <Slider {...settings}>
                    {slider.images.map((image, index) => (
                        <div key={index}>
                            <img src={image} alt={`Sản phẩm ${index + 1}`} /> 
                        </div>
                    ))}
                </Slider>
            </div>
            
            <div className="category-product">
                <div className="product-title">
                    <span>Sản Phẩm Nổi Bật</span>
                </div>
                <div className="customer-product">
                    {initialProducts?.map((product) => (
                        <div className="item" key={product?.id} onClick={() => handleOnClick(product.product_id)} >
                            <div className="item-image">
                            <img alt={product.product_id} src={`${product?.images[0]?.url}`} />
                            </div>
                            <div className="item-info">
                                <p className="item-name">{product.product_name}</p>
                                <p className="item-price">{product.price.toLocaleString()} VND</p>
                            </div>
                        </div>
                    ))}
                </div>
                
                
            </div>
        </div>
    );
};

export default Product;
