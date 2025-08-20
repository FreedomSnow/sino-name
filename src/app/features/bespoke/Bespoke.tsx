import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import "./Bespoke.css";
import UserInfoForm from "./UserInfoForm";
import Surname from '../surname/Surname';
import LastNameForm from './LastNameForm';
import { LastNameItem } from "./types";
import SurnameList from './SurnameList';
import { CACHE_KEYS } from "@/app/cacheKeys";


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
  const [lastNameResult, setLastNameResult] = useState<LastNameItem[] | null>(cacheObj.lastNameResult ?? null);

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
      };
      window.localStorage.setItem(CACHE_KEYS.bespokePage, JSON.stringify(cacheData));
    };
  }, [hasShown, selectedSurname, isShowBottomBar, userSurname, lastName, lastNameResult]);

  // 聊天动画相关状态
  const [showWelcomeMsg, setShowWelcomeMsg] = useState(false);
  const [showSurnameMsg, setShowSurnameMsg] = useState(false);
  const [showUserSurname, setShowUserSurname] = useState(false);
  const [showNameMsg, setShowNameMsg] = useState(false);
  const [showUserInfoForm, setShowUserInfoForm] = useState(false);
  // LastNameForm弹窗状态
  const [showLastNameForm, setShowLastNameForm] = useState(false);

  // Mike定制按钮点击
  const handleMikePick = () => {
    setShowLastNameForm(true);
  };

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
                <UserInfoForm lastName={lastName ?? undefined} onSubmit={() => {}} />
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
    </div>
  );
}
