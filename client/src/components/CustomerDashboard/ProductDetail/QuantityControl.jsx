import React, { useState, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';

const QuantityControl = ({ initialQuantity, onQuantityChange }) => {
  const [quantity, setQuantity] = useState(initialQuantity || 1);

  useEffect(() => {
    setQuantity(initialQuantity);
  }, [initialQuantity]);

  const handleIncrease = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onQuantityChange(newQuantity);
  };

  const handleDecrease = () => {
    if (quantity > 1) {  // Đảm bảo số lượng không nhỏ hơn 1
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onQuantityChange(newQuantity);
    }
  };

  return (
    <div className="quantity">
      <button className="minus" onClick={handleDecrease}>
        <Minus size={20} />
      </button>
      <div className="quantity-number">{quantity}</div>
      <button className='plus' onClick={handleIncrease}>
        <Plus size={20} />
      </button>
    </div>
  );
};

export default QuantityControl;
