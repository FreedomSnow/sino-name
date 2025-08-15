'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
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
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const handleOAuthSuccess = async () => {
      try {
        const { temp_token_id, user_id } = searchParams;
        
        if (!temp_token_id || !user_id) {
          setError('缺少必要的参数');
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
          setError(errorData.message || '验证失败');
        }
      } catch (err) {
        setError('处理过程中发生错误');
      } finally {
        setIsLoading(false);
      }
    };

    handleOAuthSuccess();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="oauth-success-container">
        <div className="loading-content">
          <Image 
            src="/panda-loading.gif" 
            alt="加载中" 
            width={80} 
            height={80} 
            className="loading-icon"
          />
          <p className="loading-text">正在验证登录信息...</p>
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
            alt="错误" 
            width={64} 
            height={64} 
            className="error-icon"
          />
          <h2 className="error-title">登录失败</h2>
          <p className="error-message">{error}</p>
          <button 
            className="retry-button"
            onClick={() => window.location.href = '/'}
          >
            返回首页
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
            alt="成功" 
            width={80} 
            height={80} 
            className="success-icon"
          />
          <h2 className="success-title">登录成功！</h2>
          <div className="user-info">
            {userInfo.image && (
              <Image 
                src={userInfo.image} 
                alt="用户头像" 
                width={60} 
                height={60} 
                className="user-avatar"
              />
            )}
            <div className="user-details">
              <p className="user-name">欢迎，{userInfo.name}！</p>
              <p className="user-email">{userInfo.email}</p>
            </div>
          </div>
          <p className="success-message">您已成功使用谷歌账号登录</p>
          <button 
            className="continue-button"
            onClick={() => window.location.href = '/'}
          >
            继续使用
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default OAuthSuccess;
