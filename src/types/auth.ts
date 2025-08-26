// 用户信息类型
export interface GoogleUser {
    id?: string;
    sub?: string;
    name: string;
    email: string;
    picture?: string;
}

// OAuth 令牌类型
export interface OAuthTokens {
    access_token: string;
    refresh_token: string;
    expires_in: number;
}

// 认证状态类型
export interface AuthState {
    isAuthenticated: boolean;
    user: GoogleUser | null;
    tokens: OAuthTokens | null;
}
