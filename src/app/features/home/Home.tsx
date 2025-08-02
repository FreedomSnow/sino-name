import React from "react";
import "./Home.css";
import { useTranslation } from "react-i18next";
import CustomName from "./CustomName";


export default function HomePage() {

  const { t } = useTranslation();
  const [showCustomName, setShowCustomName] = React.useState(false);
  const handleStart = () => {
    setShowCustomName(true);
  };
  return (
    <div className="home-page-container">
      {showCustomName ? (
        <CustomName onBack={() => setShowCustomName(false)} />
      ) : (
        <>
          <h2>{t("welcome")}</h2>
          <div
            className="homepage-subtext"
            dangerouslySetInnerHTML={{ __html: t("homepageDesc") }}
          />
          <button className="homepage-action-btn" onClick={handleStart}>
            {t("homepageStart")}
          </button>
        </>
      )}
    </div>
  );
}
