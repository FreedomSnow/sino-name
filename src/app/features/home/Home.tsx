import React from "react";
import "./Home.css";
import { useTranslation } from "react-i18next";

export default function HomePage() {
  const { t } = useTranslation();
  return (
    <div className="home-page-container">
      <h2>{t("welcome")}</h2>
      <div
        className="homepage-subtext"
        dangerouslySetInnerHTML={{ __html: t("homepageDesc") }}
      />
      <button className="homepage-action-btn">{t("homepageStart")}</button>
    </div>
  );
}
