import {useNavigate} from 'react-router-dom'
import {Rate,Spin}  from 'antd';
import {ShoppingOutlined,HeartOutlined}  from '@ant-design/icons';
import NotificationMessage from '../../Message/NotificationMessage';
import { useSelector } from 'react-redux';
import { addProdToCart } from '../../../api/API_Product';
import { useState } from 'react';

const ProductCard = ({ product }) => {
    const { account } = useSelector((state) => state.auth || {});
    const initialProdDetail = useSelector((state) => state.products.productDetail);
    const [isAddingToCart, setIsAddingToCart] = useState(true);

    const navigate = useNavigate()
    const data ={
        product_id:'',
        quantity:1
    }
    const handleAddToCart = async (e,id)=>{
        e.stopPropagation(); // Ngăn chặn sự kiện click lan ra toàn bộ thẻ
        setIsAddingToCart(false); // Bắt đầu trạng thái loading
        const addData=({...data,product_id:id})
        console.log(addData)
        if (!account?.accessToken) {
            NotificationMessage.warning('Vui lòng đăng nhập để thêm vào giỏ hàng.');
            return;
        }   
        try {
            const result = await addProdToCart(account.accessToken, addData);
            if (result.success) {
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
                    <h3 className="product-price">{product.price}đ</h3>
                    <h4 className="product-sale-price">100.000đ</h4>
                    <h5 className="product-discount-percent">{product.discountPercentage}</h5>
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