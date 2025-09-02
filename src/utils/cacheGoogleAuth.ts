import { UserInfo, OAuthTokens } from '@/types/auth';
import { CACHE_KEYS } from "@/app/cacheKeys";
import React, { useState, useEffect } from 'react';

export interface GoogleAuthCache {
  user: UserInfo;
  tokens: OAuthTokens | null;
  timestamp: number;
}

// 定义监听器类型
export type GoogleAuthChangeListener = (cache: GoogleAuthCache | null) => void;

// 存储所有监听器
const listeners: Set<GoogleAuthChangeListener> = new Set();

export function cacheGoogleAuth(user: UserInfo, tokens: OAuthTokens | null = null) {
  const cache: GoogleAuthCache = {
    user,
    tokens,
    timestamp: Date.now(),
  };
  localStorage.setItem(CACHE_KEYS.googleAuth, JSON.stringify(cache));
  
  // 通知所有监听器
  notifyListeners(cache);
}

export function getCachedGoogleAuth(): GoogleAuthCache | null {
  const raw = localStorage.getItem(CACHE_KEYS.googleAuth);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as GoogleAuthCache;
  } catch {
    return null;
  }
}

export function clearCachedGoogleAuth() {
  localStorage.removeItem(CACHE_KEYS.googleAuth);
  
  // 通知所有监听器认证已清除
  notifyListeners(null);
}

// 通知所有监听器
function notifyListeners(cache: GoogleAuthCache | null) {
  listeners.forEach(listener => {
    try {
      listener(cache);
    } catch (error) {
      console.error('Error in Google Auth listener:', error);
    }
  });
}

// 添加监听器
export function addGoogleAuthListener(listener: GoogleAuthChangeListener): () => void {
  listeners.add(listener);
  
  // 如果当前有缓存的认证信息，立即通知新监听器
  const currentAuth = getCachedGoogleAuth();
  if (currentAuth) {
    try {
      listener(currentAuth);
    } catch (error) {
      console.error('Error notifying new listener:', error);
    }
  }
  
  // 返回一个用于移除监听器的函数
  return () => removeGoogleAuthListener(listener);
}

// 移除监听器
export function removeGoogleAuthListener(listener: GoogleAuthChangeListener): void {
  listeners.delete(listener);
}

// React Hook 用于监听 Google 认证状态变化
export function useGoogleAuth() {
  const [googleAuth, setGoogleAuth] = useState<GoogleAuthCache | null>(() => {
    // 只在客户端执行
    if (typeof window !== 'undefined') {
      return getCachedGoogleAuth();
    }
    return null;
  });

  useEffect(() => {
    // 只在客户端执行
    if (typeof window === 'undefined') return;
    
    // 添加监听器
    const removeListener = addGoogleAuthListener((cache) => {
      setGoogleAuth(cache);
    });
    
    // 清理函数
    return removeListener;
  }, []);
  
  return googleAuth;
}
