

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
    '王','李','赵','吴','周','郑','冯','陈','卫',
    '蒋','沈','杨','朱','尤','许','何','吕',
    '施','张','孔','严','华','金'
  ];
  const [activeSurname, setActiveSurname] = React.useState<string|null>(null);
  const [selectedSurname, setSelectedSurname] = useState<string|null>(null);
  const [userSurname, setUserSurname] = useState<string|null>(null);
  // Mike定制按钮点击
  const handleMikePick = () => {
    if (commonSurnames.length > 0) {
      const idx = Math.floor(Math.random() * commonSurnames.length);
      const surname = commonSurnames[idx];
      setSelectedSurname(surname);
      setActiveSurname(surname);
    }
  };

  // 发送按钮点击
  const handleSend = () => {
    if (selectedSurname) {
      setUserSurname(selectedSurname);
      setSelectedSurname(null);
    }
    // 这里可扩展发送逻辑
  };
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

  const handleCellClick = (surname: string) => {
    setActiveSurname(surname);
    setSelectedSurname(surname);
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
        <div
          className="custom-name-chat-left-msg"
          dangerouslySetInnerHTML={{ __html: t("welcomeChatMsg").replace(/\n/g, "<br />") }}
        />
        <div
          className="custom-name-chat-left-msg"
          dangerouslySetInnerHTML={{ __html: t("surnameChatMsg").replace(/\n/g, "<br />") }}
        />
        {/* <div className="custom-name-chat-left-msg"> */}
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
                    setSelectedSurname(surname);
                  }}
                />
              </div>
            ))}
            <button className="custom-name-surname-cell custom-name-surname-more-btn" title="查看更多姓氏">
              <span className="custom-name-surname-text">…</span>
            </button>
          </div>
          <button
            className="custom-name-mike-pick-btn"
            style={{ marginTop: 20, marginLeft: 8 }}
            onClick={handleMikePick}
          >
            {t("mikeCustomSurname")}
          </button>
        {/* </div> */}
        {/* 用户发送的右侧气泡 */}
        {userSurname && (
          <>
            <div 
              className="user-surname custom-name-chat-right-msg" 
              style={{ whiteSpace: 'pre-line' }}
              dangerouslySetInnerHTML={{ __html: t('selectedUserSurname', { surname: userSurname }).replace(/\n/g, '<br />') }}
            />
            <div
              className="name-msg custom-name-chat-left-msg"
              style={{ whiteSpace: 'pre-line' }}
              dangerouslySetInnerHTML={{ __html: t('nameChatMsg', { surname: userSurname }).replace(/\n/g, '<br />') }}
            />
            <div className="user-info-form">
              <UserInfoForm onSubmit={() => {}} />
            </div>
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
