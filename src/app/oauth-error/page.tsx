'use client';

import React, { useEffect, useState, useTransition, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import './OAuthError.css';

interface OAuthErrorProps {
  searchParams: Promise<{
    error?: string;
    error_description?: string;
    state?: string;
  }>;
}

interface ErrorDetails {
  error: string;
  message: string;
  timestamp: number;
  suggestions?: string[];
}

const OAuthError: React.FC<OAuthErrorProps> = ({ searchParams }) => {
  const { t, ready } = useTranslation();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorInfo, setErrorInfo] = useState<{
    error: string;
    error_description: string;
    state?: string;
  } | null>(null);
  const [countdown, setCountdown] = useState(10);
  const [errorDetails, setErrorDetails] = useState<ErrorDetails | null>(null);
  const [loadingError, setLoadingError] = useState(false);

  // 安全的导航函数
  const safeNavigate = useCallback((path: string) => {
    startTransition(() => {
      router.push(path);
    });
  }, [startTransition]);

  // 获取错误详情
  const fetchErrorDetails = useCallback(async () => {
    if (!errorInfo) return;
    
    setLoadingError(true);
    try {
      // 调用后端错误信息API
      const response = await fetch(`/api/auth/oauth-error?error=${errorInfo.error}&message=${encodeURIComponent(errorInfo.error_description)}`);
      if (response.ok) {
        const data = await response.json();
        setErrorDetails(data.error);
      }
    } catch (err) {
      console.error('获取错误详情失败:', err);
    } finally {
      setLoadingError(false);
    }
  }, [errorInfo]);

  useEffect(() => {
    // 解析searchParams Promise
    const resolveParams = async () => {
      try {
        const params = await searchParams;
        setErrorInfo({
          error: params.error || 'unknown_error',
          error_description: params.error_description || '未知错误',
          state: params.state
        });
      } catch (err) {
        console.error('解析searchParams失败:', err);
        setErrorInfo({
          error: 'parse_error',
          error_description: '参数解析失败'
        });
      }
    };
    
    resolveParams();
  }, [searchParams]);

  useEffect(() => {
    // 10秒后自动跳转到首页
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          safeNavigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [safeNavigate]);

  useEffect(() => {
    if (errorInfo) {
      fetchErrorDetails();
    }
  }, [errorInfo, fetchErrorDetails]);

  // 等待国际化准备完成，避免水合问题
  if (!ready || !errorInfo) {
    return (
      <div className="oauth-error-container">
        <div className="loading-content">
          <Image 
            src="/panda-loading.gif" 
            alt="Loading" 
            width={80} 
            height={80} 
            className="loading-icon"
            unoptimized
          />
          <p className="loading-text">Loading...</p>
        </div>
      </div>
    );
  }

  // 错误信息映射（作为后备）
  const getErrorMessage = (error: string) => {
    const errorMap: Record<string, string> = {
      'access_denied': '用户拒绝了授权请求',
      'invalid_request': '请求参数无效',
      'unauthorized_client': '客户端未授权',
      'unsupported_response_type': '不支持的响应类型',
      'invalid_scope': '请求的作用域无效',
      'server_error': '服务器内部错误',
      'temporarily_unavailable': '服务暂时不可用',
      'redirect_uri_mismatch': '重定向URI不匹配',
      'invalid_grant': '授权码无效或已过期',
      'invalid_client': '客户端ID或密钥无效',
      'network_error': '网络连接错误',
      'timeout_error': '请求超时',
      'unknown_error': '未知错误'
    };
    return errorMap[error] || error;
  };

  const getErrorIcon = (error: string) => {
    if (error.includes('network') || error.includes('timeout')) {
      return '/close.svg';
    }
    return '/close.svg';
  };

  // 使用后端API的错误信息，如果没有则使用本地映射
  const displayError = errorDetails?.message || getErrorMessage(errorInfo.error);
  const displaySuggestions = errorDetails?.suggestions || [];

  return (
    <div className="oauth-error-container">
      <div className="error-content">
        <Image 
          src={getErrorIcon(errorInfo.error)} 
          alt={t('error') || 'Error'} 
          width={64} 
          height={64} 
          className="error-icon"
        />
        <h2 className="error-title">{t('oauth_error_title') || 'OAuth Login Failed'}</h2>
        
        <div className="error-details">
          <p className="error-type">
            <strong>{t('error_type') || 'Error Type'}:</strong> {displayError}
          </p>
          {errorInfo.error_description && (
            <p className="error-description">
              <strong>{t('error_details') || 'Error Details'}:</strong> {errorInfo.error_description}
            </p>
          )}
          {errorInfo.state && (
            <p className="error-state">
              <strong>{t('status_code') || 'Status Code'}:</strong> {errorInfo.state}
            </p>
          )}
          {errorDetails?.timestamp && (
            <p className="error-timestamp">
              <strong>{t('timestamp') || 'Timestamp'}:</strong> {new Date(errorDetails.timestamp).toLocaleString()}
            </p>
          )}
        </div>

        <div className="countdown-message">
          {t('redirecting_in_seconds', { seconds: countdown }) || `Redirecting to home page in ${countdown} seconds`}
        </div>

        <div className="action-buttons">
          <button 
            className="retry-button"
            onClick={() => safeNavigate('/login')}
            disabled={isPending}
          >
            {t('retry_login') || 'Retry Login'}
          </button>
          
          <button 
            className="home-button"
            onClick={() => safeNavigate('/')}
            disabled={isPending}
          >
            {t('back_to_home') || 'Back to Home'}
          </button>
        </div>

        {displaySuggestions.length > 0 && (
          <div className="error-help">
            <h3>{t('suggested_solutions') || 'Suggested Solutions:'}</h3>
            <ul>
              {displaySuggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}

        {displaySuggestions.length === 0 && (
          <div className="error-help">
            <h3>{t('common_solutions') || 'Common Solutions:'}</h3>
            <ul>
              <li>{t('check_network_connection') || 'Check network connection'}</li>
              <li>{t('ensure_google_account_available') || 'Ensure Google account is available'}</li>
              <li>{t('clear_browser_cache') || 'Clear browser cache and cookies'}</li>
              <li>{t('contact_support_if_persistent') || 'Contact support if problem persists'}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default OAuthError;
