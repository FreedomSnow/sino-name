import React, { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import "./ActiveSurname.css";

interface SurnameItem {
  surname: string;
  pinyin: string;
  desc: {
    zh: string;
    en: string;
  };
}

interface ActiveSurnameProps {
  item: SurnameItem;
  onClose: () => void;
  editable?: boolean;
  selected?: boolean;
  onSelect?: (item: SurnameItem | null) => void;
}

const ActiveSurname: React.FC<ActiveSurnameProps> = ({ item, onClose, editable, selected: selectedProp, onSelect }) => {
  const { t } = useTranslation();
  const [selected, setSelected] = React.useState(() => editable && selectedProp ? true : false);
  const writerRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (item) {
      import('hanzi-writer').then(HanziWriter => {
        try {
          const chars = item.surname.split("");
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
        } catch (error) {
          console.error('hanzi-writer 初始化失败:', error);
        }
      }).catch(error => {
        console.error('hanzi-writer 模块加载失败:', error);
      });
    }
  }, [item]);

  return (
    <div className="active-surname-overlay" onClick={onClose}>
      <div
        className="active-surname-popup"
        onClick={e => e.stopPropagation()}
      >
        <div
          className={
            item.surname.length === 1
              ? "active-surname-popup-text single"
              : "active-surname-popup-text multi"
          }
          style={{ position: 'relative' }}
        >
          <div className="active-surname-popup-writer-row">
            {item.surname.split("").map((char, idx) => (
              <div
                key={idx}
                ref={el => { writerRefs.current[idx] = el; }}
                className="active-surname-popup-writer"
              />
            ))}
          </div>
        </div>
        <div className="active-surname-popup-pinyin">
          {item.pinyin}
        </div>
        <div className="active-surname-popup-actions">
          <button
            className="active-surname-popup-btn"
            title="发音"
            onClick={() => {
              const utter = new window.SpeechSynthesisUtterance(item.surname);
              utter.lang = 'zh-CN';
              window.speechSynthesis.speak(utter);
            }}
          >
            <Image src="/voice.svg" alt="发音" width={24} height={24} />
          </button>
          <button className="active-surname-popup-btn" title="编辑" onClick={() => {
            if (item) {
              import('hanzi-writer').then(HanziWriter => {
                try {
                  const chars = item.surname.split("");
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
                } catch (error) {
                  console.error('hanzi-writer 初始化失败:', error);
                }
              }).catch(error => {
                console.error('hanzi-writer 模块加载失败:', error);
              });
            }
          }}>
            <Image src="/pencil.svg" alt="编辑" width={24} height={24} />
          </button>
          {editable && (
            <button
              className="active-surname-popup-check-btn"
              onClick={() => {
                if (!selected) {
                  setSelected(true);
                  if (onSelect) onSelect(item);
                } else {
                  setSelected(false);
                  if (onSelect) onSelect(null);
                }
              }}
            >
              <Image
                src={selected ? "/checked.svg" : "/uncheck.svg"}
                alt={selected ? t('active_surname_checked') : t('active_surname_unchecked')}
                width={24}
                height={24}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveSurname;
