"use client";

import React, { useEffect, useRef } from 'react';
import './PaypalButtonContainer.css';
import { PAYPAL_CONFIG } from '@/config/paypalConfig';

type StatusCallback = (processing: boolean) => void;

interface Props {
  amount: number; // 支付金额
  points?: number; // 可选，购买的积分数量，用于描述
  currency?: string; // 例如 'USD'
  className?: string;
  onProcessing?: StatusCallback;
  onSuccess?: () => void;
  onCancel?: () => void;
  onError?: (err: Error) => void;
}

interface PayPalActions {
  order: {
    create: (orderData: unknown) => Promise<string>;
    capture: () => Promise<Record<string, unknown>>;
  };
}

interface PayPalButtonsConfigLocal {
  style?: Record<string, unknown>;
  createOrder: (data: unknown, actions: PayPalActions) => Promise<string>;
  onApprove: (data: unknown, actions: PayPalActions) => Promise<void>;
  onCancel?: () => void;
  onError?: (err: unknown) => void;
}

declare global {
  interface Window {
    paypal?: {
      Buttons: (config: PayPalButtonsConfigLocal) => {
        render: (container: HTMLElement) => void;
      };
    };
  }
}

// Component: renders PayPal Buttons into an internal container and reports status via callbacks
// Module-level singleton loader for PayPal SDK
// Ensures we only ever append one script and reuse the same promise for subsequent mounts
let _paypalSdkPromise: Promise<void> | null = null;
const loadPayPalSdk = (currencyParam: string) => {
  if (typeof window === 'undefined') return Promise.reject(new Error('window is undefined'));
  if (window.paypal) return Promise.resolve();
  if (_paypalSdkPromise) return _paypalSdkPromise;

  _paypalSdkPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    const scriptSrc = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CONFIG.CLIENT_ID}&currency=${currencyParam}`;
    script.src = scriptSrc;
    script.async = true;
    script.addEventListener('load', () => resolve());
    script.addEventListener('error', () => reject(new Error('Failed to load PayPal SDK')));
    document.body.appendChild(script);
  });

  return _paypalSdkPromise;
};

const PaypalButtonContainer: React.FC<Props> = ({
  amount,
  points,
  currency = PAYPAL_CONFIG.CURRENCY || 'USD',
  className,
  onProcessing,
  onSuccess,
  onCancel,
  onError
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadAndRender = async () => {
      try {
        await loadPayPalSdk(currency);
        if (!isMounted) return;
        renderButtons();
      } catch (err) {
        console.error('Failed to load PayPal SDK', err);
        onError?.(err instanceof Error ? err : new Error(String(err)));
      }
    };

    const renderButtons = () => {
      if (!containerRef.current || !window.paypal) return;

      containerRef.current.innerHTML = '';

      window.paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'paypal'
        },
        createOrder: (_data: unknown, actions: PayPalActions) => {
          return actions.order.create({
            purchase_units: [
              {
                description: points ? `购买${points}积分` : '购买积分',
                amount: {
                  currency_code: currency,
                  value: amount.toFixed(2)
                }
              }
            ]
          });
        },
        onApprove: async (_data: unknown, actions: PayPalActions) => {
          try {
            onProcessing?.(true);
            const orderDetails = await actions.order.capture();
            console.log('PayPal onApprove capture result', orderDetails);
            onSuccess?.();
          } catch (err: unknown) {
            console.error('PayPal capture error', err);
            onError?.(err instanceof Error ? err : new Error(String(err)));
          } finally {
            onProcessing?.(false);
          }
        },
        onCancel: () => {
          onProcessing?.(false);
          onCancel?.();
        },
        onError: (err: unknown) => {
          onProcessing?.(false);
          onError?.(err instanceof Error ? err : new Error(String(err)));
        }
      }).render(containerRef.current);
    };

    loadAndRender();

    return () => {
      isMounted = false;
      // Do NOT remove the script — keep the SDK as a singleton for the app lifetime
    };
  }, [amount, points, currency, onProcessing, onSuccess, onCancel, onError]);

  return (
    <div className={`paypal-button-container ${className ?? ''}`}>
      <div id="paypal-button-container" ref={containerRef} />
    </div>
  );
};

export default PaypalButtonContainer;
