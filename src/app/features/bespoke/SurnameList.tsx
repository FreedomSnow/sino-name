import React from "react";
import { useTranslation } from "react-i18next";
import ActiveSurname from '../surname/ActiveSurname';
import "./SurnameList.css";
import { SurnameItem } from "@/types/restRespEntities";


interface SurnameListProps {
  items: SurnameItem[];
  selected?: string | null;
  onSubmit?: (lastName: string) => void;
}

const SurnameList: React.FC<SurnameListProps> = ({ items, selected, onSubmit }) => {
  const { t, i18n } = useTranslation();
  const [selectedSurname, setSelectedSurname] = React.useState<string | null>(selected ?? null);
  const [activeSurname, setActiveSurname] = React.useState<string | null>(null);

  React.useEffect(() => {
    setSelectedSurname(selected ?? null);
  }, [selected]);

  if (!items || items.length === 0) return null;

  // 获取当前语言环境，使用i18n API更准确
  const currentLanguage = i18n.language || 'en';

  return (
    <div className="surname-list-root">
      {items.map((item, idx) => (
        <div className="surname-list-item" key={idx}>
          <div className="surname-item-radio">
            <input
              type="radio"
              name="surname-radio"
              value={item.name}
              checked={selectedSurname === item.name}
              onChange={() => {
                if (selectedSurname === item.name) {
                  setSelectedSurname(null);
                } else {
                  setSelectedSurname(item.name);
                }
              }}
            />
          </div>
          <div className="surname-item-main">
            <div
              className="surname-item-card"
              style={{ cursor: 'pointer' }}
              onClick={() => setActiveSurname(item.name)}
            >
              <div className="surname-item-card-pinyin">{item.pinyin}</div>
              <div className="surname-item-card-lastname">{item.name}</div>
            </div>
            <div className="surname-item-explanation">
              {currentLanguage.startsWith('zh') 
                ? (item.explanation_cn || `姓氏"${item.name}"为中国古老姓氏之一`) 
                : (item.explanation_en || item.explanation_cn || `The surname '${item. name}' is one of the ancient surnames in China`)
              }
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
            const found = items.find(i => i.name === activeSurname);
            if (found) {
              return {
                surname: found.name,
                pinyin: found.pinyin || '',
                desc: {
                  zh: found.explanation_cn || '',
                  en: found.explanation_en || ''
                }
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
