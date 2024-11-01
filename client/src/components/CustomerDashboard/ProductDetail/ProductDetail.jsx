import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingCart, Loader } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addProdToCart, getProductDetail } from '../../../api/API_Product';
import NotificationMessage from '../../Message/NotificationMessage';
import QuantityControl from './QuantityControl';
import './productdetail.css';

const ProductDetail = () => {
    const { productId } = useParams();
    const dispatch = useDispatch();
    const { account } = useSelector((state) => state.auth || {});
    const initialProdDetail = useSelector((state) => state.products.productDetail);
    
    const [product, setProduct] = useState(initialProdDetail);
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch product details on mount or when productId changes
    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                setIsLoading(true);
                await getProductDetail(dispatch, productId);
            } catch (error) {
                NotificationMessage.error('Không thể tải thông tin sản phẩm.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProductDetails();
    }, [productId, dispatch]);

    // Update local product state when redux state changes
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

    const handleAddToCart = async () => {
        if (!account?.accessToken) {
            NotificationMessage.warning('Vui lòng đăng nhập để thêm vào giỏ hàng.');
            return;
        }

        try {
            setIsLoading(true);
            const addData = {
                product_id: product.product_id,
                quantity
            };

            const result = await addProdToCart(account.accessToken, dispatch, addData);

            if (result.success) {
                NotificationMessage.success('Thêm sản phẩm thành công!');
            } else {
                NotificationMessage.error('Thêm sản phẩm thất bại!', result.error);
            }
        } catch (error) {
            NotificationMessage.error('Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBuyNow = () => {
        if (!account?.accessToken) {
            NotificationMessage.warning('Vui lòng đăng nhập để mua hàng.');
            return;
        }
        // Add buy now logic here
        console.log('Implement buy now functionality');
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <Loader className="animate-spin" size={40} />
                <p>Đang tải...</p>
            </div>
        );
    }

    if (!product || Object.keys(product).length === 0) {
        return (
            <div className="error-container">
                <p>Không tìm thấy thông tin sản phẩm.</p>
            </div>
        );
    }

    return (
        <div className="product-detail-container">
            <div className="product-detail">
                <div className="product-img">
                    {product?.images?.[0]?.url ? (
                        <img 
                            src={product.images[0].url} 
                            alt={product.product_name} 
                            className="product-image"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/placeholder-image.jpg'; // Add a placeholder image
                            }}
                        />
                    ) : (
                        <div className="no-image">Không có hình ảnh</div>
                    )}
                </div>
                
                <div className="product-content">
                    <div className="product-info">
                        <h1 className="product-name">
                            {product.product_name}
                        </h1>
                        
                        <div className="product-price">
                            {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND'
                            }).format(product.price)}
                        </div>
                        
                        <div className="product-description">
                            {product.description || 'Không có mô tả'}
                        </div>

                        <div className="quantity-section">
                            <label className="quantity-label">Số lượng:</label>
                            <QuantityControl 
                                initialQuantity={quantity}
                                onQuantityChange={handleQuantityChange}
                                maxQuantity={product.stock_quantity} // Add stock quantity check if available
                            />
                        </div>
                    </div>

                    <div className="product-actions">
                        <button 
                            onClick={handleAddToCart} 
                            className="btn-add-to-cart"
                            disabled={isLoading}
                        >
                            <ShoppingCart size={24} />
                            <span>Thêm vào giỏ hàng</span>
                        </button>

                        <button 
                            onClick={handleBuyNow} 
                            className="btn-buy-now"
                            disabled={isLoading}
                        >
                            Mua ngay
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;