import React, { useState } from 'react';
import type { FC } from 'react';
import { signIn, useSession } from 'next-auth/react';
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
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  if (!isOpen) return null;

  // 谷歌登录
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await signIn('google', { 
        redirect: false,
        callbackUrl: '/oauth-success?temp_token_id=temp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9) + '&user_id=1'
      });
      
      if (result?.error) {
        // 登录失败，重定向到失败页面
        const errorUrl = `/oauth-failed?error=${encodeURIComponent(result.error)}&error_description=${encodeURIComponent(result.error || '登录失败')}`;
        window.location.href = errorUrl;
        return;
      }
      
      if (result?.ok) {
        // 登录成功后重定向到OAuth成功页面
        const tempTokenId = 'temp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        const redirectUrl = `/oauth-success?temp_token_id=${tempTokenId}&user_id=1`;
        window.location.href = redirectUrl;
      }
    } catch (err) {
      // 发生错误，重定向到失败页面
      const errorUrl = `/oauth-failed?error=network_error&error_description=${encodeURIComponent('网络错误')}`;
      window.location.href = errorUrl;
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
        
        {error && (
          <div className="error-message" style={{ color: 'red', textAlign: 'center', marginBottom: '16px' }}>
            {error}
          </div>
        )}
        
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
