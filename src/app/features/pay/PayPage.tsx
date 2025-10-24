"use client";

import React, { useState, useEffect } from 'react';
import './PayPage.css';
import Image from 'next/image';
import PaypalButtonContainer from './PaypalButtonContainer';
import GooglePayButtonContainer from './GooglePayButtonContainer';
import { useTranslation } from 'react-i18next';
import { PaymentProvider, CURRENT_PAYMENT_PROVIDER } from '@/config/paymentConfig';

const UNIT_PRICE = 0.99;
const UNIT_COUNT = 10;

interface PayPageProps {
  isOpen: boolean;
  onClose: () => void;
}

const PayPage: React.FC<PayPageProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState<number>(UNIT_PRICE);
  const [points, setPoints] = useState<number>(UNIT_COUNT);
  const currency = '$';
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // 🔍 添加组件挂载日志
  useEffect(() => {
    console.log('🔍 PayPage mounted');
    return () => {
      console.log('🔍 PayPage unmounted');
    };
  }, []);

  // 🔍 监听弹窗状态变化
  useEffect(() => {
    console.log('🔍 PayPage isOpen changed:', isOpen);
    if (isOpen) {
      console.log('🔍 PayPage opened with initial state:', {
        quantity,
        points,
        currency,
        paymentProvider: CURRENT_PAYMENT_PROVIDER
      });
    }
  }, [isOpen, quantity, points]);

  useEffect(() => {
    const calculatedPoints = (quantity / UNIT_PRICE) * UNIT_COUNT;
    const roundedPoints = Math.round(calculatedPoints / 10) * 10;
    console.log('🔍 Points calculation:', {
      quantity,
      calculatedPoints,
      roundedPoints,
      oldPoints: points
    });
    setPoints(roundedPoints);
  }, [quantity]);

  // 🔧 添加一个 effect 确保弹窗打开时状态正确
  useEffect(() => {
    if (isOpen && quantity <= 0) {
      console.log('🔍 Resetting quantity to UNIT_PRICE');
      setQuantity(UNIT_PRICE);
    }
  }, [isOpen]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    console.log('🔍 Quantity change input:', { inputValue: e.target.value, parsedValue: value });

    if (!isNaN(value) && value > 0) {
      const newQuantity = Math.round(value * 100) / 100;
      console.log('🔍 Setting new quantity:', newQuantity);
      setQuantity(newQuantity);
    } else {
      console.log('🔍 Invalid input, resetting to UNIT_PRICE');
      setQuantity(UNIT_PRICE);
    }
  };

  const increaseQuantity = () => {
    console.log('🔍 Increase quantity clicked');
    setQuantity((prev) => {
      const newValue = Math.round((prev + UNIT_PRICE) * 100) / 100;
      console.log('🔍 Quantity increased:', { prev, newValue });
      return newValue;
    });
  };

  const decreaseQuantity = () => {
    console.log('🔍 Decrease quantity clicked');
    setQuantity((prev) => {
      const newValue = Math.round(Math.max(prev - UNIT_PRICE, UNIT_PRICE) * 100) / 100;
      console.log('🔍 Quantity decreased:', { prev, newValue });
      return newValue;
    });
  };

  // 🎯 渲染支付按钮的函数 - 根据配置自动选择
  const renderPaymentButton = () => {
    console.log('🔍 renderPaymentButton called with:', {
      quantity,
      points,
      provider: CURRENT_PAYMENT_PROVIDER,
      timestamp: new Date().toISOString()
    });

    const commonProps = {
      amount: quantity,
      points: points,
      onProcessing: (processing: boolean) => {
        console.log('🔍 Payment processing state changed:', processing);
        setPaymentProcessing(processing);
      },
      onSuccess: () => {
        console.log('🔍 Payment success callback triggered');
        setPaymentSuccess(true);
        setTimeout(() => {
          setPaymentSuccess(false);
          onClose();
        }, 2000);
      },
      onError: (err: Error) => {
        console.error('🔍 Payment error callback triggered:', err);
        // 这里可以展示错误提示
      }
    };

    console.log('🔍 Common props for payment button:', commonProps);

    const currentProvider = CURRENT_PAYMENT_PROVIDER as PaymentProvider;
    switch (currentProvider) {
      case PaymentProvider.GOOGLE_PAY:
        console.log('🔍 Rendering GooglePayButtonContainer');
        return <GooglePayButtonContainer {...commonProps} />;
      case PaymentProvider.PAYPAL:
        console.log('🔍 Rendering PaypalButtonContainer');
        return <PaypalButtonContainer {...commonProps} />;
      default:
        console.log('🔍 Rendering default PaypalButtonContainer');
        return <PaypalButtonContainer {...commonProps} />;
    }
  };

  // 🔍 渲染开始日志
  console.log('🔍 PayPage render:', {
    isOpen,
    quantity,
    points,
    paymentProcessing,
    paymentSuccess,
    timestamp: new Date().toISOString()
  });

  // 🔧 使用稳定的条件渲染，避免不必要的重复挂载
  if (!isOpen) {
    console.log('🔍 PayPage not open, returning null');
    return null;
  }

  console.log('🔍 PayPage rendering UI');

  return (
    <div className="order-page-overlay" onClick={onClose}>
      <div className="order-page-container" onClick={(e) => e.stopPropagation()}>
        <div className="order-page-header">
          <h2 className="order-page-title">{t('buyPoints')}</h2>
          <button className="order-page-close" onClick={onClose}>
            <Image src="/close.svg" alt="关闭" className="login-closeIcon" width={24} height={24} />
          </button>
        </div>

        <div className="order-page-row">
          <div className="order-page-quantity">
            <div className="order-page-input-container">
              <button className="order-page-btn" onClick={decreaseQuantity}>
                -
              </button>
              <input
                type="number"
                className="order-page-input"
                value={quantity.toFixed(2)}
                onChange={handleQuantityChange}
                min={UNIT_PRICE}
                step={UNIT_PRICE}
              />
              <button className="order-page-btn" onClick={increaseQuantity}>
                +
              </button>
            </div>
            <span className="order-page-currency">{currency}</span>
          </div>
          <div className="order-page-points">
            {points} {t('points')}
          </div>
        </div>

        <div className="order-page-submit">
          {/* 🔧 使用 key 确保组件稳定性 */}
          <div key={`payment-${quantity}-${points}`}>
            {(() => {
              console.log('🔍 About to render payment button');
              const button = renderPaymentButton();
              console.log('🔍 Payment button rendered:', !!button);
              return button;
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayPage;
