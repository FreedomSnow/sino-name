'use client';

import React, { useState } from 'react';
import type { FC } from 'react';
import Image from 'next/image';
import './UserProfile.css';
import { useTranslation } from 'react-i18next';
import { UserInfo } from '@/types/auth';
import UserAvatarButton from '@/components/UserAvatarButton';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserInfo;
  points?: number;
  onLogout: () => void;
}

const UserProfile: FC<UserProfileProps> = ({ 
  isOpen, 
  onClose, 
  user, 
  points = 0,
  onLogout 
}) => {
  const { t, ready } = useTranslation();

  if (!isOpen) return null;

  // 等待国际化准备完成，避免水合问题
  if (!ready) {
    return (
      <div className="user-profile-root" onClick={onClose}>
        <div className="user-profile-container" onClick={e => e.stopPropagation()}>
          <div className="user-profile-header">
            <h2 className="user-profile-title">Loading...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile-root" onClick={onClose}>
      <div className="user-profile-container" onClick={e => e.stopPropagation()}>
        {/* 第一行：标题和关闭按钮 */}
        <div className="user-profile-header">
          <h2 className="user-profile-title">{t('userProfile')}</h2>
          <button className="user-profile-close-btn" onClick={onClose}>
            <Image 
              src="/close.svg" 
              alt={t('close', '关闭')} 
              width={24} 
              height={24} 
              className="user-profile-close-icon"
            />
          </button>
        </div>
        
        {/* 第二行：头像和姓名 */}
        <div className="user-profile-avatar-section">
          <div style={{ marginBottom: '10px' }}>
            <UserAvatarButton 
              user={user} 
              size={80}
            />
          </div>
          <div className="user-profile-name">
            {user.name}
          </div>
        </div>
        
        {/* 第三行和第四行：邮箱和积分 */}
        <div className="user-profile-info-section">
          {/* 邮箱 */}
          <div className="user-profile-info-item">
            <span className="user-profile-info-label">{t('email')}</span>
            <span className="user-profile-info-value">{user.email}</span>
          </div>
          
          {/* 积分 */}
          <div className="user-profile-info-item">
            <span className="user-profile-info-label">{t('points')}</span>
            <div className="user-profile-points">
              <span className="user-profile-points-value">{points}</span>
              <span className="user-profile-points-label">{t('pointsUnit')}</span>
            </div>
          </div>
        </div>
        
        {/* 最下边：退出按钮 */}
        <div className="user-profile-logout-section">
          <button 
            className="user-profile-logout-btn" 
            onClick={(e) => {
              e.stopPropagation();
              onLogout();
            }}
          >
            {t('logout')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
