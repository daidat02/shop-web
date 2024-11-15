import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart as CartIcon } from 'lucide-react';
import { Space, Table, Input, Button, Card } from 'antd';
import QuantityControl from '../ProductDetail/QuantityControl';
import './cart.css';
import { useDispatch, useSelector } from 'react-redux';
import { getCart } from '../../../api/API_Cart';
import LoadingOverlay from '../ActionComponents/LoadingOverlay';

// Hàm định dạng giá
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

// Component giỏ hàng chính
const ShoppingCart = () => {
  const account = useSelector((state) => state.auth?.account);
  const accessToken = account?.accessToken;
  const initialCart = useSelector((state) => state.cart?.cart);
  const [cartItems, setCartItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");


  const navigate = useNavigate();
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
        item?.product && item.product._id === productId
          ? { ...item, quantity: newQuantity, priceTotal: item.product.price * newQuantity }
          : item
      )
    );
  };

  const handleRemoveItem = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item?.product && item.product._id !== productId));
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
      setCheckedItems(cartItems?.map(item => item?.product?._id).filter(Boolean));
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

  // Tính tổng tiền cho các sản phẩm được chọn
  const totalPrice = cartItems?.filter(item => 
    item?.product && checkedItems.includes(item.product._id)
  ).reduce((total, item) => total + (item.quantity * item.product.price), 0) || 0;

  // Tính số lượng sản phẩm được chọn
  const totalQuantity = checkedItems.length;

  const handleOrderSubmit = async () => {
    if (checkedItems.length === 0) {
      alert('Bạn chưa chọn sản phẩm nào.');
      return;
    }
    
    try {
      const selectedItems = cartItems?.filter(item => 
        item?.product && checkedItems.includes(item.product._id)
      );
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

  const rowSelection = {
    selectedRowKeys: checkedItems,
    onChange: (selectedRowKeys) => {
      setCheckedItems(selectedRowKeys);
    },
  };

  const columns = [
    {
      dataIndex: ['product', 'images', 0, 'url'],
      key: 'image',
      render: (url) => (
        <div style={{ border: '1px solid #ccc', borderRadius: 5, padding: '2px', display: 'inline-block' }}>
          <img src={url} alt="Product" style={{ width: '50px', height: '50px' }} />
        </div>
      ),
      align: 'center'

    },
    {
      title: 'Tên sản phẩm',
      dataIndex: ['product', 'product_name'],
      key: 'product_name',
    },
    {
      title: 'Giá',
      dataIndex: ['product', 'price'],
      key: 'price',
      render: (price) => formatPrice(price),
      align: 'center'

    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity, record) => (
        <QuantityControl 
          initialQuantity={quantity}
          onQuantityChange={(newQuantity) => handleQuantityChange(record.product._id, newQuantity)}
        />
      ),
      align: 'center'
    },
    {
      title: 'Tổng tiền',
      key: 'totalPrice',
      render: (_, record) => formatPrice(record.quantity * record.product.price),
      align: 'center'

    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="link" 
          icon={<Trash2 />} 
          onClick={() => handleRemoveItem(record.product._id)}
        />
      ),
      align: 'center'

    },
  ];

  return (
    <div className="cart-container">
      
      <div className="cart-header">
        <h2>
          <CartIcon size={32} />
          Giỏ Hàng
        </h2>
      </div>

      <div className='cart-content'>
        <Card className='cart-table'>
          <Table
            rowSelection={{
              type: 'checkbox',
              ...rowSelection,
            }}
            columns={columns}
            dataSource={cartItems}
            pagination={false} // Loại bỏ phân trang
            rowKey={record => record.product._id} // Thêm rowKey để đảm bảo mỗi hàng có một key duy nhất
          />
        </Card>
        <div className='cart-bill'>
          <h3>Thông tin thanh toán</h3>
          <div className='billing-details'>
            <div className='billing-item'>
              <span className='billing-label'>Giá tiền:</span>
              <span className='billing-value'>{formatPrice(totalPrice)}</span>
            </div>
            <div className='billing-item'>
              <span className='billing-label'>Giảm giá:</span>
              <span className='billing-value'>{formatPrice(0)} {/* Thay đổi theo logic giảm giá */}</span>
            </div>
            <div className='billing-item'>
              <span className='billing-label'>Số lượng:</span>
              <span className='billing-value'>{totalQuantity}</span>
            </div>
            <div className='billing-item'>
              <span className='billing-label'>Tổng cộng:</span>
              <span className='billing-value'>{formatPrice(totalPrice)}</span>
            </div>
          </div>
          <Button type="primary" onClick={handleOrderSubmit} className="order-button">
            Đặt hàng
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
