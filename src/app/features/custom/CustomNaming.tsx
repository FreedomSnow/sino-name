import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./CustomNaming.css";

export default function CustomNaming() {
  const [inputValue, setInputValue] = useState("");
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    // 动态调整高度
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };
  const handleSubmit = () => {
    // 这里可以处理输入内容
    alert(`提交内容：${inputValue}`);
  };
    const { t } = useTranslation();
  return (
    <div className="custom-naming-root">
      <h2 className="custom-naming-title">{t('customNamingTitle')}</h2>
      <div className="custom-naming-main">
        <div className="custom-naming-form">
          <textarea
            className="custom-naming-input"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={t('customNamingPlaceholder')}
            rows={1}
          />
          <button className="custom-naming-btn" onClick={handleSubmit}>
            {t('customNamingSubmit')}
          </button>
        </div>
      </div>
    </div>
  );
}
