'use client';

import { useEffect, useRef, useCallback } from 'react';
import { GOOGLE_AUTH_CONFIG } from '@/config/googleAuth';

interface GoogleUser {
  name: string;
  email: string;
  picture?: string;
  sub: string;
}

export const GoogleLoginButton = () => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const scriptLoadingPromise = useRef<Promise<void> | null>(null);

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
      const payload = JSON.parse(atob(token.split('.')[1]));

      const user: GoogleUser = {
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
        sub: payload.sub
      };

      const event = new CustomEvent('google-signin-success', {
        detail: { user, credential: token }
      });
      window.dispatchEvent(event);

      // 后端认证
      authenticateWithBackend(token);
    } catch (error) {
      console.error('处理 Google 登录响应失败:', error);
    }
  }, []);

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

      const event = new CustomEvent('backend-auth-success', { detail: data });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('后端验证失败:', error);
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

  return <div ref={buttonRef} className="login-btn-v2" />;
};
