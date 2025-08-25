interface ButtonConfig {
    type?: 'standard' | 'icon';
    theme?: 'outline' | 'filled_blue' | 'filled_black';
    size?: 'large' | 'medium' | 'small';
    text?: 'signin_with' | 'signup_with';
    shape?: 'rectangular' | 'pill' | 'circle' | 'square';
    logo_alignment?: 'left' | 'center';
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

interface Google {
    accounts: GoogleAccounts;
}

declare global {
    interface Window {
        google?: Google;
    }
}

export {};
