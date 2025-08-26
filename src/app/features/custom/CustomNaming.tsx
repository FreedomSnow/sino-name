import React, { useEffect, useState } from "react";
import { CACHE_KEYS } from "@/app/cacheKeys";
import { useTranslation } from "react-i18next";
import "./CustomNaming.css";
import { getCachedGoogleAuth } from "@/utils/cacheGoogleAuth";
import Login from "../login/Login";
import { GoogleUser } from "@/types/auth";

export default function CustomNaming() {
  const { t } = useTranslation();

  const cache = typeof window !== 'undefined' ? window.localStorage.getItem(CACHE_KEYS.customNamingPage) : null;
  const cacheObj = cache ? JSON.parse(cache) : {};
  const [name, setName] = useState<string>(cacheObj.name ?? "");
  const [desc, setDesc] = useState<string>(cacheObj.desc ?? "");
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState<GoogleUser | null>(null);

  useEffect(() => {
      return () => {
        const cacheData = {
          name,
          desc,
        };
        window.localStorage.setItem(CACHE_KEYS.customNamingPage, JSON.stringify(cacheData));
      };
    }, [name, desc]);
  
  // 初始化时检查登录状态
  useEffect(() => {
    const authCache = getCachedGoogleAuth();
    if (authCache && authCache.user) {
      setUser(authCache.user);
    }
  }, []);
  
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const handleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let value = e.target.value;
    if (value.length > 200) {
      value = value.slice(0, 200);
    }
    setDesc(value);
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  const handleSubmit = () => {
    // 验证名称合法性
    if (!name.trim()) {
      alert(t('nameRequired'));
      return;
    }
    
    // 名称长度检查
    if (name.length < 2 || name.length > 30) {
      alert(t('nameLength'));
      return;
    }
    
    // 检查是否已登录
    const authCache = getCachedGoogleAuth();
    if (!authCache || !authCache.user) {
      // 未登录，显示登录弹窗
      setShowLogin(true);
      return;
    }
    
    // 已登录，继续提交流程
    alert(`提交内容：姓名：${name}，描述：${desc}`);
  };
  
  // 处理登录成功
  const handleLoginSuccess = (loginUser: GoogleUser) => {
    setShowLogin(false);
    // 登录成功后继续提交
    alert(`提交内容：姓名：${name}，描述：${desc}`);
  };

  return (
    <div className="custom-naming-root">
      <h2 className="custom-naming-title">{t('customNamingTitle')}</h2>
      <div className="custom-naming-main">
        {/* 第一行说明 */}
        <div className="custom-naming-tip">
          {t('customNamingTip')}
        </div>
        {/* 第二行姓名输入 */}
        <div className="custom-naming-row custom-naming-row-name">
          <span className="custom-naming-label">{t('fullName')}：</span>
          <input
            type="text"
            className="custom-naming-name-input"
            value={name}
            onChange={handleNameChange}
            placeholder={t('customNamingNamePlaceholder')}
          />
        </div>
        {/* 第三行描述按钮或输入框 */}
        <div className="custom-naming-row custom-naming-row-desc">
          <span className="custom-naming-label">{t('customNamingDesc')}：</span>
          <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
            <textarea
              className="custom-naming-desc-input"
              value={desc}
              onChange={handleDescChange}
              placeholder={t('customNamingDescPlaceholder')}
              rows={1}
              maxLength={200}
            />
            <div className="custom-naming-desc-count">
              {desc.length}/200
            </div>
          </div>
        </div>
        {/* 第四行提交按钮 */}
        <div className="custom-naming-submit-row">
          <button className="custom-naming-submit-btn custom-naming-btn" onClick={handleSubmit}>
            {t('submit')}
          </button>
        </div>
      </div>
      
      {/* 登录弹窗 */}
      {showLogin && (
        <Login 
          isOpen={showLogin} 
          onClose={() => setShowLogin(false)}  
        />
      )}
    </div>
  );
}

