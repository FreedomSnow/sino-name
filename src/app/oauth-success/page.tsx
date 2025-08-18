'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import './OAuthSuccess.css';

const OAuthSuccess: React.FC = () => {
  const { t, ready } = useTranslation();
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // 5秒后自动跳转到首页
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
        <p className="success-message">{t('welcome_message')}</p>
        <div className="countdown-message">
          {t('redirecting_in_seconds', { seconds: countdown })}
        </div>
        <button 
          className="home-button"
          onClick={() => router.push('/')}
        >
          {t('go_to_home')}
        </button>
      </div>
    </div>
  );
};

export default OAuthSuccess;
