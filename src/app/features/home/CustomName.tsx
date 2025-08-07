import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "./CustomName.css";
import UserInfoForm from "./UserInfoForm";

interface CustomNameProps {
  onBack: () => void;
}

export default function CustomName({ onBack }: CustomNameProps) {
  const { t } = useTranslation();
  const commonSurnames = [
    '王', '李', '赵', '吴', '周', '郑', '冯', '陈', '卫', '许',
    '何', '吕', '孙', '林', '叶', '宋', '杨', '朱', '张', '洪'
  ];
  const [activeSurname, setActiveSurname] = React.useState<string|null>(null);
  const [selectedSurname, setSelectedSurname] = useState<string|null>(null);
  const [userSurname, setUserSurname] = useState<string|null>(null);

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
    }
  } 

  // 发送按钮点击
  const handleSend = () => {
    if (selectedSurname) {
      setUserSurname(selectedSurname);
      setSelectedSurname(null);
    }
    // 聊天动画：用户发送后依次显示右侧气泡和后续内容
    setShowUserSurname(false);
    setShowNameMsg(false);
    setShowUserInfoForm(false);
    setTimeout(() => {
      setShowUserSurname(true);
      setTimeout(() => {
        setShowNameMsg(true);
        setTimeout(() => {
          setShowUserInfoForm(true);
        }, 700);
      }, 700);
    }, 0);
  } 
  const writerRef = useRef<HTMLDivElement>(null);

  // 姓氏弹窗每次打开都自动播放动画
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

  // 聊天动画：初始依次显示welcome-msg、surname-msg、姓氏选择区和按钮
  useEffect(() => {
    setShowWelcomeMsg(false);
    setShowSurnameMsg(false);
    setShowSurnamesGrid(false);
    setShowUserSurname(false);
    setShowNameMsg(false);
    setShowUserInfoForm(false);
    setTimeout(() => {
      setShowWelcomeMsg(true);
      setTimeout(() => {
        setShowSurnameMsg(true);
        setTimeout(() => {
          setShowSurnamesGrid(true);
        }, 700);
      }, 1000);
    }, 0);
  }, []);

  // 用户发送后，动画已在handleSend中处理

  const handleCellClick = (surname: string) => {
    setActiveSurname(surname);
    // setSelectedSurname(surname);
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
    <div className="custom-name-container">
      <div className="custom-name-panda-fixed">
        <img src="/panda-chat.gif" alt="panda chat" />
      </div>
      <div className="custom-name-header-row">
        <button className="custom-name-back-btn" onClick={onBack} aria-label="关闭">
          <img src="/close.svg" alt="关闭" />
        </button>
        <div className="custom-name-title">{t("customNameTitle")}</div>
      </div>
      <div className="custom-name-chat-area">
        {/* welcome-msg 动画显示 */}
        {showWelcomeMsg && (
          <div
            className="welcome-msg custom-name-chat-left-msg"
            dangerouslySetInnerHTML={{ __html: t("welcomeChatMsg").replace(/\n/g, "<br />") }}
          />
        )}
        {/* surname-msg 动画显示 */}
        {showSurnameMsg && (
          <div
            className="surname-msg custom-name-chat-left-msg"
            dangerouslySetInnerHTML={{ __html: t("surnameChatMsg").replace(/\n/g, "<br />") }}
          />
        )}
        {/* 姓氏选择区和按钮动画显示 */}
        {showSurnamesGrid && (
          <div className="custom-name-surnames-block">
            <div className="custom-name-surnames-grid">
              {commonSurnames.map((surname) => (
                <div key={surname} className="custom-name-surname-radio-wrapper">
                  <div
                    className={`custom-name-surname-cell${selectedSurname === surname ? ' custom-name-surname-cell-selected' : ''}`}
                    tabIndex={0}
                    onClick={() => handleCellClick(surname)}
                  >
                    <span className="custom-name-surname-text">{surname}</span>
                  </div>
                  <button
                    className={`custom-name-surname-radio-btn${selectedSurname === surname ? ' selected' : ''}`}
                    tabIndex={-1}
                    aria-label="选中"
                    onClick={e => {
                      e.stopPropagation();
                      if (selectedSurname === surname) {
                        setSelectedSurname(null);
                      } else {
                        setSelectedSurname(surname);
                      }
                    }}
                  />
                </div>
              ))}
            </div>
            <button
              className="custom-name-mike-pick-btn"
              style={{ marginTop: 20 }}
              onClick={handleMikePick}
            >
              {t("mikeCustomSurname")}
            </button>
          </div>
        )}
        {/* 用户发送的右侧气泡及后续内容动画显示 */}
        {userSurname && (
          <>
            {showUserSurname && (
              <div 
                className="user-surname custom-name-chat-right-msg" 
                style={{ whiteSpace: 'pre-line' }}
                dangerouslySetInnerHTML={{ __html: t('selectedUserSurname', { surname: userSurname }).replace(/\n/g, '<br />') }}
              />
            )}
            {showNameMsg && (
              <div
                className="name-msg custom-name-chat-left-msg"
                style={{ whiteSpace: 'pre-line' }}
                dangerouslySetInnerHTML={{ __html: t('nameChatMsg', { surname: userSurname }).replace(/\n/g, '<br />') }}
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
        {selectedSurname && (
          <div className="custom-name-bottom-bar">
            <div
              className="custom-name-bottom-input"
              style={{ whiteSpace: 'pre-line' }}
              dangerouslySetInnerHTML={{ __html: t('inputSelectedSurnameTip', { surname: selectedSurname }).replace(/\n/g, '<br />') }}
            />
            <button className="custom-name-bottom-send-btn" onClick={handleSend}>发送</button>
          </div>
        )}

      {/* 全屏放大姓氏卡片和遮罩层 */}
      {activeSurname && (
        <div className="custom-name-surname-overlay" onClick={handleOverlayClose}>
          <div
            className="custom-name-surname-popup"
            onClick={e => e.stopPropagation()}
          >
            <div className="custom-name-surname-popup-text" style={{ position: 'relative', width: 120, height: 120 }}>
              <div ref={writerRef} style={{ width: 120, height: 120, position: 'absolute', top: 0, left: 0, zIndex: 2 }} />
            </div>
            <div className="custom-name-surname-popup-actions">
              <button
                className="custom-name-surname-popup-btn"
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
              <button className="custom-name-surname-popup-btn" title="编辑" onClick={handleWriteClick}>
                <img src="/pencil.svg" alt="编辑" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
