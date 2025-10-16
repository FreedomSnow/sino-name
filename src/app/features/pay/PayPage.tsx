"use client";

import React, { useState, useEffect } from 'react';
import './PayPage.css';
import Image from 'next/image';
import PaypalButtonContainer from './PaypalButtonContainer';
import { useTranslation } from 'react-i18next';

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

  useEffect(() => {
    const calculatedPoints = (quantity / UNIT_PRICE) * UNIT_COUNT;
    const roundedPoints = Math.round(calculatedPoints / 10) * 10;
    setPoints(roundedPoints);
  }, [quantity]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(Math.round(value * 100) / 100);
    } else {
      setQuantity(UNIT_PRICE);
    }
  };

  const increaseQuantity = () => setQuantity((prev) => Math.round((prev + UNIT_PRICE) * 100) / 100);
  const decreaseQuantity = () => setQuantity((prev) => Math.round(Math.max(prev - UNIT_PRICE, UNIT_PRICE) * 100) / 100);

  if (!isOpen) return null;

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
          {paymentProcessing ? (
            <div className="payment-processing">
              {paymentSuccess ? (
                <div className="payment-success">
                  <img src="/success.gif" alt="支付成功" />
                  <p>{t('paymentSuccess', '支付成功！')}</p>
                </div>
              ) : (
                <div className="payment-loading">
                  <img src="/panda-loading.gif" alt="处理中" />
                  <p>{t('paymentProcessing', '正在处理支付...')}</p>
                </div>
              )}
            </div>
          ) : (
            <PaypalButtonContainer
              amount={quantity}
              points={points}
              onProcessing={(processing) => setPaymentProcessing(processing)}
              onSuccess={() => {
                setPaymentSuccess(true);
                setTimeout(() => {
                  setPaymentSuccess(false);
                  onClose();
                }, 2000);
              }}
              onError={(err) => {
                console.error('PayPal container error', err);
                // 这里可以展示错误提示
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PayPage;
