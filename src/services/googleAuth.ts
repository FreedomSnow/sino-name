import { GOOGLE_AUTH_CONFIG } from '@/config/googleAuth';
import { GoogleUser, OAuthTokens } from '@/types/auth';

// Google One Tap 回调响应类型
interface GoogleSignInResponse {
    credential: string;
}

class GoogleAuthService {
    private static instance: GoogleAuthService;
    private currentUser: GoogleUser | null = null;
    private oauthTokens: OAuthTokens | null = null;
    private isAuthenticated: boolean = false;

    private constructor() {}

    public static getInstance(): GoogleAuthService {
        if (!GoogleAuthService.instance) {
            GoogleAuthService.instance = new GoogleAuthService();
        }
        return GoogleAuthService.instance;
    }

    /**
     * 初始化 Google 登录
     */
    public async initialize(): Promise<void> {
        try {
            if (typeof window === 'undefined' || !window.google) {
                throw new Error('Google API 未加载');
            }

            // 初始化 Google Sign-In
            window.google.accounts.id.initialize({
                client_id: GOOGLE_AUTH_CONFIG.GOOGLE.CLIENT_ID,
                callback: this.handleSignInCallback.bind(this),
                auto_select: false,
                cancel_on_tap_outside: true
            });

            // 检查本地存储的认证状态
            this.checkLocalAuthStatus();

            console.log('✅ Google 登录初始化成功');
        } catch (error) {
            console.error('❌ Google 登录初始化失败:', error);
            throw error;
        }
    }

    /**
     * 处理登录回调
     */
    private async handleSignInCallback(response: GoogleSignInResponse) {
        try {
            console.log('🔐 Google 登录成功，开始处理...');
            
            // 解析 JWT ID Token
            const payload = this.parseJwt(response.credential);
            
            // 保存用户信息
            // this.currentUser = {
            //     name: payload.name,
            //     email: payload.email,
            //     sub: payload.sub,
            //     avatar: payload.avatar
            // };
            
            // 与后端认证
            await this.authenticateWithBackend(response.credential);
            
            this.isAuthenticated = true;
            
            // 触发登录成功事件
            window.dispatchEvent(new CustomEvent('google-signin-success', {
                detail: { user: this.currentUser }
            }));
            
        } catch (error) {
            console.error('❌ 处理 Google 登录失败:', error);
            throw error;
        }
    }

    /**
     * 解析 JWT Token
     */
    private parseJwt(token: string): GoogleUser {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (error) {
            throw new Error('JWT 解析失败: ' + error);
        }
    }

    /**
     * 与后端认证
     */
    private async authenticateWithBackend(idToken: string): Promise<void> {
        try {
            // 发送 ID Token 到后端
            const response = await fetch(
                `${GOOGLE_AUTH_CONFIG.BACKEND.BASE_URL}${GOOGLE_AUTH_CONFIG.BACKEND.ENDPOINTS.TOKEN_SIGNIN}`, 
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `idtoken=${encodeURIComponent(idToken)}`
                }
            );

            if (!response.ok) {
                throw new Error('后端认证失败');
            }

            const data = await response.json();
            
            if (data.success) {
                this.oauthTokens = {
                    access_token: data.access_token,
                    refresh_token: data.refresh_token,
                    expires_in: data.expires_in
                };
                
                // 保存认证状态到本地存储
                this.saveAuthState();
            } else {
                throw new Error(data.message || '认证失败');
            }
        } catch (error) {
            console.error('❌ 后端认证失败:', error);
            throw error;
        }
    }

    /**
     * 退出登录
     */
    public async signOut(): Promise<void> {
        try {
            if (!this.currentUser?.email) {
                throw new Error('没有登录用户');
            }

            // 清除 Google 登录状态
            window.google?.accounts.id.disableAutoSelect();
            await window.google?.accounts.id.revoke(this.currentUser.email);

            // 清除本地状态
            this.clearAuthState();
            
            // 触发登出成功事件
            window.dispatchEvent(new Event('google-signout-success'));
            
            console.log('✅ 退出登录成功');
        } catch (error) {
            console.error('❌ 退出登录失败:', error);
            throw error;
        }
    }

    /**
     * 检查本地认证状态
     */
    private checkLocalAuthStatus(): void {
        try {
            const authState = localStorage.getItem('google_auth_state');
            if (authState) {
                const { user, tokens } = JSON.parse(authState);
                this.currentUser = user;
                this.oauthTokens = tokens;
                this.isAuthenticated = true;
            }
        } catch (error) {
            console.error('❌ 检查本地认证状态失败:', error);
            this.clearAuthState();
        }
    }

    /**
     * 保存认证状态到本地存储
     */
    private saveAuthState(): void {
        try {
            const authState = {
                user: this.currentUser,
                tokens: this.oauthTokens
            };
            localStorage.setItem('google_auth_state', JSON.stringify(authState));
        } catch (error) {
            console.error('❌ 保存认证状态失败:', error);
        }
    }

    /**
     * 清除认证状态
     */
    private clearAuthState(): void {
        this.currentUser = null;
        this.oauthTokens = null;
        this.isAuthenticated = false;
        localStorage.removeItem('google_auth_state');
    }

    /**
     * 获取当前用户
     */
    public getCurrentUser(): GoogleUser | null {
        return this.currentUser;
    }

    /**
     * 获取认证状态
     */
    public isUserAuthenticated(): boolean {
        return this.isAuthenticated;
    }

    /**
     * 获取 OAuth 令牌
     */
    public getTokens(): OAuthTokens | null {
        return this.oauthTokens;
    }
}

export const googleAuthService = GoogleAuthService.getInstance();
