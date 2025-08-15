import React from "react";


import { LastNameItem } from "./types";
import { useTranslation } from "react-i18next";
import ActiveSurname from '../surname/ActiveSurname';
import "./SurnameList.css";


interface SurnameListProps {
  items: LastNameItem[];
  selected?: string | null;
  onSubmit?: (lastName: string) => void;
}

const SurnameList: React.FC<SurnameListProps> = ({ items, selected, onSubmit }) => {
  const { t } = useTranslation();
  const [selectedSurname, setSelectedSurname] = React.useState<string | null>(selected ?? null);
  const [activeSurname, setActiveSurname] = React.useState<string | null>(null);

  React.useEffect(() => {
    setSelectedSurname(selected ?? null);
  }, [selected]);

  if (!items || items.length === 0) return null;

  // 获取当前语言环境
  const lang = typeof window !== 'undefined' ? (window.localStorage.getItem('i18nextLng') || 'zh') : 'zh';

  return (
    <div className="surname-list-root">
      {items.map((item, idx) => (
        <div className="surname-list-item" key={idx}>
          <div className="surname-item-radio">
            <input
              type="radio"
              name="surname-radio"
              value={item.lastName}
              checked={selectedSurname === item.lastName}
              onChange={() => {
                if (selectedSurname === item.lastName) {
                  setSelectedSurname(null);
                } else {
                  setSelectedSurname(item.lastName);
                }
              }}
            />
          </div>
          <div className="surname-item-main">
            <div
              className="surname-item-card"
              style={{ cursor: 'pointer' }}
              onClick={() => setActiveSurname(item.lastName)}
            >
              <div className="surname-item-card-pinyin">{item.pinyin}</div>
              <div className="surname-item-card-lastname">{item.lastName}</div>
            </div>
            <div className="surname-item-explanation">
              {lang.startsWith('zh') ? item.explanation.zh : item.explanation.en}
            </div>
          </div>
        </div>
      ))}
      <div className="surname-list-footer">
        <button
          className="surname-list-submit-btn"
          disabled={!selectedSurname}
          onClick={() => {
            if (selectedSurname && onSubmit) onSubmit(selectedSurname);
          }}
        >
          {t('submit')}
        </button>
      </div>
      {activeSurname && (
        <ActiveSurname
          item={(() => {
            const found = items.find(i => i.lastName === activeSurname);
            if (found) {
              return {
                surname: found.lastName,
                pinyin: found.pinyin,
                desc: found.explanation
              };
            }
            return { surname: activeSurname, pinyin: '', desc: { zh: '', en: '' } };
          })()}
          onClose={() => setActiveSurname(null)}
        />
      )}
    </div>
  );
};

export default SurnameList;
