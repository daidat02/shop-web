import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const OrderPage = () => {
  const location = useLocation();
  const { items, totalPrice, shippingAddress } = location.state || {};

  const orderData = {
    selectedItems: items.map(item => ({ product: item.product._id })),
    shippingAddress: shippingAddress,  // Bạn có thể thêm địa chỉ giao hàng nếu cần
    totalPrice: totalPrice,            // Tổng giá trị của đơn hàng nếu cần
  };

  if (!items) {
    return <p>Không có đơn hàng nào được chọn.</p>;
  }else{
    console.log(orderData)
  }
  console.log(items)
  return (
    <div>
      <h1>Đơn hàng của bạn</h1>
      <h2>Địa chỉ giao hàng: {shippingAddress}</h2>
      <h3>Tổng cộng: {totalPrice} VND</h3>
      <ul>
        {items.map(item => (
          <li key={item.product._id}>
            {item.product.product_name} - {item.quantity} x {item.product.price} VND
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderPage;
