"use client";

import React, { useEffect, useRef, useState } from 'react';
import './GooglePayButtonContainer.css';
import type { GooglePaymentsClient } from '@/types/google';
import { GOOGLE_PAY_CONFIG } from '@/config/googlePayConfig';
import { GOOGLE_PAY_CONSTANTS } from '@/config/googlePayConstants';
import { GooglePayContent } from '@/components/GooglePayContent';
import { createGoogleIsReadyToPayRequestWithPaymentMethods, createGooglePaymentDataRequest, handleGooglePayError, loadGooglePayApi, processGooglePayment } from './utils/googlePayUtils';

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
  const paymentsClient = useRef<GooglePaymentsClient | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initializeGooglePay = async () => {
      try {
        setIsLoading(true);
        setError(null);

        await loadGooglePayApi();
        if (!isMounted) return;

        if (!window.google?.payments?.api) {
          throw new Error('Google Pay API not available');
        }

        paymentsClient.current = new window.google.payments.api.PaymentsClient({
          environment: GOOGLE_PAY_CONFIG.environment
        });

        console.log('Google Pay initialized with config:', GOOGLE_PAY_CONFIG);

        const isReadyToPayRequest = createGoogleIsReadyToPayRequestWithPaymentMethods();
        console.log('isReadyToPay request:', isReadyToPayRequest);

        const readyToPayResponse = await paymentsClient.current.isReadyToPay(isReadyToPayRequest);
        console.log('isReadyToPay response:', readyToPayResponse);

        if (!isMounted) return;

        if (readyToPayResponse.result) {
          setIsAvailable(true);
          renderGooglePayButton();
        } else {
          setIsAvailable(false);
        }
      } catch (err) {
        console.error('Failed to initialize Google Pay', err);
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
      isMounted = false;
    };
  }, [amount, currency, onError]);

  const renderGooglePayButton = () => {
    if (!containerRef.current || !paymentsClient.current) return;

    containerRef.current.innerHTML = '';

    const button = paymentsClient.current.createButton({
      onClick: handleGooglePayButtonClick,
      buttonColor: GOOGLE_PAY_CONSTANTS.BUTTON_CONFIG.COLOR,
      buttonType: GOOGLE_PAY_CONSTANTS.BUTTON_CONFIG.TYPE,
      buttonSizeMode: GOOGLE_PAY_CONSTANTS.BUTTON_CONFIG.SIZE_MODE
    });

    containerRef.current.appendChild(button);
  };

  const handleGooglePayButtonClick = async () => {
    console.log('Google Pay button clicked');

    if (!paymentsClient.current) {
      console.error('Payments client not available');
      return;
    }

    try {
      onProcessing?.(true);

      const paymentDataRequest = createGooglePaymentDataRequest(amount, currency, points);
      console.log('Payment data request:', paymentDataRequest);

      const paymentData = await paymentsClient.current.loadPaymentData(paymentDataRequest);
      console.log('Payment successful:', paymentData);

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
