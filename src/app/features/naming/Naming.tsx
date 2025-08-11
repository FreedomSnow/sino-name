import React, { useEffect, useRef, useState } from "react";

// 全局刷新或重新进入网站时清空 Naming 页面缓存（无论当前tab是否显示）
if (typeof window !== 'undefined') {
  let navType: string | number | undefined;
  const navEntries = window.performance?.getEntriesByType?.('navigation');
  if (navEntries && navEntries.length > 0) {
    navType = (navEntries[0] as any).type;
  } else if (window.performance?.navigation) {
    navType = window.performance.navigation.type;
  }
  if (navType === 'reload' || navType === 1 || navType === 'navigate') {
    console.log('Clearing Naming page cache on reload or navigation');
    window.localStorage.removeItem('selectedSurname');
    window.localStorage.removeItem('namingPageCache');
    window.localStorage.removeItem('userInfoFormCache');
  }
}

import { useTranslation } from "react-i18next";
import "./Naming.css";
import UserInfoForm from "./UserInfoForm";
import Surname from '../surname/Surname';

export default function NamingPage({ onBack }: { onBack?: () => void }) {
  const commonSurnames = [
    '王', '李', '赵', '吴', '周', '郑', '冯', '陈', '卫', '许',
    '何', '吕', '孙', '林', '叶', '宋', '杨', '朱', '张', '洪'
  ];

  // ...existing code...
  const { t } = useTranslation();

  const [activeSurname, setActiveSurname] = useState<string|null>(null);

  // 页面显示记录缓存
  const cache = typeof window !== 'undefined' ? window.localStorage.getItem('namingPageCache') : null;
  const cacheObj = cache ? JSON.parse(cache) : {};
  const [selectedSurname, setSelectedSurname] = useState<string|null>(cacheObj.selectedSurname ?? null);
  const [isShowBottomBar, setIsShowBottomBar] = useState(cacheObj.isShowBottomBar ?? false);
  const [userSurname, setUserSurname] = useState<string|null>(cacheObj.userSurname ?? null);
  const [hasShown, setHasShown] = useState(() => cacheObj.hasShown ?? false);
  // 页面首次显示时设置 hasShown 为 true
  useEffect(() => {
    if (!hasShown) {
      setHasShown(true);
    }
  }, []);

  // 页面卸载时缓存页面数据，包括 hasShown
  useEffect(() => {
    return () => {
      const cacheData = {
        hasShown,
        selectedSurname,
        isShowBottomBar,
        userSurname,
      };
      window.localStorage.setItem('namingPageCache', JSON.stringify(cacheData));
    };
  }, [hasShown, selectedSurname, isShowBottomBar, userSurname]);

  // 聊天动画相关状态
  const [showWelcomeMsg, setShowWelcomeMsg] = useState(false);
  const [showSurnameMsg, setShowSurnameMsg] = useState(false);
  const [showSurnamesGrid, setShowSurnamesGrid] = useState(false);
  const [showUserSurname, setShowUserSurname] = useState(false);
  const [showNameMsg, setShowNameMsg] = useState(false);
  const [showUserInfoForm, setShowUserInfoForm] = useState(false);
  
  // Mike定制按钮点击
  const handleMikePick = () => {
    if (commonSurnames.length > 0) {
      const idx = Math.floor(Math.random() * commonSurnames.length);
      const surname = commonSurnames[idx];
      setSelectedSurname(surname);
      setActiveSurname(surname);
      setIsShowBottomBar(true);
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
      // setSelectedSurname(null);
    }
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

  const writerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (activeSurname) {
      setTimeout(() => {
        if (writerRef.current) {
          import('hanzi-writer').then(HanziWriter => {
            writerRef.current!.innerHTML = '';
            HanziWriter.default.create(writerRef.current!, activeSurname, {
              width: 120,
              height: 120,
              padding: 8,
              showOutline: true,
              showCharacter: false,
              strokeAnimationSpeed: 1.1,
              delayBetweenStrokes: 180,
              radicalColor: '#036aff',
              strokeColor: '#036aff',
              outlineColor: '#b3d1ff',
              drawingColor: '#036aff',
              highlightOnComplete: false,
              strokeFadeDuration: 0,
            }).animateCharacter();
          });
        }
      }, 0);
    }
  }, [activeSurname]);

  useEffect(() => {
    setShowWelcomeMsg(false);
    setShowSurnameMsg(false);
    setShowSurnamesGrid(false);
    setShowUserSurname(false);
    setShowNameMsg(false);
    setShowUserInfoForm(false);

    console.log('NamingPage, hasShown:', hasShown, ", selectedSurname:", selectedSurname, ", userSurname:", userSurname, ", isShowBottomBar:", isShowBottomBar);
    
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
          setShowSurnamesGrid(true);
          if (hasShown && userSurname) {
            setShowUserSurname(true);
            setShowNameMsg(true);
            setShowUserInfoForm(true);
          }
        }, timeout2);
      }, timeout1);
    }, 0);
  }, []);

  // 处理姓氏单元格点击事件
  const handleCellClick = (surname: string) => {
    setActiveSurname(surname);
  };
  const handleOverlayClose = () => {
    setActiveSurname(null);
  };

  const handleWriteClick = () => {
    if (writerRef.current && activeSurname) {
      import('hanzi-writer').then(HanziWriter => {
        writerRef.current!.innerHTML = '';
        HanziWriter.default.create(writerRef.current!, activeSurname, {
          width: 120,
          height: 120,
          padding: 8,
          showOutline: true,
          showCharacter: false,
          strokeAnimationSpeed: 1.1,
          delayBetweenStrokes: 180,
          radicalColor: '#036aff',
          strokeColor: '#036aff',
          outlineColor: '#b3d1ff',
          drawingColor: '#036aff',
          highlightOnComplete: false,
          strokeFadeDuration: 0,
        }).animateCharacter();
      });
    }
  };

  return (
    <div className="naming-container">
      <div className="naming-panda-fixed">
        <img src="/panda-chat.gif" alt="panda chat" />
      </div>
      <h2 className="naming-title">{t('namingTitle')}</h2>
      <div className="naming-chat-area">
        {/* welcome-msg 动画显示 */}
        {showWelcomeMsg && (
          <div
            className="welcome-msg naming-chat-left-msg"
            dangerouslySetInnerHTML={{ __html: t("namingChatWelcomeMsg").replace(/\n/g, "<br />") }}
          />
        )}
        {/* surname-msg 动画显示 */}
        {showSurnameMsg && (
          <div
            className="surname-msg naming-chat-left-msg"
            dangerouslySetInnerHTML={{ __html: t("namingChatSurnameMsg").replace(/\n/g, "<br />") }}
          />
        )}
        {/* 姓氏选择区和按钮动画显示 */}
        {showSurnamesGrid && (
          <div className="naming-surnames-block">
            <div className="naming-surnames-grid">
              {commonSurnames.map((surname) => (
                <div key={surname} className="naming-surname-radio-wrapper">
                  <div
                    className={`naming-surname-cell${selectedSurname === surname ? ' naming-surname-cell-selected' : ''}`}
                    tabIndex={0}
                    onClick={() => handleCellClick(surname)}
                  >
                    <span className="naming-surname-text">{surname}</span>
                  </div>
                  <button
                    className="naming-surname-radio-btn"
                    tabIndex={-1}
                    aria-label="选中"
                    onClick={e => {
                      e.stopPropagation();
                      if (selectedSurname === surname) {
                        setSelectedSurname(null);
                        if (userSurname !== null) {
                          setSelectedSurname(userSurname);
                          setIsShowBottomBar(false);
                        }
                      } else {
                        setSelectedSurname(surname);
                        if (userSurname === surname) {
                          setIsShowBottomBar(false);
                        } else {
                          setIsShowBottomBar(true);
                        }
                      }
                    }}
                  >
                    <img
                      src={selectedSurname === surname ? "/checked.svg" : "/uncheck.svg"}
                      alt={selectedSurname === surname ? "已选中" : "未选中"}
                      style={{ width: 22, height: 22 }}
                    />
                  </button>
                </div>
              ))}
            </div>
            <div className="naming-btn-row">
              <button
                className="naming-more-btn"
                onClick={handleMoreClick}
              >
                {t('namingMoreSurnames')}
              </button>
              <button
                className="naming-mike-pick-btn"
                onClick={handleMikePick}
              >
                {t("namingMikeCustom")}
              </button>
            </div>
          </div>
        )}
        {/* 用户发送的右侧气泡及后续内容动画显示 */}
        {userSurname && (
          <>
            {showUserSurname && (
              <div 
                className="user-surname naming-chat-right-msg" 
                style={{ whiteSpace: 'pre-line' }}
                dangerouslySetInnerHTML={{ __html: t('namingSelectedSurname', { surname: userSurname }).replace(/\n/g, '<br />') }}
              />
            )}
            {showNameMsg && (
              <div
                className="name-msg naming-chat-left-msg"
                style={{ whiteSpace: 'pre-line' }}
                dangerouslySetInnerHTML={{ __html: t('namingChatInfoMsg', { surname: userSurname }).replace(/\n/g, '<br />') }}
              />
            )}
            {showUserInfoForm && (
              <div className="user-info-form">
                <UserInfoForm onSubmit={() => {}} />
              </div>
            )}
          </>
        )}
      </div>

      {/* 底部只读输入框和发送按钮 */}
      {isShowBottomBar && selectedSurname && (
        <div className="naming-bottom-bar">
          <div
            className="naming-bottom-input"
            style={{ whiteSpace: 'pre-line' }}
            dangerouslySetInnerHTML={{ __html: t('namingInputSelectedSurnameTip', { surname: selectedSurname }).replace(/\n/g, '<br />') }}
          />
          <button className="naming-bottom-send-btn" onClick={handleSend}>{t('namingInputSend')}</button>
        </div>
      )}

      {/* 更多弹窗，显示 Surname 页面 */}
      {showMorePopup && (
        <div className="naming-more-overlay" onClick={handleMoreClose}>
          <div className="naming-more-popup" onClick={e => e.stopPropagation()}>
            {/* 直接复用 Surname 页面组件 */}
            {/* @ts-ignore */}
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
      {/* 全屏放大姓氏卡片和遮罩层 */}
      {activeSurname && (
        <div className="naming-surname-overlay" onClick={handleOverlayClose}>
          <div
            className="naming-surname-popup"
            onClick={e => e.stopPropagation()}
          >
            <div className="naming-surname-popup-text" style={{ position: 'relative', width: 120, height: 120 }}>
              <div ref={writerRef} style={{ width: 120, height: 120, position: 'absolute', top: 0, left: 0, zIndex: 2 }} />
            </div>
            <div className="naming-surname-popup-actions">
              <button
                className="naming-surname-popup-btn"
                title="发音"
                onClick={() => {
                  if (activeSurname) {
                    const utter = new window.SpeechSynthesisUtterance(activeSurname);
                    utter.lang = 'zh-CN';
                    window.speechSynthesis.speak(utter);
                  }
                }}
              >
                <img src="/voice.svg" alt="发音" />
              </button>
              <button className="naming-surname-popup-btn" title="编辑" onClick={handleWriteClick}>
                <img src="/pencil.svg" alt="编辑" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
