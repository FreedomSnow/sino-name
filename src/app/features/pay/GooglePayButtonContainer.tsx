"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import './GooglePayButtonContainer.css';
import type { GooglePaymentsClient } from '@/types/google';
import { GOOGLE_PAY_CONFIG } from '@/config/googlePayConfig';
import { GOOGLE_PAY_CONSTANTS } from '@/config/googlePayConstants';
import { GooglePayContent } from '@/components/GooglePayContent';
import { createGoogleIsReadyToPayRequestWithPaymentMethods, createGooglePaymentDataRequest, handleGooglePayError, loadGooglePayApi, processGooglePayment } from './utils/GooglePayUtils';

type StatusCallback = (processing: boolean) => void;

interface Props {
  amount: number;
  points?: number;
  currency?: string;
  className?: string;
  onProcessing?: StatusCallback;
  onSuccess?: () => void;
  onCancel?: () => void;
  onError?: (err: Error) => void;
}

const GooglePayButtonContainer: React.FC<Props> = ({
  amount,
  points,
  currency = GOOGLE_PAY_CONFIG.currency,
  className,
  onProcessing,
  onSuccess,
  onCancel,
  onError
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isButtonRendered, setIsButtonRendered] = useState(false); // 🔧 添加按钮渲染状态
  const paymentsClient = useRef<GooglePaymentsClient | null>(null);

  // 🔧 使用 useCallback 来稳定渲染函数
  const renderGooglePayButton = useCallback(() => {
    console.log('🔍 renderGooglePayButton called:', {
      hasContainer: !!containerRef.current,
      hasClient: !!paymentsClient.current,
      isButtonRendered,
      timestamp: new Date().toISOString()
    });

    if (!containerRef.current || !paymentsClient.current || isButtonRendered) {
      console.warn('🔍 Skip rendering - missing requirements or already rendered');
      return;
    }

    try {
      console.log('🔍 Creating Google Pay button...');
      // 清空容器
      containerRef.current.innerHTML = '';

      const button = paymentsClient.current.createButton({
        onClick: handleGooglePayButtonClick,
        buttonColor: GOOGLE_PAY_CONSTANTS.BUTTON_CONFIG.COLOR,
        buttonType: GOOGLE_PAY_CONSTANTS.BUTTON_CONFIG.TYPE,
        buttonSizeMode: GOOGLE_PAY_CONSTANTS.BUTTON_CONFIG.SIZE_MODE
      });

      containerRef.current.appendChild(button);
      setIsButtonRendered(true); // 🔧 标记按钮已渲染
      console.log('🔍 ✅ Google Pay button rendered successfully');
    } catch (err) {
      console.error('🔍 ❌ Failed to render Google Pay button:', err);
      setError('按钮渲染失败');
    }
  }, [isButtonRendered]);

  // 🔧 初始化 Google Pay（只执行一次）
  useEffect(() => {
    let isMounted = true;

    const initializeGooglePay = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setIsButtonRendered(false); // 🔧 重置按钮渲染状态

        console.log('🔍 Loading Google Pay API...');
        await loadGooglePayApi();

        if (!isMounted) {
          console.log('🔍 Component unmounted during API load, returning');
          return;
        }

        if (!window.google?.payments?.api) {
          throw new Error('Google Pay API not available');
        }

        paymentsClient.current = new window.google.payments.api.PaymentsClient({
          environment: GOOGLE_PAY_CONFIG.environment
        });

        const isReadyToPayRequest = createGoogleIsReadyToPayRequestWithPaymentMethods();
        const readyToPayResponse = await paymentsClient.current.isReadyToPay(isReadyToPayRequest);

        if (!isMounted) {
          console.log('🔍 Component unmounted during readyToPay check, returning');
          return;
        }

        if (readyToPayResponse.result) {
          setIsAvailable(true);
          console.log('🔍 ✅ Google Pay is available');
        } else {
          setIsAvailable(false);
          console.warn('🔍 ❌ Google Pay is not available');
        }
      } catch (err) {
        console.error('🔍 ❌ Failed to initialize Google Pay', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : String(err));
          onError?.(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeGooglePay();

    return () => {
      console.log('🔍 Cleanup: setting isMounted to false');
      isMounted = false;
    };
  }, []); // 只在挂载时执行一次

  // 🔧 监听可用性变化，渲染按钮（只执行一次）
  useEffect(() => {
    if (isAvailable && !isLoading && !error && containerRef.current && paymentsClient.current && !isButtonRendered) {
      console.log('🔍 Conditions met, rendering button...');
      // 使用 requestAnimationFrame 确保 DOM 已经更新
      requestAnimationFrame(() => {
        renderGooglePayButton();
      });
    }
  }, [isAvailable, isLoading, error, isButtonRendered, renderGooglePayButton]);

  // 🔧 监听金额变化，重新渲染按钮
  useEffect(() => {
    if (isAvailable && !isLoading && !error && isButtonRendered) {
      console.log('🔍 Amount/currency changed, re-rendering button...');
      setIsButtonRendered(false); // 🔧 重置状态以允许重新渲染
      // 延迟一点以确保状态更新完成
      setTimeout(() => {
        renderGooglePayButton();
      }, 0);
    }
  }, [amount, currency]);

  const handleGooglePayButtonClick = async () => {
    console.log('🔍 Google Pay button clicked at:', new Date().toISOString());

    if (!paymentsClient.current) {
      console.error('❌ Payments client not available');
      return;
    }

    try {
      onProcessing?.(true);

      const paymentDataRequest = createGooglePaymentDataRequest(amount, currency, points);
      console.log('🔧 Payment data request:', paymentDataRequest);

      const paymentData = await paymentsClient.current.loadPaymentData(paymentDataRequest);
      console.log('✅ Payment successful:', paymentData);

      await processGooglePayment(paymentData);
      onSuccess?.();

    } catch (err: unknown) {
      const { isCanceled, errorMessage } = handleGooglePayError(err);

      if (isCanceled) {
        onCancel?.();
        return;
      }

      onError?.(new Error(errorMessage));
    } finally {
      onProcessing?.(false);
    }
  };

  // 🔍 渲染日志
  console.log('🔍 GooglePayButtonContainer render:', {
    isLoading,
    isAvailable,
    error,
    isButtonRendered,
    hasContainer: !!containerRef.current,
    hasClient: !!paymentsClient.current,
    timestamp: new Date().toISOString()
  });

  return (
    <div className={`google-pay-button-container ${className ?? ''}`}>
      <GooglePayContent
        isLoading={isLoading}
        error={error}
        isAvailable={isAvailable}
        containerRef={containerRef}
      />
    </div>
  );
};

export default GooglePayButtonContainer;
