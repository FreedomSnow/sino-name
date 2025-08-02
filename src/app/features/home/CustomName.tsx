

import { useTranslation } from "react-i18next";
import "./CustomName.css";

interface CustomNameProps {
  onBack: () => void;
}

export default function CustomName({ onBack }: CustomNameProps) {
  const { t } = useTranslation();
  return (
    <div className="custom-name-container">
      <div className="custom-name-panda-fixed">
        <img src="/panda-chat.gif" alt="panda chat" />
      </div>
      <div className="custom-name-header-row">
        <button className="custom-name-back-btn" onClick={onBack} aria-label="关闭">
          <img src="/close.svg" alt="关闭" />
        </button>
        <div className="custom-name-title">{t("customNameTitle")}</div>
      </div>
      <div className="custom-name-chat-area">
        <div
          className="custom-name-chat-left-msg"
          dangerouslySetInnerHTML={{ __html: t("customNameFirstChatMsg").replace(/\n/g, "<br />") }}
        />
      </div>
    </div>
  );
}
