import React, { useState } from 'react';
import type { FC } from 'react';
import Image from 'next/image';
import './Login.css';
import { useTranslation } from 'react-i18next';

interface UserInfo {
  name: string;
  avatar: string;
  email: string;
  provider: string;
  loginTime: number;
}

interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserInfo) => void;
}

const SOCIALS = [
  { key: 'google', label: 'Google', icon: '/icon-google.svg' },
];

const Login: FC<LoginProps> = ({ isOpen, onClose, onLogin }) => {
  const { t, ready } = useTranslation();
  const [loading, setLoading] = useState(false);

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

  // 谷歌登录 - 使用新的Google OAuth API
  const handleGoogleLogin = async () => {
    setLoading(true);
    
    try {
      // 直接跳转到我们的Google登录API
      window.location.href = '/api/auth/google/login';
    } catch (err) {
      console.error('登录错误:', err);
      // 发生错误时重定向到失败页面
      window.location.href = '/oauth-failed?error=network_error&error_description=网络错误';
    } finally {
      setLoading(false);
    }
  };

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
          {SOCIALS.map(social => (
            <button
              key={social.key}
              className="socialBtn"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <Image src={social.icon} alt={social.label} className="socialIcon" width={24} height={24} />
              {loading ? '登录中...' : t('login_with', { provider: social.label })}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;
