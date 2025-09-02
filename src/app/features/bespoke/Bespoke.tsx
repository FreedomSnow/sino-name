import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import "./Bespoke.css";
import UserInfoForm from "./UserInfoForm";
import Surname from '../surname/Surname';
import LastNameForm from './LastNameForm';
import SurnameList from './SurnameList';
import CustomNameList from '../custom/CustomNameList';
import { CACHE_KEYS } from "@/app/cacheKeys";
import { getCachedGoogleAuth } from "@/utils/cacheGoogleAuth";
import Login from "../login/Login";
import { SurnameItem, NameItem } from "@/types/restRespEntities";
import { UserInfoData } from "./UserInfoForm";
import { getBespokeNaming } from "@/services/aiNaming";
import PandaLoadingView from "@/components/PandaLoadingView";


export default function BespokePage() {

  const { t } = useTranslation();

  // 页面显示获取缓存
  const cache = typeof window !== 'undefined' ? window.localStorage.getItem(CACHE_KEYS.bespokePage) : null;
  const cacheObj = cache ? JSON.parse(cache) : {};
  const [hasShown, setHasShown] = useState(() => cacheObj.hasShown ?? false);
  const [selectedSurname, setSelectedSurname] = useState<string|null>(cacheObj.selectedSurname ?? null);
  const [isShowBottomBar, setIsShowBottomBar] = useState(cacheObj.isShowBottomBar ?? false);
  const [userSurname, setUserSurname] = useState<string|null>(cacheObj.userSurname ?? null);
  // LastNameForm结果
  const [lastName, setLastName] = useState<string|null>(cacheObj.lastName ?? null);
  const [lastNameResult, setLastNameResult] = useState<SurnameItem[] | null>(cacheObj.lastNameResult ?? null);
  // 记录UserInfoForm的onSubmit中返回的信息
  const [userFormData, setUserFormData] = useState<UserInfoData | null>(cacheObj.userFormData ?? null);
  // 记录从哪个方法调用的setShowLogin
  const [loginSource, setLoginSource] = useState('');
  // 全名结果相关状态
  const [fullNameResults, setFullnameResults] = useState<NameItem[]>(cacheObj.fullNameResults ?? []);
  const [showFullNameResults, setShowFullNameResults] = useState(cacheObj.showFullNameResults ?? false);

  // 页面首次显示时设置 hasShown 为 true
  useEffect(() => {
    if (!hasShown) {
      setHasShown(true);
    }
  }, [hasShown]);

  // 页面卸载时缓存页面数据
  useEffect(() => {
    return () => {
      const cacheData = {
        hasShown,
        selectedSurname,
        isShowBottomBar,
        userSurname,
        lastName,
        lastNameResult,
        userFormData,
        loginSource,
        fullNameResults,
        showFullNameResults
      };
      window.localStorage.setItem(CACHE_KEYS.bespokePage, JSON.stringify(cacheData));
    };
  }, [hasShown, selectedSurname, isShowBottomBar, userSurname, lastName, lastNameResult, userFormData, loginSource, fullNameResults, showFullNameResults]);

  // 聊天动画相关状态
  const [showWelcomeMsg, setShowWelcomeMsg] = useState(false);
  const [showSurnameMsg, setShowSurnameMsg] = useState(false);
  const [showUserSurname, setShowUserSurname] = useState(false);
  const [showNameMsg, setShowNameMsg] = useState(false);
  const [showUserInfoForm, setShowUserInfoForm] = useState(false);
  // LastNameForm弹窗状态
  const [showLastNameForm, setShowLastNameForm] = useState(false);

  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Mike定制按钮点击
  const handleMikePick = () => {
    // 检查是否登录
    const source = 'mikePick';
    setLoginSource(source);
    
    const authCache = getCachedGoogleAuth();
    if (!authCache || !authCache.user || !authCache.tokens) {
      // 未登录，显示登录弹窗
      console.log('用户未登录或token失效');
      setShowLogin(true);
      return;
    }

    setShowLastNameForm(true);
  };

  // Mike定制按钮点击
  const handleSendUserInfo = () => {
    // 验证信息合法性
    if (!userFormData || !userFormData.givenName.trim()) {
      alert(t('userInfoRequired', '用户信息必填'));
      return;
    }

    // 检查是否登录
    // 记录调用来源为 userInfoForm
    const source = 'userInfoForm';
    setLoginSource(source);
    
    const authCache = getCachedGoogleAuth();
    if (!authCache || !authCache.user || !authCache.tokens) {
      // 未登录，显示登录弹窗
      console.log('用户未登录或token失效');
      setShowLogin(true);
      return;
    }

    setShowFullNameResults(false);
    setFullnameResults([]);

    handleLoginSuccess(source);
  };

  // 处理登录成功
  const handleLoginSuccess = (source = loginSource) => {
    setShowLogin(false);
    // 登录成功后判断积分是否够用，如果不够则提示充值
    // TODO: 积分不够，则提示充值

    console.log('登录成功，准备调用AI命名接口，loginSource:', source);
    // 积分够
    if (source === 'mikePick') {
      // 如果是从 MikePick 调用的，则打开 LastNameForm 弹窗
      setShowLastNameForm(true);
    } else if (source === 'userInfoForm') {
      // 如果是从 UserInfoForm 调用的，则调用ai接口
      getNameList();
    }

    setLoginSource('');
  };

  const getNameList = async () => {
    // 调用AI命名接口
    if (userSurname == null || !userFormData) {
      console.error('用户表单数据缺失');
      return;
    }
    
    setLoading(true);
    try {
      // 准备请求参数
      const requestData = {
        surname: userSurname || '',
        givenName: userFormData.givenName,
        gender: userFormData.gender,
        birth: userFormData.birth,
        classicReference: userFormData.classic,
        description: userFormData.note
      };
      
      // 调用接口
      const result = await getBespokeNaming(requestData);
      
      if (result.success && result.names && result.names.length > 0) {
        console.log('获取到AI命名结果:', result.names);
        // TODO: 显示命名结果
        setFullnameResults(result.names);
        setShowFullNameResults(true);
      } else {
        console.error('AI命名失败:', result.message);
        alert(t('namingFailed', '命名失败，请稍后重试'));
      }
    } catch (error) {
      console.error('AI命名请求错误:', error);
      alert(t('namingError', '命名出错，请稍后重试'));
    } finally {
      setLoading(false);
    }
  }

  // 更多按钮弹窗状态
  const [showMorePopup, setShowMorePopup] = useState(false);
  const handleMoreClick = () => setShowMorePopup(true);
  const handleMoreClose = () => setShowMorePopup(false);

  // 发送按钮点击
  const handleSend = () => {
    if (selectedSurname) {
      setUserSurname(selectedSurname);
    }

    setSelectedSurname(selectedSurname);
    setLastName(null);
    setLastNameResult(null);

    setIsShowBottomBar(false);
    setShowUserSurname(false);
    setShowNameMsg(false);
    setShowUserInfoForm(false);
    setTimeout(() => {
      setShowUserSurname(true);
      setTimeout(() => {
        setShowNameMsg(true);
        setTimeout(() => {
          setShowUserInfoForm(true);
        }, 300);
      }, 700);
    }, 0);
  } 

  useEffect(() => {
    setShowWelcomeMsg(false);
    setShowSurnameMsg(false);
    setShowUserSurname(false);
    setShowNameMsg(false);
    setShowUserInfoForm(false);

    console.log('BespokePage, hasShown:', hasShown, ", selectedSurname:", selectedSurname, ", userSurname:", userSurname, ", isShowBottomBar:", isShowBottomBar);
    
    let timeout1 = 1000;
    let timeout2 = 700;
    if (hasShown) {
      timeout1 = 0;
      timeout2 = 0;
    }

    setTimeout(() => {
      setShowWelcomeMsg(true);
      setTimeout(() => {
        setShowSurnameMsg(true);
        setTimeout(() => {
          if (hasShown && userSurname) {
            setShowUserSurname(true);
            setShowNameMsg(true);
            setShowUserInfoForm(true);
          }
        }, timeout2);
      }, timeout1);
    }, 0);
  }, [hasShown, userSurname, isShowBottomBar, selectedSurname]);

  return (
    <div className="bespoke-container">
      <div className="bespoke-panda-fixed">
        <Image src="/panda-chat.gif" alt="panda chat" width={120} height={120} unoptimized />
      </div>
      <h2 className="bespoke-title">{t('bespokeTitle')}</h2>
      <div className="bespoke-chat-area">
        {/* welcome-msg 动画显示 */}
        {showWelcomeMsg && (
          <div
            className="welcome-msg bespoke-chat-left-msg"
            dangerouslySetInnerHTML={{ __html: t("bespokeChatWelcomeMsg").replace(/\n/g, "<br />") }}
          />
        )}
        {/* surname-msg 动画显示 */}
        {showSurnameMsg && (
          <div className="surname-msg bespoke-chat-left-msg">
            <div dangerouslySetInnerHTML={{ __html: t("bespokeChatSurnameMsg").replace(/\n/g, "<br />") }} />
            <div className="bespoke-btn-row">
              <button
                className="bespoke-more-btn"
                onClick={handleMoreClick}
              >
                {t('bespokeMoreSurnames')}
              </button>
              <button
                className="bespoke-mike-pick-btn"
                onClick={handleMikePick}
              >
                {t("bespokeMikeCustom")}
              </button>
            </div>
          </div>
        )}
        {/* LastNameForm弹窗 */}
        {showLastNameForm && (
          <LastNameForm
            onClose={() => setShowLastNameForm(false)}
            onResult={(lastName, items) => {
              setLastName(lastName);
              setLastNameResult(items);
              setShowLastNameForm(false);
              // 可根据需要处理items，比如展示、保存等
              setUserSurname(null);
              setSelectedSurname(null);
              setIsShowBottomBar(false);
            }}
          />
        )}
        {lastName && lastNameResult && (
          <>
            <div
              className="lastname-choose-msg bespoke-chat-left-msg"
              dangerouslySetInnerHTML={{ __html: t("bespokeLastNameChoose", { lastName: lastName }).replace(/\n/g, "<br />") }}
            />
            <div className="surname-list-container">
                <SurnameList
                  items={lastNameResult}
                  selected={ selectedSurname }
                  onSubmit={surname => {
                    if (surname === userSurname) {
                        return;
                    }
                    
                    setUserSurname(surname);
                    setSelectedSurname(surname);
                    setIsShowBottomBar(false)
                  }}
                />
            </div>
          </> 
        )}
        {/* 用户发送的右侧气泡及后续内容动画显示 */}
        {userSurname && (
          <>
            {showUserSurname && (
              <div 
                className="user-surname bespoke-chat-right-msg" 
                style={{ whiteSpace: 'pre-line' }}
                dangerouslySetInnerHTML={{ __html: t('bespokeSelectedSurname', { surname: userSurname }).replace(/\n/g, '<br />') }}
              />
            )}
            {showNameMsg && (
              <div
                className="name-msg bespoke-chat-left-msg"
                style={{ whiteSpace: 'pre-line' }}
                dangerouslySetInnerHTML={{ __html: t('bespokeChatInfoMsg', { surname: userSurname }).replace(/\n/g, '<br />') }}
              />
            )}
            {showUserInfoForm && (
              <div className="user-info-form">
                <UserInfoForm lastName={lastName ?? undefined} onSubmit={(data) => {
                  console.log('UserInfoForm onSubmit data:', data); 
                  setUserFormData(data); 
                  handleSendUserInfo(); 
                }} />
              </div>
            )}
            {showFullNameResults && (
              <div className="full-name-results">
                <CustomNameList items={fullNameResults} />
              </div>
            )}
          </>
        )}
      </div>

      {/* 底部只读输入框和发送按钮 */}
      {isShowBottomBar && selectedSurname && (
        <div className="bespoke-bottom-bar">
          <div
            className="bespoke-bottom-input"
            style={{ whiteSpace: 'pre-line' }}
            dangerouslySetInnerHTML={{ __html: t('bespokeInputSelectedSurnameTip', { surname: selectedSurname }).replace(/\n/g, '<br />') }}
          />
          <button className="bespoke-bottom-send-btn" onClick={handleSend}>{t('submit')}</button>
        </div>
      )}

      {/* 更多弹窗，显示 Surname 页面 */}
      {showMorePopup && (
        <div className="bespoke-more-overlay" onClick={handleMoreClose}>
          <div className="bespoke-more-popup" onClick={e => e.stopPropagation()}>
            {/* 直接复用 Surname 页面组件 */}
            <Surname
              editable={true}
              onSelect={item => {
                if (item) {
                  setSelectedSurname(item.surname);
                  setIsShowBottomBar(true);
                } else {
                  setSelectedSurname(null);
                  setIsShowBottomBar(false);
                }
              }}
              selectedSurname={selectedSurname}
            />
          </div>
        </div>
      )}

      {/* 登录弹窗 */}
      {showLogin && (
        <Login 
          isOpen={showLogin} 
          onClose={() => handleLoginSuccess()}  
        />
      )}

      {loading && <PandaLoadingView />}
    </div>
  );
}
