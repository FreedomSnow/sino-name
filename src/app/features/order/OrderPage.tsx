'use client';

import React, { useState, useEffect, useRef } from 'react';
import './OrderPage.css';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { PAYPAL_CONFIG } from '@/config/paypalConfig';

const UNIT_PRICE = 0.99;  
const UNIT_COUNT = 10; 

interface OrderPageProps {
  isOpen: boolean;
  onClose: () => void;
}

// PayPal 相关接口定义
interface PayPalButtonsConfig {
  style: {
    layout: 'vertical' | 'horizontal';
    color: 'gold' | 'blue' | 'silver' | 'white' | 'black';
    shape: 'rect' | 'pill';
    label: 'paypal' | 'checkout' | 'buynow' | 'pay';
  };
  createOrder: (data: unknown, actions: PayPalOrderActions) => Promise<string>;
  onApprove: (data: PayPalApproveData, actions: PayPalOrderActions) => Promise<void>;
  onCancel?: () => void;
  onError?: (err: Error) => void;
}

interface PayPalOrderActions {
  order: {
    create: (orderData: PayPalOrderData) => Promise<string>;
    capture: () => Promise<PayPalOrderDetails>;
  };
}

interface PayPalOrderData {
  purchase_units: Array<{
    description: string;
    amount: {
      currency_code: string;
      value: string;
    };
  }>;
}

interface PayPalApproveData {
  orderID: string;
  payerID: string;
  [key: string]: unknown;
}

interface PayPalOrderDetails {
  id: string;
  status: string;
  [key: string]: unknown;
}

// 扩展全局 Window 接口
declare global {
  // 扩展 Window 接口，将 PayPalWindow 合并到全局 Window
  interface Window {
    paypal?: {
      Buttons: (config: PayPalButtonsConfig) => {
        render: (container: HTMLElement) => void;
      };
    }
  }
}

const OrderPage: React.FC<OrderPageProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState(UNIT_PRICE);
  const [points, setPoints] = useState(UNIT_COUNT);
  const currency = '$'; // 默认美元符号
  const paypalButtonRef = useRef<HTMLDivElement>(null);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // 加载PayPal SDK
  useEffect(() => {
    console.log('PayPal配置:', PAYPAL_CONFIG);
    console.log('Client ID:', PAYPAL_CONFIG.CLIENT_ID);
    console.log('Currency:', PAYPAL_CONFIG.CURRENCY);
    
    if (!window.paypal && isOpen) {
      const script = document.createElement('script');
      // 使用沙盒(sandbox)环境，生产环境需要更改为live
      const scriptSrc = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CONFIG.CLIENT_ID}&currency=${PAYPAL_CONFIG.CURRENCY}`;
      console.log('Loading PayPal SDK from:', scriptSrc);
      script.src = scriptSrc;
      script.addEventListener('load', () => setPaypalLoaded(true));
      document.body.appendChild(script);
      
      return () => {
        // 清理
        document.body.removeChild(script);
      };
    } else if (window.paypal) {
      setPaypalLoaded(true);
    }
  }, [isOpen]);

  // 初始化PayPal按钮
  useEffect(() => {
    if (paypalLoaded && window.paypal && paypalButtonRef.current) {
      // 清除之前的按钮
      paypalButtonRef.current.innerHTML = '';
      
      window.paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'paypal'
        },
        
        // 创建订单
        createOrder: (data: unknown, actions: PayPalOrderActions) => {
          return actions.order.create({
            purchase_units: [{
              description: `购买${points}积分`,
              amount: {
                currency_code: 'USD',
                value: quantity.toString()
              }
            }]
          });
        },
        
        // 支付成功处理
        onApprove: async (data: PayPalApproveData, actions: PayPalOrderActions) => {
          setPaymentProcessing(true);
          try {
            const orderDetails = await actions.order.capture();
            console.log('支付成功', orderDetails);
            
            // 调用后端API，增加用户积分
            try {
              // 这里应该调用实际的API来更新用户积分
              // const response = await fetch('/api/add-points', {
              //   method: 'POST',
              //   headers: { 'Content-Type': 'application/json' },
              //   body: JSON.stringify({ 
              //     points: points,
              //     orderId: orderDetails.id,
              //     paymentDetails: orderDetails 
              //   })
              // });
              // const result = await response.json();
              
              setPaymentSuccess(true);
              setTimeout(() => {
                setPaymentProcessing(false);
                setPaymentSuccess(false);
                onClose(); // 关闭支付窗口
              }, 2000);
            } catch (error) {
              console.error('更新积分失败', error);
              setPaymentProcessing(false);
              // 可以添加失败处理逻辑
            }
          } catch (error) {
            console.error('支付过程出错', error);
            setPaymentProcessing(false);
            // 可以添加失败处理逻辑
          }
        },
        
        // 支付取消处理
        onCancel: () => {
          console.log('用户取消了支付');
        },
        
        // 支付错误处理
        onError: (err: Error) => {
          console.error('PayPal支付错误', err);
        }
      }).render(paypalButtonRef.current);
    }
  }, [paypalLoaded, quantity, points, onClose]);

  // 根据数量计算积分
  useEffect(() => {
    // 计算积分并四舍五入到最接近的10的倍数
    const calculatedPoints = (quantity / UNIT_PRICE) * UNIT_COUNT;
    const roundedPoints = Math.round(calculatedPoints / 10) * 10;
    setPoints(roundedPoints);
  }, [quantity]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0) {
      // 将值四舍五入到两位小数
      setQuantity(Math.round(value * 100) / 100);
    } else {
      setQuantity(UNIT_PRICE); // 如果输入无效，设置为0.99
    }
  };

  const increaseQuantity = () => {
    setQuantity(prev => Math.round((prev + UNIT_PRICE) * 100) / 100);
  };

  const decreaseQuantity = () => {
    if (quantity >= UNIT_PRICE) {
      setQuantity(prev => Math.round((prev - UNIT_PRICE) * 100) / 100);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="order-page-overlay" onClick={onClose}>
      <div className="order-page-container" onClick={e => e.stopPropagation()}>
        <div className="order-page-header">
          <h2 className="order-page-title">{t('buyPoints')}</h2>
          <button className="order-page-close" onClick={onClose}>
            <Image src="/close.svg" alt="关闭" className="login-closeIcon" width={24} height={24} />
          </button>
        </div>

        <div className="order-page-row">
          <div className="order-page-quantity">
            <div className="order-page-input-container">
              <button className="order-page-btn" onClick={decreaseQuantity}>-</button>
              <input
                type="number"
                className="order-page-input"
                value={quantity.toFixed(2)}
                onChange={handleQuantityChange}
                min={UNIT_PRICE}
                step={UNIT_PRICE}
              />
              <button className="order-page-btn" onClick={increaseQuantity}>+</button>
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
            <div id="paypal-button-container" ref={paypalButtonRef}></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
