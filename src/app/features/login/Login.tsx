import React, { useState } from 'react';
import type { FC } from 'react';
import { signIn } from 'next-auth/react';
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
  { key: 'apple', label: 'Apple', icon: '/icon-apple.svg' },
];

const Login: FC<LoginProps> = ({ isOpen, onClose, onLogin }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // 社交登录
  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    setLoading(true);
    if (provider === 'google' || provider === 'apple') {
      // 真实三方登录，登录成功后获取用户信息
      const result = await signIn(provider, { redirect: false });
      // 这里假设登录成功后可通过 next-auth session 获取用户信息
      // 你可以根据实际业务调整获取方式
      const res = await fetch('/api/auth/session');
      const session = await res.json();
      let user: UserInfo = {
        name: session?.user?.name || '',
        avatar: session?.user?.image || '',
        email: session?.user?.email || '',
        provider,
        loginTime: Date.now(),
      };
      setLoading(false);
      onLogin(user);
      onClose();
      return;
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
            <img src="/close.svg" alt="关闭" className="login-closeIcon" />
          </button>
        </div>
        <div className="socials">
          {SOCIALS.map(social => (
            <button
              key={social.key}
              className="socialBtn"
              onClick={() => handleSocialLogin(social.key as 'google' | 'apple')}
              disabled={loading}
            >
              <img src={social.icon} alt={social.label} className="socialIcon" />
              {t('login_with', { provider: social.label })}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;
