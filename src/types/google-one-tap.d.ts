interface GoogleResponse {
  credential: string;
  select_by: string;
}

interface GoogleAccountsId {
  initialize: (config: {
    client_id: string;
    callback: (response: GoogleResponse) => void;
    cancel_on_tap_outside?: boolean;
  }) => void;
  prompt: () => void;
}

interface GoogleAccounts {
  id: GoogleAccountsId;
}

declare global {
  interface Window {
    google?: {
      accounts: GoogleAccounts;
    };
  }
}
