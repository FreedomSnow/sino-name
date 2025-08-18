'use client';

import React, { useEffect, useState } from 'react';
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
  const [countdown, setCountdown] = useState(10);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

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
    // 10秒后自动跳转到首页
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  // 等待国际化准备完成，避免水合问题
  if (!ready) {
    return (
      <div className="oauth-success-container">
        <div className="loading-content">
          <Image 
            src="/panda-loading.gif" 
            alt="Loading" 
            width={80} 
            height={80} 
            className="loading-icon"
          />
          <p className="loading-text">Loading...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="oauth-success-container">
        <div className="loading-content">
          <Image 
            src="/panda-loading.gif" 
            alt="Loading" 
            width={80} 
            height={80} 
            className="loading-icon"
          />
          <p className="loading-text">加载用户信息中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="oauth-success-container">
      <div className="success-content">
        <Image 
          src="/success.gif" 
          alt="Success" 
          width={80} 
          height={80} 
          className="success-icon"
        />
        
        <div className="success-status">
          {t('verification_successful') || '验证成功'}
        </div>
        
        <h2 className="success-title">{t('oauth_success_title') || 'OAuth登录成功！'}</h2>
        
        <div className="verification-status">
          <Image 
            src="/checked.svg" 
            alt="Verified" 
            width={20} 
            height={20} 
            className="verification-icon"
          />
          <span className="verification-text">
            {t('google_account_verified') || 'Google账号已验证'}
          </span>
        </div>
        
        <div className="success-message">
          {t('oauth_success_message') || '恭喜！您已成功通过Google账号登录。'}
        </div>

        {userInfo && (
          <div className="user-info">
            <h3>用户信息</h3>
            <div className="user-details">
              <div className="user-detail">
                <span className="detail-label">姓名:</span>
                <span className="detail-value">{userInfo.name}</span>
              </div>
              <div className="user-detail">
                <span className="detail-label">邮箱:</span>
                <span className="detail-value">{userInfo.email}</span>
              </div>
              {userInfo.picture && (
                <div className="user-detail">
                  <span className="detail-label">头像:</span>
                  <span className="detail-value">
                    <Image 
                      src={userInfo.picture} 
                      alt="Avatar" 
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
          {t('redirecting_in_seconds', { seconds: countdown }) || `${countdown}秒后自动跳转到首页`}
        </div>

        <div className="action-buttons">
          <button 
            className="continue-button"
            onClick={() => router.push('/')}
          >
            {t('continue_to_app') || '继续使用应用'}
          </button>
          
          <button 
            className="home-button"
            onClick={() => router.push('/')}
          >
            {t('back_to_home') || '返回首页'}
          </button>
        </div>

        <div className="success-features">
          <h3>您现在可以：</h3>
          <ul>
            <li>访问所有受保护的功能</li>
            <li>保存您的个人设置</li>
            <li>使用高级功能</li>
            <li>管理您的账户信息</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OAuthSuccess;
