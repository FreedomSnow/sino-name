'use client';

import React, { useState, useTransition } from 'react';

interface GoogleLoginButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ 
  className = '', 
  children = '使用Google登录' 
}) => {
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  // 安全的导航函数
  const safeNavigate = (url: string) => {
    startTransition(() => {
      window.location.href = url;
    });
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    
    try {
      // 调用新的登录API端点
      const response = await fetch('/api/auth/signin/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.redirectUrl) {
          safeNavigate(data.redirectUrl);
        } else {
          throw new Error('获取授权URL失败');
        }
      } else {
        throw new Error('登录请求失败');
      }
    } catch (err) {
      console.error('登录错误:', err);
      // 发生错误时重定向到失败页面
      safeNavigate('/oauth-failed?error=network_error&error_description=网络错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      disabled={loading || isPending}
      className={`flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed ${className}`}
    >
      <img 
        src="/icon-google.svg" 
        alt="Google" 
        className="w-5 h-5"
      />
      {loading || isPending ? '登录中...' : children}
    </button>
  );
};
