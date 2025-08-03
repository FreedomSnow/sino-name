

import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import "./CustomName.css";

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
          dangerouslySetInnerHTML={{ __html: t("customNameFirstChatMsg").replace(/\n/g, "<br />") }}
        />
        <div
          className="custom-name-chat-left-msg"
          dangerouslySetInnerHTML={{ __html: t("customNameSecondChatMsg").replace(/\n/g, "<br />") }}
        />
        <div className="custom-name-surnames-grid">
          {commonSurnames.map((surname) => (
            <div
              className="custom-name-surname-cell"
              key={surname}
              onClick={() => handleCellClick(surname)}
              tabIndex={0}
              style={{ cursor: 'pointer' }}
            >
              <span className="custom-name-surname-text">{surname}</span>
            </div>
          ))}
          <button className="custom-name-surname-cell custom-name-surname-more-btn" title="查看更多姓氏">
            <span className="custom-name-surname-text">…</span>
          </button>
        </div>
      </div>

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
              <button className="custom-name-surname-popup-btn custom-name-surname-popup-btn-selected" title="选中">
                <svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="9" fill="#036aff"/><polyline points="6,11 9,14 14,7" fill="none" stroke="#fff" strokeWidth="2"/></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
