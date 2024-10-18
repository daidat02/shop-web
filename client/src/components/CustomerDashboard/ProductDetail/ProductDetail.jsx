import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './productdetail.css';
import { ShoppingCart } from 'lucide-react';
import QuantityControl from './QuantityControl';
import { useDispatch, useSelector } from 'react-redux';
import { addProdToCart, getProductDetail } from '../../../api/API_Product';
import NotificationMessage from '../../Message/NotificationMessage';

const ProductDetail = () => {
    const { productId } = useParams();
    const account = useSelector((state) => state.auth?.account);
    const accessToken = account?.accessToken;
    const initialProdDetail = useSelector((state) => state.products.productDetail);
    const dispatch = useDispatch();
    const [product, setProduct] = useState(initialProdDetail);
    const [quantity, setQuantity] = useState(1);
    const [addData, setAddData] = useState({ product_id: '', quantity: '' });

    useEffect(() => {
        getProductDetail(dispatch, productId);
    }, [productId, dispatch]);

    useEffect(() => {
        if (initialProdDetail) {
            setProduct(initialProdDetail);
        }
    }, [initialProdDetail]);

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity > 0) {
            setQuantity(newQuantity);
        }
    };

    useEffect(() => {
        if (product) {
            setAddData({ product_id: product.product_id, quantity });
        }
    }, [product, quantity]);

    const handleAddToCart = async () => {
        try {
            const result = await addProdToCart(accessToken, dispatch, addData);

            if (result.success) {
                NotificationMessage.success('Thêm sản phẩm thành công!');
            } else {
                NotificationMessage.error('Tạo sản phẩm thất bại!', result.error);
            }
        } catch (error) {
            NotificationMessage.error('Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng.');
        }
    };

    const handleBuyNow = () => {
        // Logic mua ngay
        console.log('Đã chọn mua ngay');
    };

    if (!product || Object.keys(product).length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div className="product-detail-container">
            <div className="product-detail">
                <div className="product-img">
                    <img src={product?.images[0]?.url} alt={product?.product_name} className="product-image" />
                </div>
                <div className="product-content">
                    <div className="product-info">
                        <div className="product-name">
                            {product?.product_name}
                        </div>
                        <div className="product-price">
                            {product?.price.toLocaleString()} đ
                        </div>
                        <div className="product-description">
                            {product?.description}
                        </div>

                        <QuantityControl 
                            initialQuantity={quantity} // Thay đổi đây để truyền initialQuantity
                            onQuantityChange={handleQuantityChange} 
                        />
                    </div>
                    <div className="product-actions">
                        <div className="add-product-cart">
                            <ShoppingCart size={30} />
                            <button onClick={handleAddToCart} className="btn-add-to-cart">Thêm vào giỏ hàng</button>
                        </div>
                        <div className="buy-now">
                            <button onClick={handleBuyNow} className="btn-buy-now">Mua ngay</button>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default ProductDetail;
