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
  { key: 'apple', label: 'Apple', icon: '/icon-apple.svg' },
];

const Login: FC<LoginProps> = ({ isOpen, onClose, onLogin }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  if (!isOpen) return null;

  // 社交登录
  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await signIn(provider, { 
        redirect: false,
        callbackUrl: '/'
      });
      
      if (result?.error) {
        setError(`登录失败: ${result.error}`);
        setLoading(false);
        return;
      }
      
      if (result?.ok) {
        // 等待session更新
        setTimeout(async () => {
          try {
            const res = await fetch('/api/auth/session');
            const sessionData = await res.json();
            
            if (sessionData?.user) {
              const user: UserInfo = {
                name: sessionData.user.name || '',
                avatar: sessionData.user.image || '',
                email: sessionData.user.email || '',
                provider,
                loginTime: Date.now(),
              };
              onLogin(user);
              onClose();
            }
          } catch (err) {
            setError('获取用户信息失败');
          } finally {
            setLoading(false);
          }
        }, 1000);
      }
    } catch (err) {
      setError('登录过程中发生错误');
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
              onClick={() => handleSocialLogin(social.key as 'google' | 'apple')}
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
