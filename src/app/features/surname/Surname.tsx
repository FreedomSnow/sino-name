import React, { useState } from "react";
import { useTranslation } from "react-i18next";
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
  const [selectedItem, setSelectedItem] = useState<SurnameItem | null>(null);
  const handleOverlayClose = () => setActiveItem(null);

  // 同步外部传入的 selectedSurname
  React.useEffect(() => {
    if (selectedSurname) {
      const found = surnames.find(s => s.surname === selectedSurname);
      if (found) {
        setSelectedItem(found);
      }
    } else {
      setSelectedItem(null);
    }
  }, [selectedSurname]);

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
                onClick={e => {
                  e.stopPropagation();
                  if (selectedItem?.surname !== item.surname) {
                    setSelectedItem(item);
                    if (onSelect) onSelect(item);
                  } else {
                    setSelectedItem(null);
                    if (onSelect) onSelect(null);
                  }
                }}
              >
                <img
                  src={selectedItem?.surname === item.surname ? "/checked.svg" : "/uncheck.svg"}
                  alt={selectedItem?.surname === item.surname ? t('active_surname_checked') : t('active_surname_unchecked')}
                  style={{ width: 22, height: 22 }}
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
            if (onSelect) onSelect(item);
          }}
        />
      )}
    </div>
  );
};

export default Surname;
