'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useAuth } from '../../hooks/useAuth';

const TestAuthPage: React.FC = () => {
  const { user, loading, error, login, logout } = useAuth();
  const [isPending, startTransition] = useTransition();

  // 安全的导航函数
  const safeNavigate = (url: string) => {
    startTransition(() => {
      window.location.href = url;
    });
  };

  const handleLogin = () => {
    // 调用新的登录API端点
    fetch('/api/auth/signin/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.success && data.redirectUrl) {
        safeNavigate(data.redirectUrl);
      }
    })
    .catch(error => {
      console.error('登录失败:', error);
    });
  };

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">认证测试页面</h1>
        <p>加载中...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">认证测试页面</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          错误: {error}
        </div>
      )}
      
      {user ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <h2 className="font-bold">已登录</h2>
          <p>用户ID: {user.id}</p>
          <p>邮箱: {user.email}</p>
          <p>姓名: {user.name}</p>
          {user.picture && (
            <img src={user.picture} alt="头像" className="w-16 h-16 rounded-full mt-2" />
          )}
        </div>
      ) : (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
          <p>未登录</p>
        </div>
      )}
      
      <div className="space-x-4">
        {!user ? (
          <button
            onClick={handleLogin}
            disabled={isPending}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isPending ? '启动中...' : '使用Google登录'}
          </button>
        ) : (
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            登出
          </button>
        )}
        
        <button
          onClick={() => safeNavigate('/')}
          disabled={isPending}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          返回首页
        </button>
      </div>
      
      <div className="mt-8 bg-gray-100 p-4 rounded">
        <h3 className="font-bold mb-2">API端点测试:</h3>
        <ul className="text-sm space-y-2">
          <li>
            <strong>登录:</strong> 
            <span className="text-gray-500 ml-2">POST /api/auth/signin/google</span>
          </li>
          <li>
            <strong>用户信息:</strong> 
            <span className="text-gray-500 ml-2">GET /api/auth/user</span>
          </li>
          <li>
            <strong>登出:</strong> 
            <span className="text-gray-500 ml-2">POST /api/auth/logout</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default TestAuthPage;
