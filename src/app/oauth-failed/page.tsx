'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import './OAuthFailed.css';

interface OAuthFailedProps {
  searchParams: Promise<{
    error?: string;
    error_description?: string;
  }>;
}

interface ErrorInfo {
  error: string;
  error_description: string;
}

const OAuthFailed: React.FC<OAuthFailedProps> = ({ searchParams }) => {
  const { t, ready } = useTranslation();
  const [resolvedSearchParams, setResolvedSearchParams] = useState<{
    error?: string;
    error_description?: string;
  } | null>(null);
  const [errorInfo, setErrorInfo] = useState<ErrorInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // 安全的导航函数
  const safeNavigate = (url: string) => {
    startTransition(() => {
      window.location.href = url;
    });
  };

  useEffect(() => {
    const resolveParams = async () => {
      try {
        const params = await searchParams;
        setResolvedSearchParams(params);
      } catch (err) {
        console.error('解析searchParams失败:', err);
        setResolvedSearchParams({
          error: 'parse_error',
          error_description: '参数解析失败'
        });
      }
    };
    
    resolveParams();
  }, [searchParams]);

  useEffect(() => {
    const handleOAuthFailed = async () => {
      if (!resolvedSearchParams) return;
      
      const { error, error_description } = resolvedSearchParams;
      
      try {
        // 调用后端错误信息API获取详细信息
        const response = await fetch(`/api/auth/oauth-error?error=${error}&message=${encodeURIComponent(error_description || '')}`);
        
        if (response.ok) {
          const data = await response.json();
          setErrorInfo({
            error: data.error || error,
            error_description: data.error_description || error_description || ''
          });
        } else {
          setErrorInfo({
            error: error || 'unknown_error',
            error_description: error_description || '登录失败'
          });
        }
      } catch (err) {
        setErrorInfo({
          error: 'network_error',
          error_description: '网络错误'
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (resolvedSearchParams) {
      handleOAuthFailed();
    }
  }, [resolvedSearchParams]);

  // 等待国际化准备完成，避免水合问题
  if (!ready) {
    return (
      <div className="oauth-failed-container">
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

  if (isLoading) {
    return (
      <div className="oauth-failed-container">
        <div className="loading-content">
          <Image 
            src="/panda-loading.gif" 
            alt={t('loading')} 
            width={80} 
            height={80} 
            className="loading-icon"
            unoptimized
          />
          <p className="loading-text">{t('processing_error')}</p>
        </div>
      </div>
    );
  }

  if (errorInfo) {
    return (
      <div className="oauth-failed-container">
        <div className="error-content">
          <Image 
            src="/close.svg" 
            alt={t('error')} 
            width={64} 
            height={64} 
            className="error-icon"
          />
          <h2 className="error-title">{t('login_failed')}</h2>
          <div className="error-details">
            <p className="error-code">{t('error_code')}: {errorInfo.error}</p>
            <p className="error-message">{errorInfo.error_description}</p>
          </div>
          <div className="error-actions">
            <button 
              className="retry-button"
              onClick={() => safeNavigate('/')}
              disabled={isPending}
            >
              {t('back_to_home')}
            </button>
            <button 
              className="login-again-button"
              onClick={() => safeNavigate('/login')}
              disabled={isPending}
            >
              {t('try_again')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default OAuthFailed;
