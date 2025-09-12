import React, { useEffect, useState } from "react";
import { CACHE_KEYS } from "@/app/cacheKeys";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import "./CustomNaming.css";
import { getCachedUserAuth } from "@/cache/cacheUserAuth";
import Login from "../login/Login";
import OrderPage from "@/app/features/order/OrderPage";
// 不再需要 UserInfo 类型
import { getFreedomNaming } from "@/services/aiNaming";
import PandaLoadingView from "@/components/PandaLoadingView";
import { NameItem } from "@/types/restRespEntities";
import CustomNameList from "./CustomNameList";
import { HTTP_STATUS } from "@/app/error/errorCodes";

export default function CustomNaming() {
  const { t } = useTranslation();

  const cache = typeof window !== 'undefined' ? window.localStorage.getItem(CACHE_KEYS.customNamingPage) : null;
  const cacheObj = cache ? JSON.parse(cache) : {};
  const [name, setName] = useState<string>(cacheObj.name ?? "");
  const [desc, setDesc] = useState<string>(cacheObj.desc ?? "");
  const [showLogin, setShowLogin] = useState(false);
  const [showOrderPage, setShowOrderPage] = useState(false);
  const [loading, setLoading] = useState(false);
  // 不再使用 user 状态，改为直接从 getCachedUserAuth 获取
  const [namingResults, setNamingResults] = useState<NameItem[]>([]);
  const [showResults, setShowResults] = useState(false);

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
    // 只检查登录状态，不再设置用户信息
    getCachedUserAuth();
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
    console.log('提交自由命名:', { name, desc });
    // 验证名称合法性
    if (!name.trim()) {
      alert(t('name Required'));
      return;
    }
    
    // 名称长度检查
    if (name.length < 2 || name.length > 100) {
      alert(t('name Length'));
      return;
    }
    
    // 隐藏之前的结果
    setShowResults(false);
    setNamingResults([]);
    
    // 检查是否已登录
    const authCache = getCachedUserAuth();
    if (!authCache || !authCache.user) {
      // 未登录，显示登录弹窗
      setShowLogin(true);
      return;
    }

    handleLoginSuccess(true);
  };
  
  // 处理登录成功
  const handleLoginSuccess = (isAiRequest = false) => {
    setShowLogin(false);

    // 已登录，检测是否还有积分
    // 积分不够，则提示充值
    const authCache = getCachedUserAuth();
    if (authCache && authCache.user && authCache.user.points < 1) {
      console.log('积分不够:', authCache.user.points);
      setShowOrderPage(true)
      return;
    }

    // 积分够，则调用ai命名接口
    if (isAiRequest) {
      setLoading(true);
      getFreedomNaming({
        name: name.trim(),
        desc: desc.trim()
      }).then(result => {
        console.log('AI自由命名结果:', result);
        setLoading(false);
        if (result.success && result.names && result.names.length > 0) {
          // 使用API返回的命名数据
          setNamingResults(result.names);
          setShowResults(true);
        } else {
          // 处理错误情况
          console.error(`AI自由命名失败, code: ${result.code}, message: ${result.message}`);
          if (result.code === HTTP_STATUS.UNAUTHORIZED) {
            import('@/services/tokenService').then(({ logout }) => {
              logout();
              alert(t('errorUnauthorized'));
            });
          } else if (result.code === HTTP_STATUS.NOT_ENOUGH_POINTS) {
            // 403错误，显示订单页面
            setShowOrderPage(true);
          } else {
            // 其他错误码
            alert(t('errorNormal'));
          }
        }
      }).catch(error => {
        console.error('AI自由命名错误:', error);
        setLoading(false);
        alert(t('errorNormal'));
      });
    }
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
          <button 
            className="custom-naming-submit-btn custom-naming-btn" 
            onClick={handleSubmit}
            disabled={loading}
          >
            <Image src="/pay.svg" alt="pay" className="custom-naming-btn-icon" width={24} height={24} />
            {t('submit')}
          </button>
        </div>
        
        {/* 命名结果显示行 */}
        {showResults && namingResults.length > 0 && (
          <div className="custom-naming-row custom-naming-row-results">
            <div className="custom-naming-results-inner">
              <CustomNameList items={namingResults} />
            </div>
          </div>
        )}
      </div>
      
      {/* 加载动画 - 全屏显示 */}
      {loading && <PandaLoadingView />}
      
      {/* 登录弹窗 */}
      {showLogin && (
        <Login 
          isOpen={showLogin} 
          onClose={() => {
            setShowLogin(false);
          }} 
          onLogin={() => {
            setTimeout(() => {
              handleLoginSuccess();
            }, 500);
          }} 
        />
      )}
      
      {/* 订单页面 */}
      {showOrderPage && (
        <OrderPage 
          isOpen={showOrderPage} 
          onClose={() => setShowOrderPage(false)}  
        />
      )}
    </div>
  );
}

