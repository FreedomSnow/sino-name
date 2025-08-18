import { useState, useEffect, useCallback, useTransition } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  });
  const [isPending, startTransition] = useTransition();

  // 安全的导航函数
  const safeNavigate = (url: string) => {
    startTransition(() => {
      window.location.href = url;
    });
  };

  // 检查用户会话
  const checkAuth = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await fetch('/api/auth/user');
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setAuthState({
            user: data.user,
            loading: false,
            error: null
          });
          return;
        }
      }
      
      // 如果没有有效的会话，清除状态
      setAuthState({
        user: null,
        loading: false,
        error: null
      });
      
    } catch (error) {
      console.error('检查认证状态失败:', error);
      setAuthState({
        user: null,
        loading: false,
        error: '检查认证状态失败'
      });
    }
  }, []);

  // 登录
  const login = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await fetch('/api/auth/signin/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.redirectUrl) {
          // 重定向到Google OAuth
          safeNavigate(data.redirectUrl);
          return;
        }
      }
      
      throw new Error('登录请求失败');
      
    } catch (error) {
      console.error('登录失败:', error);
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : '登录失败'
      }));
    }
  }, []);

  // 登出
  const logout = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        setAuthState({
          user: null,
          loading: false,
          error: null
        });
      } else {
        throw new Error('登出失败');
      }
      
    } catch (error) {
      console.error('登出失败:', error);
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : '登出失败'
      }));
    }
  }, []);

  // 刷新用户信息
  const refreshUser = useCallback(async () => {
    await checkAuth();
  }, [checkAuth]);

  // 初始化时检查认证状态
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // 定期检查认证状态（每5分钟）
  useEffect(() => {
    const interval = setInterval(() => {
      if (authState.user) {
        checkAuth();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [authState.user, checkAuth]);

  return {
    ...authState,
    login,
    logout,
    refreshUser,
    isAuthenticated: !!authState.user,
    isPending
  };
};
