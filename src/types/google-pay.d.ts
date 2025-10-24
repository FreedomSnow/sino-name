export interface PaymentMethodSpecification {
  type: string;
  parameters: Record<string, unknown>;
  tokenizationSpecification: {
    type: string;
    parameters: Record<string, unknown>;
  };
}

export interface MerchantInfo {
  merchantId: string;
  merchantName: string;
}

export interface TransactionInfo {
  totalPriceStatus: string;
  totalPrice: string;
  currencyCode: string;
  displayItems?: Array<{
    label: string;
    type: string;
    price: string;
  }>;
}

export interface PaymentData {
  paymentMethodData: {
    type: string;
    info: Record<string, unknown>;
    tokenizationData: {
      type: string;
      token: string;
    };
  };
}

export interface PaymentDataRequest {
  apiVersion: number;
  apiVersionMinor: number;
  allowedPaymentMethods: PaymentMethodSpecification[];
  merchantInfo: MerchantInfo;
  transactionInfo: TransactionInfo;
}

export interface GooglePaymentsClient {
  isReadyToPay(request: {
    apiVersion: number;
    apiVersionMinor: number;
    allowedPaymentMethods: PaymentMethodSpecification[];
  }): Promise<{ result: boolean }>;
  createButton(options: {
    onClick: () => void;
    buttonColor?: 'default' | 'black' | 'white';
    buttonType?: 'buy' | 'book' | 'checkout' | 'donate' | 'order' | 'pay' | 'plain' | 'subscribe';
    buttonSizeMode?: 'static' | 'fill';
  }): HTMLElement;
  loadPaymentData(request: PaymentDataRequest): Promise<PaymentData>;
}

export interface GooglePayAPI {
  PaymentsClient: new (environment: string) => GooglePaymentsClient;
}

interface GooglePayError {
  statusCode?: string;
  statusMessage?: string;
}

declare global {
  interface Window {
    googlePay?: {
      payments: {
        api: GooglePayAPI;
      };
    };
  }
}