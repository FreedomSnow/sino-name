interface ButtonConfig {
  type?: "standard" | "icon";
  theme?: "outline" | "filled_blue" | "filled_black";
  size?: "large" | "medium" | "small";
  text?: "signin_with" | "signup_with";
  shape?: "rectangular" | "pill" | "circle" | "square";
  logo_alignment?: "left" | "center";
  width?: number;
}

interface GoogleAccountsId {
  initialize: (config: {
    client_id: string;
    callback: (response: { credential: string }) => void;
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
  }) => void;
  prompt: () => void;
  renderButton: (element: HTMLElement, config?: ButtonConfig) => void;
  disableAutoSelect: () => void;
  revoke: (email: string, callback?: () => void) => Promise<void>;
  cancel: () => void;
}

interface GoogleAccounts {
  id: GoogleAccountsId;
}

interface GooglePaymentMethodSpecification {
  type: string;
  parameters: Record<string, unknown>;
  tokenizationSpecification: {
    type: string;
    parameters: Record<string, unknown>;
  };
}

interface GooglePayMerchantInfo {
  merchantId: string;
  merchantName: string;
}

interface GooglePayTransactionInfo {
  totalPriceStatus: string;
  totalPrice: string;
  currencyCode: string;
  countryCode?: string; // 🔧 添加 countryCode
  displayItems?: Array<{
    label: string;
    type: string;
    price: string;
  }>;
}

interface GooglePaymentDataRequest {
  apiVersion: number;
  apiVersionMinor: number;
  allowedPaymentMethods: GooglePaymentMethodSpecification[];
  merchantInfo: GooglePayMerchantInfo;
  transactionInfo: GooglePayTransactionInfo;
}

interface GooglePaymentData {
  paymentMethodData: {
    type: string;
    info: Record<string, unknown>;
    tokenizationData: {
      type: string;
      token: string;
    };
  };
}

interface GooglePaymentsClient {
  isReadyToPay(request: {
    apiVersion: number;
    apiVersionMinor: number;
    allowedPaymentMethods: GooglePaymentMethodSpecification[];
  }): Promise<{ result: boolean }>;
  createButton(options: {
    onClick: () => void;
    buttonColor?: "default" | "black" | "white";
    buttonType?:
      | "buy"
      | "book"
      | "checkout"
      | "donate"
      | "order"
      | "pay"
      | "plain"
      | "subscribe";
    buttonSizeMode?: "static" | "fill";
  }): HTMLElement;
  loadPaymentData(
    request: GooglePaymentDataRequest
  ): Promise<GooglePaymentData>;
}

interface GooglePayments {
  api: {
    PaymentsClient: new (config: {
      environment: string;
    }) => GooglePaymentsClient;
  };
}

interface Google {
  accounts: GoogleAccounts;
  payments: GooglePayments;
}

declare global {
  interface Window {
    google?: Google;
  }
}

export type {
  GooglePaymentMethodSpecification,
  GooglePayMerchantInfo,
  GooglePayTransactionInfo,
  GooglePaymentDataRequest,
  GooglePaymentData,
  GooglePaymentsClient,
};
