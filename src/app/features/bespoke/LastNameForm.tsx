import React, { useState } from "react";
// 不再需要 Image 组件
import { SurnameItem } from "@/types/restRespEntities";
import { useTranslation } from "react-i18next";
import "./LastNameForm.css";
import { getSurname } from "@/services/aiNaming";
import PandaLoadingView from "@/components/PandaLoadingView";
import PayPage from "../pay/PayPage";
import { HTTP_STATUS } from "@/app/error/errorCodes";

interface LastNameFormProps {
  onClose: () => void;
  onSend?: (lastName: string) => void;
}

const LastNameForm: React.FC<LastNameFormProps> = ({ onClose, onSend }) => {
  const { t } = useTranslation();
  const [lastName, setLastName] = useState("");
  const [showOrderPage, setShowOrderPage] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
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
          <button className="lastnameform-btn" 
            onClick={() =>  {
              if (onSend) onSend(lastName);
            }}
          >{t('submit')}</button>
        </div>
      </div>
      {loading && <PandaLoadingView />}
      
      {/* 订单页面 */}
      {showOrderPage && (
        <PayPage
          isOpen={showOrderPage}
          onClose={() => setShowOrderPage(false)}
        />
      )}
    </div>
  );
};

export default LastNameForm;
