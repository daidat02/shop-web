import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Trash2, ShoppingCart as CartIcon } from 'lucide-react';
import QuantityControl from '../ProductDetail/QuantityControl';
import './cart.css';
import { useDispatch, useSelector } from 'react-redux';
import { getCart } from '../../../api/API_Cart';

// Hàm định dạng giá
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

// Component giỏ hàng
const CartItem = ({ item, onQuantityChange, onRemove, onCheckItem, checked }) => (
  item?.product && ( // Kiểm tra item và product trước khi render
    <div className="cart-item">
      <div className='checkbox-container'>
        <input 
          type='checkbox' 
          className="check-box" 
          checked={checked} 
          onChange={() => onCheckItem(item.product._id)} 
        />
      </div>
      <div className="cart-item-details">
        <img src={item.product.images[0].url} alt={item.product.product_name} className="cart-item-image" />
        <div>
          <h3 className="cart-item-name">{item.product.product_name}</h3>
          <p className="cart-item-type">{item.product.productType}</p>
        </div>
      </div>
      <div className='title-price'>
        {formatPrice(item.product.price)}
      </div>
      <div className='title-quantity'>
        <QuantityControl 
          initialQuantity={item.quantity} // Truyền initialQuantity vào đây
          onQuantityChange={(newQuantity) => onQuantityChange(item.product._id, newQuantity)}
        />
      </div>
      <div className='title-total-price'>
        <p className="cart-item-price">{formatPrice(item.priceTotal)}</p>
      </div>
      <div className="cart-item-actions">
        <button onClick={() => onRemove(item.product._id)} className="remove-button">
          xóa
        </button>
      </div>
    </div>
  )
);

// Component giỏ hàng chính
const ShoppingCart = () => {
  const account = useSelector((state) => state.auth?.account);
  const accessToken = account?.accessToken;
  const initialCart = useSelector((state) => state.cart?.cart);
  const [cartItems, setCartItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");

  const navigate = useNavigate(); // Khởi tạo useNavigate để điều hướng
  const dispatch = useDispatch();

  useEffect(() => {
    getCart(accessToken, dispatch);
    setCheckedItems([]);
  }, [accessToken, dispatch]);

  useEffect(() => {
    if (initialCart) {
      setCartItems(initialCart[0]?.items || []); // Đảm bảo cartItems là mảng
    }
  }, [initialCart]);

  const handleQuantityChange = (productId, newQuantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item?.product && item.product._id === productId // Kiểm tra product trước khi truy cập _id
          ? { ...item, quantity: newQuantity, priceTotal: item.product.price * newQuantity }
          : item
      )
    );
  };

  const handleRemoveItem = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item?.product && item.product._id !== productId)); // Kiểm tra product trước khi truy cập _id
    setCheckedItems(prevChecked => prevChecked.filter(id => id !== productId));
  };

  const handleCheckItem = (productId) => {
    setCheckedItems(prevChecked =>
      prevChecked.includes(productId)
        ? prevChecked.filter(id => id !== productId)
        : [...prevChecked, productId]
    );
  };

  const handleCheckAll = () => {
    if (checkAll) {
      setCheckedItems([]);
    } else {
      setCheckedItems(cartItems?.map(item => item?.product?._id).filter(Boolean)); // Kiểm tra product trước khi lấy _id
    }
    setCheckAll(!checkAll);
  };

  useEffect(() => {
    if (cartItems?.length > 0 && checkedItems.length === cartItems.length) {
      setCheckAll(true);
    } else {
      setCheckAll(false);
    }
  }, [checkedItems, cartItems]);

  const totalPrice = cartItems?.filter(item => 
    item?.product && checkedItems.includes(item.product._id) // Kiểm tra item.product trước khi truy cập _id
  ).reduce((total, item) => total + (item.priceTotal || 0), 0) || 0; // Đảm bảo total không bị NaN

  const handleOrderSubmit = async () => {
    if (checkedItems.length === 0) {
      alert('Bạn chưa chọn sản phẩm nào.');
      return;
    }

    try {
      const selectedItems = cartItems?.filter(item => 
        item?.product && checkedItems.includes(item.product._id) // Kiểm tra item.product trước khi truy cập _id
      );

      // Điều hướng đến trang đơn hàng và truyền dữ liệu
      navigate('/order', {
        state: {
          items: selectedItems,
          totalPrice,
          shippingAddress
        }
      });
    } catch (error) {
      alert('Đã có lỗi xảy ra khi tạo đơn hàng');
    }
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>
          <CartIcon size={32} />
          Giỏ Hàng
        </h2>
      </div>

      <div className="cart-item-container">
        <div className="cart-item-title">
          <div className='checkbox-container'>
            <input 
              type='checkbox' 
              className="check-box" 
              checked={checkAll}
              onChange={handleCheckAll}
            />
          </div>
          <div className='title-product'>Sản phẩm</div> 
          <div className='title-price'>Đơn Giá</div> 
          <div className='title-quantity'>Số Lượng</div> 
          <div className='title-total-price'>Số Tiền</div> 
          <div className='title-actions'>Thao tác</div>
        </div>

        <div className="cart-item-content">
          {cartItems?.length === 0 ? (
            <p className="empty-cart-message">Giỏ hàng của bạn đang trống</p>
          ) : (
            cartItems?.map(item => (
              item?.product && ( // Kiểm tra item và product trước khi render
                <CartItem
                  key={item.product._id} // Đảm bảo rằng _id tồn tại
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemoveItem}
                  onCheckItem={handleCheckItem}
                  checked={checkedItems.includes(item.product._id)}
                />
              )
            ))
          )}
        </div>
      </div>
      <div className="pay-container">
        <h3>Tổng cộng</h3>
        <p className="total-price">{formatPrice(totalPrice)}</p>
        
        <button onClick={handleOrderSubmit} className="order-button">
          Đặt hàng
        </button>
      </div>
    </div>
  );
};

export default ShoppingCart;
