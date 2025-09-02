'use client';

import { useEffect, useRef, useCallback } from 'react';
import { GOOGLE_AUTH_CONFIG } from '@/config/googleAuth';
import { cacheUserAuth } from '@/utils/cacheUserAuth';
import { UserInfo, OAuthTokens } from '@/types/auth';
// 导入已存在的Google类型定义
import '@/types/google'; // 这会引入Google类型定义

// 仅添加自定义的handleGoogleCredentialResponse属性
declare global {
  interface Window {
    handleGoogleCredentialResponse?: (response: { credential: string }) => void;
  }
}

interface GoogleLoginButtonProps {
  onLogin?: (user: UserInfo) => void;
}

export const GoogleLoginButton = ({
  onLogin,
}: GoogleLoginButtonProps = {}) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const scriptLoadingPromise = useRef<Promise<void> | null>(null);

  // 添加自定义 CSS 样式来设置按钮边框颜色
  useEffect(() => {
    if (typeof document !== 'undefined') {
      // 创建自定义样式
      const style = document.createElement('style');
      style.innerHTML = `
        .google-login-button-wrapper .nsm7Bb-HzV7m-LgbsSe {
          border: 1px solid #036aff !important;
          padding: 12px 18px;
          background: #f5f5f5;
          border-radius: 999px;
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, []);

  const loadGoogleScript = useCallback(() => {
    if (scriptLoadingPromise.current) {
      return scriptLoadingPromise.current;
    }

    scriptLoadingPromise.current = new Promise<void>((resolve, reject) => {
      if (window.google) {
        resolve();
        return;
      }

      console.log('正在加载 Google API 脚本...');
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      
      if (existingScript) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('Google API 脚本加载完成');
        resolve();
      };
      
      script.onerror = (error) => {
        console.error('Google API 脚本加载失败:', error);
        scriptLoadingPromise.current = null;
        reject(new Error('Failed to load Google API script'));
      };
      
      document.head.appendChild(script);
    });

    return scriptLoadingPromise.current;
  }, []);

  const renderGoogleButton = useCallback(() => {
    if (!buttonRef.current || !window.google) return;

    try {
      // 添加类型保护
      if (!window.google.accounts?.id) {
        console.error('Google accounts.id API 不可用');
        return;
      }
      
      window.google.accounts.id.renderButton(buttonRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        width: 250
      });
      console.log('Google 登录按钮渲染完成');
    } catch (error) {
      console.error('渲染 Google 登录按钮失败:', error);
    }
  }, []);

  const handleCredentialResponse = useCallback((response: { credential: string }) => {
    try {
      console.log('收到 Google 登录凭证');
      const token = response.credential;
      console.log('Google 登录用户信息token:', token);

      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Google 登录用户信息payload:', payload);

      const user: UserInfo = {
        name: payload.name,
        email: payload.email,
        avatar: payload.avatar,
        provider: payload.provider || 'google',
      };

      // 先触发前端登录成功事件
      const event = new CustomEvent('google-signin-success', {
        detail: { user, credential: token }
      });
      window.dispatchEvent(event);

      // 后端认证
      authenticateWithBackend(token).catch(error => {
        console.error('后端认证失败:', error);
      });
    } catch (error) {
      console.error('处理 Google 登录响应失败:', error);
    }
  }, [onLogin]);

  const authenticateWithBackend = async (credential: string) => {
    try {
      console.log('正在与后端服务验证...');
      const response = await fetch(
        `${GOOGLE_AUTH_CONFIG.BACKEND.BASE_URL}${GOOGLE_AUTH_CONFIG.BACKEND.ENDPOINTS.TOKEN_SIGNIN}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `idtoken=${encodeURIComponent(credential)}`,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('后端验证成功:', data);

      const info = data.data.data
      console.log('后端验证成功, 用户信息:', info);

      // 后端返回结构兼容处理
      const userRaw = info.user;
      const user: UserInfo = {
        name: userRaw?.username || data.google_info?.name || '',
        email: userRaw?.email || '',
        avatar: userRaw?.avatar || data.google_info?.picture || '',
        provider: userRaw?.auth_provider || '',
      };
      const tokens: OAuthTokens = {
        access_token: info.access_token,
        refresh_token: info.refresh_token,
        expires_in: info.expires_in
      };

      // 保存到本地存储
      cacheUserAuth(user, tokens);

      if (onLogin) onLogin(user);

      const event = new CustomEvent('backend-auth-success', { detail: data });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('后端验证失败:', error);
      alert('后端认证失败，请稍后重试');
      const event = new CustomEvent('backend-auth-error', { detail: error });
      window.dispatchEvent(event);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initializeGoogleSignIn = async () => {
      if (!GOOGLE_AUTH_CONFIG.GOOGLE.CLIENT_ID) {
        console.error('Google Client ID 未配置');
        return;
      }

      try {
        await loadGoogleScript();
        
        if (!isMounted || !window.google) return;

        console.log('初始化 Google Sign-In...');
        // 添加类型保护
        if (!window.google.accounts?.id) {
          console.error('Google accounts.id API 不可用');
          return;
        }
        
        window.google.accounts.id.initialize({
          client_id: GOOGLE_AUTH_CONFIG.GOOGLE.CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true
        });

        renderGoogleButton();
      } catch (error) {
        console.error('初始化 Google Sign-In 失败:', error);
      }
    };

    console.log('组件挂载，开始初始化...');
    initializeGoogleSignIn();

    return () => {
      console.log('组件卸载，清理资源...');
      isMounted = false;
      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.cancel();
        } catch (error) {
          console.error('清理 Google Sign-In 失败:', error);
        }
      }
    };
  }, [loadGoogleScript, renderGoogleButton, handleCredentialResponse]);

  // 注册初始回调
  useEffect(() => {
    // 使用已定义的全局接口
    window.handleGoogleCredentialResponse = handleCredentialResponse;
  }, [handleCredentialResponse]);

  return (
    <div ref={buttonRef} className="google-login-button-wrapper"></div>
  );
};
