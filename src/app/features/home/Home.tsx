import React from "react";
import "./Home.css";
import { useTranslation } from "react-i18next";
import CustomName from "./CustomName";


export default function HomePage() {
  // 页面首次加载时清空 localStorage（仅刷新或重新进入网站时）
  React.useEffect(() => {
    // navigation.type === 1 表示刷新，type === 0 表示首次进入
    // 兼容新版 API
    let navType: string | number | undefined;
    const navEntries = window.performance?.getEntriesByType?.('navigation');
    if (navEntries && navEntries.length > 0) {
      // 类型断言为 PerformanceNavigationTiming
      navType = (navEntries[0] as any).type;
    } else if (window.performance?.navigation) {
      navType = window.performance.navigation.type;
    }
    if (navType === 'reload' || navType === 1 || navType === 'navigate') {
      window.localStorage.removeItem('showCustomName');
      window.localStorage.removeItem('selectedSurname');
      window.localStorage.removeItem('surnameScrollY');
    }
  }, []);
  const { t } = useTranslation();
  const [showCustomName, setShowCustomName] = React.useState(() => {
    // 初始化时从 localStorage 读取状态
    const saved = window.localStorage.getItem('showCustomName');
    return saved === 'true';
  });

  const handleStart = () => {
    setShowCustomName(true);
    window.localStorage.setItem('showCustomName', 'true');
  };

  const handleBack = () => {
    setShowCustomName(false);
    window.localStorage.setItem('showCustomName', 'false');
  };

  React.useEffect(() => {
    // 监听 tab 切换或页面恢复时同步状态
    const syncState = () => {
      const saved = window.localStorage.getItem('showCustomName');
      setShowCustomName(saved === 'true');
    };
    window.addEventListener('visibilitychange', syncState);
    return () => {
      window.removeEventListener('visibilitychange', syncState);
    };
  }, []);

  return (
    <div className="home-page-container">
      {showCustomName ? (
        <CustomName onBack={handleBack} />
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
