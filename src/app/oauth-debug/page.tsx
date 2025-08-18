'use client';

import React, { useState, useEffect, useTransition, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface DebugInfo {
  urlParams: Record<string, string>;
  browserInfo: {
    userAgent: string;
    cookiesEnabled: boolean;
    language: string;
    platform: string;
    timestamp: string;
  };
  currentUrl: string;
  referrer: string;
}

const OAuthDebugContent: React.FC = () => {
  const searchParams = useSearchParams();
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    urlParams: {},
    browserInfo: {
      userAgent: '',
      cookiesEnabled: false,
      language: '',
      platform: '',
      timestamp: ''
    },
    currentUrl: '',
    referrer: ''
  });
  const [isPending, startTransition] = useTransition();

  // 安全的导航函数
  const safeNavigate = (url: string) => {
    startTransition(() => {
      window.location.href = url;
    });
  };

  useEffect(() => {
    // 收集URL参数信息
    const params: Record<string, string> = {};
    if (searchParams) {
      searchParams.forEach((value, key) => {
        params[key] = value;
      });
    }

    // 收集浏览器信息
    const browserInfo = {
      userAgent: navigator.userAgent,
      cookiesEnabled: navigator.cookieEnabled,
      language: navigator.language,
      platform: navigator.platform,
      timestamp: new Date().toISOString()
    };

    setDebugInfo({
      urlParams: params,
      browserInfo,
      currentUrl: window.location.href,
      referrer: document.referrer
    });
  }, [searchParams]);

  const testOAuthFlow = () => {
    // 测试OAuth流程 - 使用新的API端点
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
      console.error('OAuth流程启动失败:', error);
    });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">OAuth 调试页面</h1>
      
      <div className="mb-6">
        <button 
          onClick={testOAuthFlow}
          disabled={isPending}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isPending ? '启动中...' : '测试 OAuth 流程'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-3">URL 参数</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(debugInfo.urlParams || {}, null, 2)}
          </pre>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-3">浏览器信息</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(debugInfo.browserInfo || {}, null, 2)}
          </pre>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-3">当前URL</h2>
          <p className="text-sm break-all">{debugInfo.currentUrl || '加载中...'}</p>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-3">来源页面</h2>
          <p className="text-sm break-all">{debugInfo.referrer || '直接访问'}</p>
        </div>
      </div>

      <div className="mt-6 bg-yellow-100 p-4 rounded">
        <h3 className="font-semibold text-yellow-800">调试说明</h3>
        <ul className="text-sm text-yellow-700 mt-2 list-disc list-inside">
          <li>点击&quot;测试 OAuth 流程&quot;按钮开始OAuth登录</li>
          <li>观察URL参数变化，特别是code和state参数</li>
          <li>检查浏览器控制台是否有错误信息</li>
          <li>如果出现PKCE错误，检查NextAuth配置</li>
        </ul>
      </div>
    </div>
  );
};

const OAuthDebug: React.FC = () => {
  return (
    <Suspense fallback={
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">OAuth 调试页面</h1>
        <p>加载中...</p>
      </div>
    }>
      <OAuthDebugContent />
    </Suspense>
  );
};

export default OAuthDebug;
