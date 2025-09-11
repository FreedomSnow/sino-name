import { UserInfo, OAuthTokens } from '@/types/auth';
import { CACHE_KEYS } from "@/app/cacheKeys";
import { useState, useEffect } from 'react';

export interface UserAuthCache {
  user: UserInfo;
  tokens: OAuthTokens | null;
  timestamp: number;
}

// 定义监听器类型
export type UserAuthChangeListener = (cache: UserAuthCache | null) => void;

// 存储所有监听器
const listeners: Set<UserAuthChangeListener> = new Set();

export function cacheUserAuth(user: UserInfo, tokens: OAuthTokens | null = null) {
  const cache: UserAuthCache = {
    user,
    tokens,
    timestamp: Date.now(),
  };
  localStorage.setItem(CACHE_KEYS.googleAuth, JSON.stringify(cache));
  
  // 通知所有监听器
  notifyListeners(cache);
}

export function getCachedUserAuth(): UserAuthCache | null {
  const raw = localStorage.getItem(CACHE_KEYS.googleAuth);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserAuthCache;
  } catch {
    return null;
  }
}

export function clearCachedUserAuth() {
  console.log('Clearing cached Auth');
  localStorage.removeItem(CACHE_KEYS.googleAuth);
  
  // 通知所有监听器认证已清除
  notifyListeners(null);
}

// 通知所有监听器
function notifyListeners(cache: UserAuthCache | null) {
  listeners.forEach(listener => {
    try {
      listener(cache);
    } catch (error) {
      console.error('Error in User Auth listener:', error);
    }
  });
}

// 添加监听器
export function addUserAuthListener(listener: UserAuthChangeListener): () => void {
  listeners.add(listener);
  
  // 如果当前有缓存的认证信息，立即通知新监听器
  const currentAuth = getCachedUserAuth();
  if (currentAuth) {
    try {
      listener(currentAuth);
    } catch (error) {
      console.error('Error notifying new listener:', error);
    }
  }
  
  // 返回一个用于移除监听器的函数
  return () => removeUserAuthListener(listener);
}

// 移除监听器
export function removeUserAuthListener(listener: UserAuthChangeListener): void {
  listeners.delete(listener);
}

// React Hook 用于监听用户认证状态变化
export function useUserAuth() {
  const [userAuth, setUserAuth] = useState<UserAuthCache | null>(() => {
    // 只在客户端执行
    if (typeof window !== 'undefined') {
      return getCachedUserAuth();
    }
    return null;
  });

  useEffect(() => {
    // 只在客户端执行
    if (typeof window === 'undefined') return;
    
    // 添加监听器
    const removeListener = addUserAuthListener((cache) => {
      setUserAuth(cache);
    });
    
    // 清理函数
    return removeListener;
  }, []);
  
  return userAuth;
}
