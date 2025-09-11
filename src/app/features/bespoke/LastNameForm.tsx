import React, { useState } from "react";
// 不再需要 Image 组件
import { SurnameItem } from "@/types/restRespEntities";
import { useTranslation } from "react-i18next";
import "./LastNameForm.css";
import { getSurname } from "@/services/aiNaming";
import PandaLoadingView from "@/components/PandaLoadingView";
import OrderPage from "../order/OrderPage";
import { HTTP_STATUS, NAMING_ERRORS } from "@/app/error/errorCodes";

interface LastNameFormProps {
  onClose: () => void;
  onResult?: (lastName: string, items: SurnameItem[]) => void;
}

const LastNameForm: React.FC<LastNameFormProps> = ({ onClose, onResult }) => {
  const { t } = useTranslation();
  const [lastName, setLastName] = useState("");
  const [showOrderPage, setShowOrderPage] = useState(false);
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
        lang: "", // 可以从i18n中获取当前语言
        lastName: lastName.trim()
      });
      
      if (result.success && result.surnames && result.surnames.length > 0) {
        // 使用API返回的姓氏数据
        if (onResult) onResult(lastName.trim(), result.surnames);
      } else {
        // 处理错误情况
        console.error(`AI自由命名失败, code: ${result.code}, message: ${result.message}`);
        if (result.code === HTTP_STATUS.UNAUTHORIZED) {
          // 401错误，尝试获取用户认证信息
          import('@/services/tokenService').then(({ logout }) => {
            logout();
            alert(t('errorUnauthorized'));
          });
        } else if (result.code === NAMING_ERRORS.NOT_ENOUGH_POINTS) {
          // 403错误，显示订单页面
          setShowOrderPage(true);
        } else {
          // 其他错误码
          alert(t('errorNormal'));
        }
      }
    } catch (error) {
      console.error("调用命名API出错:", error);
      // 可以添加错误提示
      alert(t('errorNormal'));
    } finally {
      setLoading(false);
      // 只有在没有显示订单页面时才关闭表单
      if (!showOrderPage) {
        onClose();
      }
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
          <button className="lastnameform-btn" onClick={() => handleSend()}>{t('submit')}</button>
        </div>
      </div>
      {loading && <PandaLoadingView />}
      
      {/* 订单页面 */}
      {showOrderPage && (
        <OrderPage 
          isOpen={showOrderPage} 
          onClose={() => setShowOrderPage(false)}  
        />
      )}
    </div>
  );
};

export default LastNameForm;
