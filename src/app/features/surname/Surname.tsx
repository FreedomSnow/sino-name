import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import "./Surname.css";
import surnamesData from './surnames.json';
import ActiveSurname from './ActiveSurname';


interface SurnameItem {
  surname: string;
  pinyin: string;
  desc: {
    zh: string;
    en: string;
  };
}

interface SurnameProps {
  editable?: boolean;
  onSelect?: (item: SurnameItem | null) => void;
  selectedSurname?: string | null;
}

const surnames: SurnameItem[] = surnamesData;

const Surname: React.FC<SurnameProps> = ({ editable = false, onSelect, selectedSurname }) => {
  const { t } = useTranslation();
  const [activeItem, setActiveItem] = useState<SurnameItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<SurnameItem | null>(() => {
    // 初始化时从 localStorage 读取状态
    const saved = window.localStorage.getItem('selectedSurname');
    if (saved) {
      const found = surnames.find(s => s.surname === saved);
      return found || null;
    }
    return null;
  });
  const handleOverlayClose = () => setActiveItem(null);

  // 同步外部传入的 selectedSurname
  React.useEffect(() => {
    if (selectedSurname) {
      const found = surnames.find(s => s.surname === selectedSurname);
      if (found) {
        setSelectedItem(found);
        window.localStorage.setItem('selectedSurname', found.surname);
      }
    } else {
      setSelectedItem(null);
      window.localStorage.removeItem('selectedSurname');
    }
  }, [selectedSurname]);

  // 监听 tab 切换或页面恢复时同步状态和滚动位置
  React.useEffect(() => {
    const syncState = () => {
      const saved = window.localStorage.getItem('selectedSurname');
      if (saved) {
        const found = surnames.find(s => s.surname === saved);
        setSelectedItem(found || null);
      } else {
        setSelectedItem(null);
      }
      // 恢复滚动位置
      const scrollY = window.localStorage.getItem('surnameScrollY');
      if (scrollY) {
        requestAnimationFrame(() => {
          window.scrollTo({ top: Number(scrollY), behavior: 'auto' });
        });
      }
    };
    window.addEventListener('visibilitychange', syncState);
    // 首次挂载时恢复滚动位置
    const scrollY = window.localStorage.getItem('surnameScrollY');
    if (scrollY) {
      requestAnimationFrame(() => {
        window.scrollTo({ top: Number(scrollY), behavior: 'auto' });
      });
    }
    return () => {
      window.removeEventListener('visibilitychange', syncState);
    };
  }, []);

  // 监听页面滚动并保存位置
  React.useEffect(() => {
    const saveScroll = () => {
      window.localStorage.setItem('surnameScrollY', String(window.scrollY));
    };
    window.addEventListener('scroll', saveScroll);
    return () => {
      window.removeEventListener('scroll', saveScroll);
    };
  }, []);

  return (
    <div className="surname-root">
      <h2 className="surname-title">{t('surname_title')}</h2>
      <div className="surname-grid">
        {surnames.map((item, idx) => (
          <div
            className={"surname-item" + (activeItem?.surname === item.surname ? " active" : "")}
            key={item.surname + idx}
            style={{ position: 'relative' }}
          >
            {editable && (
              <button
                className="surname-item-check-btn"
                onMouseDown={(e) => {
                  e.preventDefault()
                }}
                onClick={e => {
                  e.stopPropagation();
                  if (selectedItem?.surname !== item.surname) {
                    setSelectedItem(item);
                    window.localStorage.setItem('selectedSurname', item.surname);
                    if (onSelect) onSelect(item);
                  } else {
                    setSelectedItem(null);
                    window.localStorage.removeItem('selectedSurname');
                    if (onSelect) onSelect(null);
                  }
                }}
              >
                <Image
                  src={selectedItem?.surname === item.surname ? "/checked.svg" : "/uncheck.svg"}
                  alt={selectedItem?.surname === item.surname ? t('active_surname_checked') : t('active_surname_unchecked')}
                  width={22}
                  height={22}
                />
              </button>
            )}
            <div
              className="surname-item-content"
              onClick={() => setActiveItem(item)}
            >
              <div className={"surname-item-pinyin" + (item.pinyin.length > 6 ? " long" : "")}>{item.pinyin}</div>
              <div className={"surname-item-name" + (item.surname.length > 1 ? " long" : "")}>{item.surname}</div>
            </div>
          </div>
        ))}
      </div>
      {activeItem && (
        <ActiveSurname
          item={activeItem}
          onClose={handleOverlayClose}
          editable={editable}
          selected={selectedItem?.surname === activeItem.surname}
          onSelect={item => {
            setSelectedItem(item);
            if (item) {
              window.localStorage.setItem('selectedSurname', item.surname);
            } else {
              window.localStorage.removeItem('selectedSurname');
            }
            if (onSelect) onSelect(item);
          }}
        />
      )}
    </div>
  );
};

export default Surname;
