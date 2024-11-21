import {useNavigate} from 'react-router-dom'
import {Rate,Spin}  from 'antd';
import {ShoppingOutlined,HeartOutlined}  from '@ant-design/icons';
import NotificationMessage from '../../Message/NotificationMessage';
import { useDispatch, useSelector } from 'react-redux';
import { addProdToCart } from '../../../api/API_Product';
import { useState } from 'react';
import { addItemToCart } from '../../../redux/slice/cart';
import  tokenManager, { createAxiosInstance } from '../../../createInstance';

const ProductCard = ({ product }) => {
    // const { account } = useSelector((state) => state.auth || {});
    const account = useSelector((state) => state.auth?.account);

    const initialCart = useSelector((state) => state.cart?.cart);
    const cartItemCount = useSelector((state)=>state.cart?.countItems|| 0);
    const [isAddingToCart, setIsAddingToCart] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate()
    let axiosJWT = createAxiosInstance(account,dispatch);;
    const data ={
        product_id:'',
        quantity:1
    }
    const handleAddToCart = async (e,id)=>{
        e.stopPropagation(); // Ngăn chặn sự kiện click lan ra toàn bộ thẻ
        setIsAddingToCart(false); // Bắt đầu trạng thái loading
        const addData=({...data,product_id:id})
        if (!account?.accessToken) {
            NotificationMessage.warning('Vui lòng đăng nhập để thêm vào giỏ hàng.');
            return;
        }   
        try {
            const result = await addProdToCart(account.accessToken, addData,axiosJWT);
            if (result.success) {
                console.log('số lượng', result.data?.count)
                dispatch({ type: 'cart/setCountItems', payload: result.data?.count });
                NotificationMessage.success('Thêm sản phẩm thành công!');
                
            } else {
                NotificationMessage.error('Thêm sản phẩm thất bại!', result.error);
            }
        } catch (error) {
            NotificationMessage.error('Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng.');
        }finally{
            setIsAddingToCart(true); // Kết thúc trạng thái loading
        }
    }

    const handleClick= (id)=>{
        navigate(`/product-detail/${id}`)
    }
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(amount);
      };
    return (
        <div className={`product-card ${product.isTopDeal ? 'top-deal' : ''} ${product.isBestOffer ? 'best-offer' : ''}`} 
            onClick={()=> handleClick(product.product_id)}
        >
            <div  className="product-image">
                <div className='wish-action'>
                    <HeartOutlined />
                </div>
                <img
                    src={product.images[0].url} 
                    alt={product.product_name} 
                />
            </div>
            <div className="info-product">
                <span className="product-name">{product.product_name}</span>
                
                <div className="price-container">
                     <h3 className="product-price">
                        {product?.sale_price > 0 
                            ? formatCurrency(product.sale_price) 
                            : formatCurrency(product.price)
                        }
                    </h3>         
                    <h4 className="product-sale-price">
                        {product?.sale_price > 0 
                            ? formatCurrency(product.price) 
                            : ''
                        }
                    </h4> 
                    <h5 className="product-discount-percent">
                        {product?.discountPercentage ? product?.discountPercentage+'%' : ''}
                    </h5>
                </div>
                <div className="rate-container">
                    <Rate disabled defaultValue={5} style={{color:'orange'}} className="custom-rate" />
                 
                    {isAddingToCart ? (
                        <div className='add-to-cart-acction' onClick={(e)=> handleAddToCart(e,product.product_id)}>
                            <ShoppingOutlined />
                        </div>
                        ):(
                            <div className='add-to-cart-acction loading-spin'>
                                <Spin/>                           
                            </div> 
                        )}
                   
                </div>
            </div>
        </div>
    );      
};



export default ProductCard;