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
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // 谷歌登录 - 使用后端要求的OAuth路径
  const handleGoogleLogin = async () => {
    setLoading(true);
    
    try {
      // 使用后端要求的OAuth路径
      const oauthUrl = '/api/oauth/signin/google';
      const callbackUrl = encodeURIComponent('/oauth-success');
      const fullUrl = `${oauthUrl}?callbackUrl=${callbackUrl}`;
      
      console.log('重定向到OAuth登录:', fullUrl);
      
      // 直接重定向到OAuth登录
      window.location.href = fullUrl;
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
