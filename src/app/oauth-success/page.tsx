'use client';

import React, { useEffect, useState, useTransition, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import './OAuthSuccess.css';

interface OAuthSuccessProps {
  searchParams: Promise<{
    temp_token_id?: string;
    user_id?: string;
    user_info?: string;
  }>;
}

interface UserInfo {
  name: string;
  email: string;
  picture?: string;
  id: string;
}

const OAuthSuccess: React.FC<OAuthSuccessProps> = ({ searchParams }) => {
  const { t, ready } = useTranslation();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [countdown, setCountdown] = useState(10);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // 安全的导航函数
  const safeNavigate = useCallback((path: string) => {
    startTransition(() => {
      router.push(path);
    });
  }, [startTransition]);

  useEffect(() => {
    // 解析searchParams Promise
    const resolveParams = async () => {
      try {
        const params = await searchParams;
        if (params.user_info) {
          try {
            // 解析URL编码的用户信息
            const decodedUserInfo = JSON.parse(decodeURIComponent(params.user_info));
            setUserInfo(decodedUserInfo);
          } catch (err) {
            console.error('解析用户信息失败:', err);
          }
        }
        setLoading(false);
      } catch (err) {
        console.error('解析searchParams失败:', err);
        setLoading(false);
      }
    };
    
    resolveParams();
  }, [searchParams]);

  useEffect(() => {
    // 如果有用户信息，立即跳转（减少等待时间）
    if (userInfo) {
      const timer = setTimeout(() => {
        safeNavigate('/');
      }, 2000); // 2秒后跳转

      return () => clearTimeout(timer);
    } else {
      // 如果没有用户信息，10秒后跳转
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
    }
  }, [userInfo, safeNavigate]);

  // 等待国际化准备完成，避免水合问题
  if (!ready || loading) {
    return (
      <div className="oauth-success-container">
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

  return (
    <div className="oauth-success-container">
      <div className="success-content">
        <Image 
          src="/success.gif" 
          alt={t('success') || 'Success'} 
          width={80} 
          height={80} 
          className="success-icon"
          unoptimized
        />
        
        <div className="success-status">
          {t('verification_successful') || 'Verification Successful'}
        </div>
        
        <h2 className="success-title">{t('oauth_success_title') || 'OAuth Login Successful!'}</h2>
        
        <div className="verification-status">
          <Image 
            src="/checked.svg" 
            alt={t('verification_successful') || 'Verified'} 
            width={20} 
            height={20} 
            className="verification-icon"
          />
          <span className="verification-text">
            {t('google_account_verified') || 'Google Account Verified'}
          </span>
        </div>
        
        <div className="success-message">
          {t('oauth_success_message') || 'Congratulations! You have successfully logged in with your Google account.'}
        </div>

        {userInfo && (
          <div className="user-info">
            <h3>{t('user_information') || 'User Information'}</h3>
            <div className="user-details">
              <div className="user-detail">
                <span className="detail-label">{t('name') || 'Name'}:</span>
                <span className="detail-value">{userInfo.name}</span>
              </div>
              <div className="user-detail">
                <span className="detail-label">{t('email') || 'Email'}:</span>
                <span className="detail-value">{userInfo.email}</span>
              </div>
              {userInfo.picture && (
                <div className="user-detail">
                  <span className="detail-label">{t('avatar') || 'Avatar'}:</span>
                  <span className="detail-value">
                    <Image 
                      src={userInfo.picture} 
                      alt={t('avatar') || 'Avatar'} 
                      width={40} 
                      height={40} 
                      style={{ borderRadius: '50%' }}
                    />
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="countdown-message">
          {t('redirecting_in_seconds', { seconds: countdown }) || `Redirecting to home page in ${countdown} seconds`}
        </div>

        <div className="action-buttons">
          <button 
            className="continue-button"
            onClick={() => safeNavigate('/')}
            disabled={isPending}
          >
            {isPending ? (t('redirecting') || 'Redirecting...') : (t('continue_to_app') || 'Continue to App')}
          </button>
          
          <button 
            className="home-button"
            onClick={() => safeNavigate('/')}
            disabled={isPending}
          >
            {t('back_to_home') || 'Back to Home'}
          </button>
        </div>

        <div className="success-features">
          <h3>{t('what_you_can_do') || 'What you can do now:'}</h3>
          <ul>
            <li>{t('access_protected_features') || 'Access all protected features'}</li>
            <li>{t('save_personal_settings') || 'Save your personal settings'}</li>
            <li>{t('use_advanced_features') || 'Use advanced features'}</li>
            <li>{t('manage_account_info') || 'Manage your account information'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OAuthSuccess;
