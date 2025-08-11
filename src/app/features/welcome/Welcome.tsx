
import React from "react";
import "./Welcome.css";
import { useTranslation } from "react-i18next";

type WelcomeProps = {
  handleStart: () => void;
};


const Welcome: React.FC<WelcomeProps> = ({ handleStart }) => {
  const { t } = useTranslation();
  return (
    <div className="welcome-container">
      <h2>{t("welcome")}</h2>
      <div
        className="welcome-subtext"
        dangerouslySetInnerHTML={{ __html: t("welcomeDesc").replace(/\n/g, "<br />") }}
      />
      <button className="welcome-start-btn" onClick={handleStart}>
        {t("welcomeStart")}
      </button>
    </div>
  );
};

export default Welcome;
