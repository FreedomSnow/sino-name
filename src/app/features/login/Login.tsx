'use client';

import React, { useState, useTransition } from 'react';
import type { FC } from 'react';
import Image from 'next/image';
import './Login.css';
import { useTranslation } from 'react-i18next';
import { GoogleLoginButton } from '@/components/GoogleLoginButton';

interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
}

const SOCIALS = [
  { key: 'google', label: 'Google', icon: '/icon-google.svg' },
];

const Login: FC<LoginProps> = ({ isOpen, onClose }) => {
  const { t, ready } = useTranslation();

  if (!isOpen) return null;

  // 等待国际化准备完成，避免水合问题
  if (!ready) {
    return (
      <div className="login-root" onClick={onClose}>
        <div className="login-container" onClick={e => e.stopPropagation()}>
          <div className="login-header">
            <h2 className="login-title">Loading...</h2>
            <button
              className="login-closeBtn"
              onClick={onClose}
              aria-label="Close"
            >
              <Image src="/close.svg" alt="Close" className="login-closeIcon" width={24} height={24} />
            </button>
          </div>
          
          <div className="socials">
            {SOCIALS.map(social => (
              <button
                key={social.key}
                className="socialBtn"
                disabled={true}
              >
                <Image src={social.icon} alt={social.label} className="socialIcon" width={24} height={24} />
                Loading...
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-root" onClick={onClose}>
      <div className="login-container" onClick={e => e.stopPropagation()}>
        <div className="login-header">
          <h2 className="login-title">{t('login_title')}</h2>
          <button
            className="login-closeBtn"
            onClick={onClose}
            aria-label="关闭"
          >
            <Image src="/close.svg" alt="关闭" className="login-closeIcon" width={24} height={24} />
          </button>
        </div>
        
        <div className="socials">
          {/* {SOCIALS.map(social => (
            <button
              key={social.key}
              className="socialBtn"
              onClick={handleGoogleLogin}
              disabled={loading || isPending}
            >
              <Image src={social.icon} alt={social.label} className="socialIcon" width={24} height={24} />
              {loading || isPending ? '登录中...' : t('login_with', { provider: social.label })}
            </button>
          ))} */}
          
          <div className="google-login-button-container">
            <GoogleLoginButton onLogin={(user) => {
              onClose();
            }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
