export const GOOGLE_PAY_CONSTANTS = {
  API_VERSION: 2,
  API_VERSION_MINOR: 0,
  SCRIPT_URL: 'https://pay.google.com/gp/p/js/pay.js',
  ALLOWED_AUTH_METHODS: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
  ALLOWED_CARD_NETWORKS: ['AMEX', 'DISCOVER', 'INTERAC', 'JCB', 'MASTERCARD', 'VISA'],
  BUTTON_CONFIG: {
    COLOR: 'default' as const,
    TYPE: 'buy' as const,
    SIZE_MODE: 'fill' as const
  },
  TRANSACTION_STATUS: {
    FINAL: 'FINAL'
  },
  ERROR_CODES: {
    CANCELED: 'CANCELED',
    DEVELOPER_ERROR: 'DEVELOPER_ERROR'
  }
};