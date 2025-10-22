import { GOOGLE_PAY_CONSTANTS } from "@/config/googlePayConstants";
import { GOOGLE_PAY_CONFIG } from "@/config/googlePayConfig";
import type {
  GooglePaymentDataRequest,
  GooglePaymentMethodSpecification,
  GooglePaymentData,
} from "@/types/google";
import { GooglePayError } from "@/types/google-pay";

let _googlePayApiPromise: Promise<void> | null = null;

export const loadGooglePayApi = (): Promise<void> => {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("window is undefined"));
  }

  if (window.google?.payments?.api) {
    return Promise.resolve();
  }

  if (_googlePayApiPromise) {
    return _googlePayApiPromise;
  }

  _googlePayApiPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = GOOGLE_PAY_CONSTANTS.SCRIPT_URL;
    script.async = true;
    script.addEventListener("load", () => resolve());
    script.addEventListener("error", () =>
      reject(new Error("Failed to load Google Pay API"))
    );
    document.head.appendChild(script);
  });

  return _googlePayApiPromise;
};

export const createGoogleIsReadyToPayRequest = () => {
  return {
    apiVersion: GOOGLE_PAY_CONSTANTS.API_VERSION,
    apiVersionMinor: GOOGLE_PAY_CONSTANTS.API_VERSION_MINOR,
  };
};

export const createGooglePaymentMethods =
  (): GooglePaymentMethodSpecification[] => {
    return [
      {
        type: "CARD",
        parameters: {
          allowedAuthMethods: GOOGLE_PAY_CONSTANTS.ALLOWED_AUTH_METHODS,
          allowedCardNetworks: GOOGLE_PAY_CONSTANTS.ALLOWED_CARD_NETWORKS,
        },
        tokenizationSpecification: {
          type: "PAYMENT_GATEWAY",
          parameters: {
            gateway: GOOGLE_PAY_CONFIG.gateway,
            gatewayMerchantId: GOOGLE_PAY_CONFIG.gatewayMerchantId,
          },
        },
      },
    ];
  };

export const createGoogleIsReadyToPayRequestWithPaymentMethods = () => {
  return {
    ...createGoogleIsReadyToPayRequest(),
    allowedPaymentMethods: createGooglePaymentMethods(),
  };
};

export const createGooglePaymentDataRequest = (
  amount: number,
  currency: string,
  points?: number
): GooglePaymentDataRequest => {
  const request: GooglePaymentDataRequest = {
    ...createGoogleIsReadyToPayRequest(),
    allowedPaymentMethods: createGooglePaymentMethods(),
    merchantInfo: {
      merchantId: GOOGLE_PAY_CONFIG.merchantId,
      merchantName: GOOGLE_PAY_CONFIG.merchantName,
    },
    transactionInfo: {
      totalPriceStatus: GOOGLE_PAY_CONSTANTS.TRANSACTION_STATUS.FINAL,
      totalPrice: amount.toFixed(2),
      currencyCode: currency,
    },
  };

  // 只在有积分信息时才添加 displayItems
  if (points) {
    request.transactionInfo.displayItems = [
      {
        label: `购买${points}积分`,
        type: "LINE_ITEM",
        price: amount.toFixed(2),
      },
    ];
  }

  return request;
};

export const processGooglePayment = (
  paymentData: GooglePaymentData
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
  console.log("Processing payment:", paymentData);

  // 在真实应用中，这里应该发送 paymentData 到后端
  // 参考官方文档: https://developers.google.com/pay/api/web/guides/tutorial#process-payment-data

  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Payment processed successfully");
      resolve(paymentData);
    }, 1000);
  });
};

export const handleGooglePayError = (
  err: unknown
): {
  isCanceled: boolean;
  errorMessage: string;
  errorCode?: string;
} => {
  console.error("Payment failed:", err);

  if (err && typeof err === "object") {
    const error = err as GooglePayError;

    console.error("Error details:", {
      statusCode: error.statusCode,
      statusMessage: error.statusMessage,
    });

    if (error.statusCode === "CANCELED") {
      console.log("User canceled payment");
      return {
        isCanceled: true,
        errorMessage: "User canceled payment",
        errorCode: "CANCELED",
      };
    }

    return {
      isCanceled: false,
      errorMessage: error.statusMessage || "Payment failed",
      errorCode: error.statusCode,
    };
  }

  return {
    isCanceled: false,
    errorMessage: err instanceof Error ? err.message : String(err),
  };
};
