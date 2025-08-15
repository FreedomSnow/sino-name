'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import './OAuthSuccess.css';

interface UserInfo {
  id: string;
  name: string;
  email: string;
  image?: string;
}

interface OAuthSuccessProps {
  searchParams: {
    temp_token_id?: string;
    user_id?: string;
  };
}

const OAuthSuccess: React.FC<OAuthSuccessProps> = ({ searchParams }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const handleOAuthSuccess = async () => {
      try {
        const { temp_token_id, user_id } = searchParams;
        
        if (!temp_token_id || !user_id) {
          setError(t('missing_parameters'));
          setIsLoading(false);
          return;
        }

        // 验证临时令牌和用户ID
        const response = await fetch('/api/auth/oauth-success', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            temp_token_id,
            user_id: parseInt(user_id),
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setUserInfo(data.user);
          setIsSuccess(true);
        } else {
          const errorData = await response.json();
          setError(errorData.message || t('verification_failed'));
        }
      } catch (err) {
        setError(t('processing_error'));
      } finally {
        setIsLoading(false);
      }
    };

    handleOAuthSuccess();
  }, [searchParams, t]);

  if (isLoading) {
    return (
      <div className="oauth-success-container">
        <div className="loading-content">
          <Image 
            src="/panda-loading.gif" 
            alt={t('loading')} 
            width={80} 
            height={80} 
            className="loading-icon"
          />
          <p className="loading-text">{t('verifying_login')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="oauth-success-container">
        <div className="error-content">
          <Image 
            src="/close.svg" 
            alt={t('error')} 
            width={64} 
            height={64} 
            className="error-icon"
          />
          <h2 className="error-title">{t('login_failed')}</h2>
          <p className="error-message">{error}</p>
          <button 
            className="retry-button"
            onClick={() => window.location.href = '/'}
          >
            {t('back_to_home')}
          </button>
        </div>
      </div>
    );
  }

  if (isSuccess && userInfo) {
    return (
      <div className="oauth-success-container">
        <div className="success-content">
          <Image 
            src="/success.gif" 
            alt={t('success')} 
            width={80} 
            height={80} 
            className="success-icon"
          />
          <h2 className="success-title">{t('login_successful')}</h2>
          <div className="user-info">
            {userInfo.image && (
              <Image 
                src={userInfo.image} 
                alt={t('user_avatar')} 
                width={60} 
                height={60} 
                className="user-avatar"
              />
            )}
            <div className="user-details">
              <p className="user-name">{t('welcome')}, {userInfo.name}！</p>
              <p className="user-email">{userInfo.email}</p>
            </div>
          </div>
          <p className="success-message">{t('google_login_success')}</p>
          <button 
            className="continue-button"
            onClick={() => window.location.href = '/'}
          >
            {t('continue_using')}
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default OAuthSuccess;
