import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
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
    error: null,
  });

  // 获取当前用户信息
  const fetchUser = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await fetch('/api/auth/user');
      
      if (response.ok) {
        const data = await response.json();
        setAuthState({
          user: data.user,
          loading: false,
          error: null,
        });
      } else {
        setAuthState({
          user: null,
          loading: false,
          error: '未登录',
        });
      }
    } catch (error) {
      setAuthState({
        user: null,
        loading: false,
        error: '获取用户信息失败',
      });
    }
  };

  // 登出
  const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      if (response.ok) {
        setAuthState({
          user: null,
          loading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  // 组件挂载时获取用户信息
  useEffect(() => {
    fetchUser();
  }, []);

  return {
    ...authState,
    logout,
    refetch: fetchUser,
  };
};
