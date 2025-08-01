import React from "react";
import "./Home.css";
import { useTranslation } from "react-i18next";

export default function HomePage() {
  const { t } = useTranslation();
  return (
    <div className="home-page-container">
      <h2>{t("welcome")}</h2>
      <p>{t("homepageDesc")}</p>
    </div>
  );
}
