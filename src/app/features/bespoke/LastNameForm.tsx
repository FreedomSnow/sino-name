import React, { useState } from "react";
import Image from "next/image";
import { SurnameItem } from "@/types/restRespEntities";
import { useTranslation } from "react-i18next";
import "./LastNameForm.css";
import { getSurname } from "@/services/aiNaming";
import PandaLoadingView from "@/components/PandaLoadingView";

interface LastNameFormProps {
  onClose: () => void;
  onResult?: (lastName: string, items: SurnameItem[]) => void;
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
    
    try {
      // 调用AI命名接口
      const result = await getSurname({
        lang: t('languageCode'), // 可以从i18n中获取当前语言
        lastName: lastName.trim()
      }, ""); // token参数可以根据实际情况从配置或状态中获取
      
      if (result.success && result.surnames && result.surnames.length > 0) {
        // 使用API返回的姓氏数据
        if (onResult) onResult(lastName.trim(), result.surnames);
      } else {
        // 处理错误情况
        console.error("获取AI命名失败:", result.message);
        // 可以添加错误提示
      }
    } catch (error) {
      console.error("调用命名API出错:", error);
      // 可以添加错误提示
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <div className="lastnameform-overlay" onClick={() => {
      if (!loading) onClose();
    }}>
      <div className="lastnameform-popup" onClick={e => e.stopPropagation()}>
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
      </div>
      {loading && <PandaLoadingView />}
    </div>
  );
};

export default LastNameForm;
