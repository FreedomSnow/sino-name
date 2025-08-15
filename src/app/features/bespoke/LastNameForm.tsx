import React, { useState } from "react";
import { LastNameItem } from "./types";
import { useTranslation } from "react-i18next";
import "./LastNameForm.css";

interface LastNameFormProps {
  onClose: () => void;
  onResult?: (lastName: string, items: LastNameItem[]) => void;
}

const LastNameForm: React.FC<LastNameFormProps> = ({ onClose, onResult }) => {
  const { t } = useTranslation();
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  };
  const handleSend = async () => {
    if (!lastName.trim()) return;
    setLoading(true);
    // TODO 模拟AI接口请求，实际可替换为真实API
    setTimeout(() => {
      const item0: LastNameItem = {
        lastName: "王",
        pinyin: "Wang", // 示例
        explanation: {
          zh: `“${lastName.trim()}”是中国常见姓氏，寓意深远。`,
          en: `"${lastName.trim()}" is a common Chinese surname with profound meaning.`
        }
      };
      setLoading(false);
      if (onResult) onResult(lastName.trim(), [item0, item0, item0, item0, item0]);
      onClose();
    }, 3800);
  };

  return (
    <div className="lastnameform-overlay" onClick={e => {
      if (!loading) onClose();
    }}>
      <div className="lastnameform-popup" onClick={e => e.stopPropagation()}>
        {loading ? (
          <div className="lastnameform-loading">
            <img src="/panda-loading.gif" alt="loading" className="lastnameform-loading-img" />
            {/* <span className="lastnameform-loading-text">{t('aiLoading', 'AI智能处理中...')}</span> */}
          </div>
        ) : (
          <div className="lastnameform-content">
            <label className="lastnameform-label">{t('formLastNameLabel')}</label>
            <input
              className="lastnameform-input"
              type="text"
              value={lastName}
              onChange={handleChange}
              placeholder={t('formLastNamePlaceholder')}
              autoFocus
            />
            <button className="lastnameform-btn" onClick={handleSend}>{t('submit')}</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LastNameForm;
