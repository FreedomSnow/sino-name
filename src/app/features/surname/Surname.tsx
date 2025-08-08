import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./Surname.css";
import surnamesData from './surnames.json';

interface SurnameItem {
  surname: string;
  pinyin: string;
  desc: {
    zh: string;
    en: string;
  };
}

const surnames: SurnameItem[] = surnamesData;

const Surname: React.FC = () => {
  const { t } = useTranslation();
  const [activeItem, setActiveItem] = useState<SurnameItem | null>(null);
  // 多字姓氏动画：每个字一个ref
  const writerRefs = useRef<Array<HTMLDivElement | null>>([]);

  const handleOverlayClose = () => {
    setActiveItem(null);
  };

  const handleWriteClick = () => {
    if (activeItem) {
      import('hanzi-writer').then(HanziWriter => {
        // 多字姓氏：遍历每个字
        const chars = activeItem.surname.split("");
        // 顺序动画：递归执行每个字
        const animateChar = (idx: number) => {
          if (idx >= chars.length) return;
          const ref = writerRefs.current[idx];
          if (ref) {
            ref.innerHTML = '';
            const writer = HanziWriter.default.create(ref, chars[idx], {
              width: 100,
              height: 100,
              padding: 4,
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
            });
            writer.animateCharacter({ onComplete: () => animateChar(idx + 1) });
          } else {
            animateChar(idx + 1);
          }
        };
        animateChar(0);
      });
    }
  };

  useEffect(() => {
    if (activeItem) {
      handleWriteClick();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeItem]);

  return (
    <div className="surname-root">
      <h2 className="surname-title">{t('surname_title')}</h2>
      <div className="surname-grid">
        {surnames.map((item, idx) => (
          <div
            className={"surname-item" + (activeItem?.surname === item.surname ? " active" : "")}
            key={item.surname + idx}
            onClick={() => setActiveItem(item)}
          >
            <div className="surname-item-content">
              <div className={"surname-item-pinyin" + (item.pinyin.length > 6 ? " long" : "")}>{item.pinyin}</div>
              <div className={"surname-item-name" + (item.surname.length > 1 ? " long" : "")}>{item.surname}</div>
            </div>
          </div>
        ))}
      </div>
      {activeItem && (
        <div className="active-surname-overlay" onClick={handleOverlayClose}>
          <div
            className="active-surname-popup"
            onClick={e => e.stopPropagation()}
          >
            <div
              className={
                activeItem.surname.length === 1
                  ? "active-surname-popup-text single"
                  : "active-surname-popup-text multi"
              }
            >
              <div className="active-surname-popup-writer-row">
                {activeItem.surname.split("").map((char, idx) => (
                  <div
                    key={idx}
                    ref={el => { writerRefs.current[idx] = el; }}
                    className="active-surname-popup-writer"
                  />
                ))}
              </div>
            </div>
            <div className="active-surname-popup-pinyin">
              {activeItem.pinyin}
            </div>
            <div className="active-surname-popup-actions">
              <button
                className="active-surname-popup-btn"
                title={t('pronounce', '发音')}
                onClick={() => {
                  if (activeItem) {
                    const utter = new window.SpeechSynthesisUtterance(activeItem.surname);
                    utter.lang = 'zh-CN';
                    window.speechSynthesis.speak(utter);
                  }
                }}
              >
                <img src="/voice.svg" alt={t('pronounce', '发音')} />
              </button>
              <button className="active-surname-popup-btn" title={t('edit', '编辑')} onClick={handleWriteClick}>
                <img src="/pencil.svg" alt={t('edit', '编辑')} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Surname;
