import React from "react";
import { useTranslation } from "react-i18next";
import ActiveSurname from '../surname/ActiveSurname';
import "./CustomNameList.css";
import { CustomNameItem } from "@/types/restRespEntities";

const CustomNameList: React.FC<{
  items: CustomNameItem[];
}> = ({ items }) => {
  const { t, i18n } = useTranslation();
  const [activeName, setActiveName] = React.useState<string | null>(null);

  if (!items || items.length === 0) return null;

  // 获取当前语言环境，使用i18n API更准确
  const currentLanguage = i18n.language || 'en';

  return (
    <div className="custom-name-list-root">
      {items.map((item, idx) => (
        <div className="custom-name-list-item" key={idx}>
          <div className="custom-name-item-main">
            <div
              className="custom-name-item-card"
              style={{ cursor: 'pointer' }}
              onClick={() => setActiveName(item.name)}
            >
              <div className="custom-name-item-card-name">{item.name}</div>
              <div className="custom-name-item-card-pinyin">{item.pinyin}</div>
            </div>
          </div>
          <div className="custom-name-item-source">
            {currentLanguage.startsWith('zh') 
              ? (item.source_cn || ``) 
              : (item.source_en || item.source_cn || ``)
            }
          </div>
        </div>
      ))}
      {activeName && (
        <ActiveSurname
          item={(() => {
            const found = items.find(i => i.name === activeName);
            if (found) {
              return {
                surname: found.name,
                pinyin: found.pinyin || '',
                desc: {
                  zh: found.source_cn || '',
                  en: found.source_en || ''
                }
              };
            }
            return { surname: activeName, pinyin: '', desc: { zh: '', en: '' } };
          })()}
          onClose={() => setActiveName(null)}
        />
      )}
    </div>
  );
};

export default CustomNameList;
