'use client';

import React, { useState, useEffect } from 'react';
import './OrderPage.css';
import { useTranslation } from 'react-i18next';

interface OrderPageProps {
  isOpen: boolean;
  onClose: () => void;
}

const OrderPage: React.FC<OrderPageProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState(1);
  const [points, setPoints] = useState(10);
  const currency = '$'; // 默认美元符号

  // 根据数量计算积分
  useEffect(() => {
    // 假设 1 美元 = 10 积分
    setPoints(quantity * 10);
  }, [quantity]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    } else {
      setQuantity(1); // 如果输入无效，设置为1
    }
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleBuy = () => {
    // 这里添加购买逻辑
    console.log(`购买 ${quantity} 美元，获得 ${points} 积分`);
    // 可以调用支付API等
  };

  if (!isOpen) return null;

  return (
    <div className="order-page-overlay" onClick={onClose}>
      <div className="order-page-container" onClick={e => e.stopPropagation()}>
        <div className="order-page-header">
          <h2 className="order-page-title">{t('buyPoints', '购买积分')}</h2>
          <button className="order-page-close" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 3.5L3.5 12.5" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3.5 3.5L12.5 12.5" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="order-page-row">
          <div className="order-page-quantity">
            <div className="order-page-input-container">
              <button className="order-page-btn" onClick={decreaseQuantity}>-</button>
              <input
                type="number"
                className="order-page-input"
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
              />
              <button className="order-page-btn" onClick={increaseQuantity}>+</button>
            </div>
            <span className="order-page-currency">{currency}</span>
          </div>
          <div className="order-page-points">
            {points} {t('points', '积分')}
          </div>
        </div>

        <div className="order-page-submit">
          <button className="order-page-buy-btn" onClick={handleBuy}>
            {t('buy', '购买')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
