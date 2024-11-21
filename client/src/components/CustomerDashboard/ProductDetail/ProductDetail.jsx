import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingCart, Loader } from 'lucide-react';
import {Rate,Spin} from 'antd'
import { useDispatch, useSelector } from 'react-redux';
import { addProdToCart, getProductDetail } from '../../../api/API_Product';
import NotificationMessage from '../../Message/NotificationMessage';
import QuantityControl from './QuantityControl';
import './productdetail.css';
import { createAxiosInstance } from '../../../createInstance';
import ProductReviews from './ProductReviews';

const ProductDetail = () => {
    const { productId } = useParams();
    const dispatch = useDispatch();
    const { account } = useSelector((state) => state.auth || {});
    const initialProdDetail = useSelector((state) => state.products.productDetail);
    const cartItemCount = useSelector((state)=>state.cart?.countItems|| 0);
    let axiosJWT = createAxiosInstance(account,dispatch);;

    const [product, setProduct] = useState(initialProdDetail);
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState();
    const [inStock,setInStock]= useState(true);
    // Fetch product details on mount or when productId changes
    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                setIsLoading(true);
               const response= await getProductDetail(dispatch, productId);
               setSelectedImage(response?.images?.[0]?.url || '/placeholder-image.jpg')
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
            console.log(addData)
            const result = await addProdToCart(account.accessToken, addData,axiosJWT);

            if (result.success) {
                dispatch({ type: 'cart/setCountItems', payload: result.data?.count });
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

    return (
        <div className="product-detail-container">
            {isLoading && (
                <div className="loading-overlay">
                    <Spin size="large" />
                </div>
            )}
            <div className="product-detail">
                <div className='list-img'>
                    <div className='img-item'>
                        {product?.images && product.images.length > 0 ? (
                                product.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image.url}
                                        alt={`${product.product_name} - Image ${index + 1}`}
                                        onClick={() => setSelectedImage(image.url)}
                                        className={selectedImage === image.url ? 'img-item selected' : 'img-item'}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/placeholder-image.jpg'; // Hình ảnh thay thế khi lỗi
                                        }}
                                    />
                                ))
                            ) : (
                                <div className="no-image">Không có hình ảnh</div>
                            )}
                    </div>
                </div>
                <div className="product-img">
                    {product?.images?.[0]?.url ? (
                        <img 
                            src={selectedImage} 
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
                         <div className='rate-container'> 
                            <Rate disabled defaultValue={5} style={{color:'orange'}} className="custom-rate"/>
                            <div className='review'> 653 Lượt đánh giá</div>
                            <div className='review'>823 Đã Bán</div>
                        </div>
                        <h3 className="product-name">
                            {product?.product_name}
                        </h3>
                        <div className='product-tag'>
                            <span className='tag-name'>
                                 #1 Best Saller
                            </span>
                            <span className='tag-decrs'>Sản Phẩm bán chạy </span>
                        </div>
                        <div className="price-container">
                           <span className='product-price'>
                            {product?.sale_price.toLocaleString()}đ
                           </span>

                           <span className='sale-price'>
                            {product?.price.toLocaleString()}đ
                           </span>

                           <span className='discount-percent'>{product?.discountPercentage}%</span>
                        </div>

                        {/* <div className="product-description">
                            {product.description || 'Không có mô tả'}
                        </div> */}

                        <div className="quantity-section">
                            <label className="quantity-label">Số lượng:</label>
                            <div style={{display:'flex' , alignItems:'center'}}>
                                <QuantityControl 
                                    initialQuantity={quantity}
                                    onQuantityChange={handleQuantityChange}
                                    maxQuantity={product?.stock_quantity} // Add stock quantity check if available
                                />
                                <span className='warehouse'>{product?.quantity} Sản Phẩm có sẵn</span>
                            </div>
                            
                            {product?.quantity > 0 ? (
                                <div className='in-stock'>
                                        <span>Còn Hàng</span>
                                </div>
                            ):(
                                <div className='in-stock'>
                                    <span>Hết Hàng</span>
                                </div>
                            )}
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