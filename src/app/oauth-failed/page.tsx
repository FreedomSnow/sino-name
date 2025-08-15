'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import './OAuthFailed.css';

interface UserInfo {
  id: string;
  name: string;
  email: string;
  image?: string;
}

interface OAuthFailedProps {
  searchParams: Promise<{
    error?: string;
    error_description?: string;
  }>;
}

const OAuthFailed: React.FC<OAuthFailedProps> = ({ searchParams }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [errorInfo, setErrorInfo] = useState<{
    error: string;
    error_description: string;
  } | null>(null);
  const [resolvedSearchParams, setResolvedSearchParams] = useState<{
    error?: string;
    error_description?: string;
  }>({});

  useEffect(() => {
    // 解析searchParams Promise
    const resolveParams = async () => {
      try {
        const params = await searchParams;
        setResolvedSearchParams(params);
      } catch (err) {
        console.error('解析searchParams失败:', err);
      }
    };
    
    resolveParams();
  }, [searchParams]);

  useEffect(() => {
    const handleOAuthFailed = async () => {
      try {
        const { error, error_description } = resolvedSearchParams;
        
        if (!error) {
          setErrorInfo({
            error: 'unknown_error',
            error_description: '未知错误'
          });
          setIsLoading(false);
          return;
        }

        // 调用失败处理API
        const response = await fetch('/api/auth/oauth-failed', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            error,
            error_description: error_description || '',
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setErrorInfo({
            error: data.error || error,
            error_description: data.error_description || error_description || ''
          });
        } else {
          setErrorInfo({
            error: error,
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
              onClick={() => window.location.href = '/'}
            >
              {t('back_to_home')}
            </button>
            <button 
              className="login-again-button"
              onClick={() => window.location.href = '/login'}
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
