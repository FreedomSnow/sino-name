"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import BespokePage from "./features/bespoke/Bespoke";
import CustomNamingPage from "./features/custom/CustomNaming";
import Surname from "./features/surname/Surname";
import "./i18n-init";
import "./page.css";
import { useEffect } from "react";
import Birthday from "./features/birth/Birthday";
import { CACHE_KEYS } from "./cacheKeys";
import Welcome from "./features/welcome/Welcome";
import { GoogleLoginButton } from "@/components/GoogleLoginButton";
import GoogleAvatarButton from '@/components/GoogleAvatarButton';
import { useGoogleAuth } from '@/utils/cacheGoogleAuth';
import type { GoogleUser } from '@/types/auth';
import { clearCachedGoogleAuth } from '@/utils/cacheGoogleAuth';

const TABS = [
  { key: "naming", icon: "/home.svg", title: "tabNaming" },
  { key: "bespoke", icon: "/bespoke.svg", title: "tabBespoke" },
  { key: "surname", icon: "/surname.svg", title: "tabSurname" },
  { key: "birth", icon: "/birthday.svg", title: "tabBirthday" },
];

// 全局刷新或重新进入网站时清空所有页面缓存（无论当前tab是否显示）
if (typeof window !== 'undefined') {
  let navType: string | number | undefined;
  const navEntries = window.performance?.getEntriesByType?.('navigation');
  if (navEntries && navEntries.length > 0) {
    navType = (navEntries[0] as unknown as { type: string }).type;
  } else if (window.performance?.navigation) {
    navType = window.performance.navigation.type;
  }
  if (navType === 'reload' || navType === 1 || navType === 'navigate') {
    console.log('Clearing all page cache on reload or navigation');
    window.localStorage.removeItem(CACHE_KEYS.bespokePage);
    window.localStorage.removeItem(CACHE_KEYS.userInfoForm);
    window.localStorage.removeItem(CACHE_KEYS.customNamingPage);
  }
}

export default function Home() {
  const [tab, setTab] = useState("home");
  const [collapsed, setCollapsed] = useState(false);
  const [langList, setLangList] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { t, i18n } = useTranslation();
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("sino-lang");
      const browserLang = navigator.language.startsWith("zh") ? "zh" : "en";
      const targetLang = cached === "zh" || cached === "en" ? cached : browserLang;
      if (i18n.language !== targetLang) {
        i18n.changeLanguage(targetLang);
      }
    }
  }, [i18n]);
  
  // 点击 tabbar item 的处理
  const handleTabClick = (key: string) => {
    if (tab === key) {
      setCollapsed((v) => !v);
    } else {
      setTab(key);
      // 不自动恢复collapsed状态
    }
  };

  // 切换语言时缓存
  const handleLangChange = (newLang: "zh" | "en") => {
    i18n.changeLanguage(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("sino-lang", newLang);
    }
  };
  const [showContactUs, setShowContactUs] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [ContactUs, setContactUs] = useState<React.ComponentType<{ isOpen: boolean; onClose: () => void; lang?: string }> | null>(null);
  
  // 使用新的 Hook 监听 Google Auth 变化
  const googleAuth = useGoogleAuth();
  const [user, setUser] = useState<GoogleUser | null>(null);

  // 当 googleAuth 变化时更新 user
  useEffect(() => {
    if (googleAuth && googleAuth.user) {
      setUser(googleAuth.user);
      console.log('User updated from googleAuth hook:', googleAuth.user);
    } else if (googleAuth === null) {
      setUser(null);
      console.log('User cleared from googleAuth hook');
    }
  }, [googleAuth]);

  // 动态导入组件
  useEffect(() => {
    if (mounted) {
      Promise.all([
        import('./features/contact-us/ContactUs.jsx'),
      ]).then(([contactUsModule]) => {
        setContactUs(() => contactUsModule.default);
      }).catch(error => {
        console.error('动态导入组件失败:', error);
      });
    }
  }, [mounted]);

  if (!mounted) {
    // SSR 或 hydration 前只渲染空白，避免 mismatch
    return null;
  }

  return (
    <div className="layout-root-v2">
      {/* 顶部栏 */}
      <header className="header-v2">
        <div className="header-left">
          <Image src="/icon.png" alt="Logo" className="header-logo" width={32} height={32} />
          <span className="header-title">Sino Name</span>
        </div>
        <div className="header-center">
          <div className="panda-anim-area">
            <Image src="/panda-icon.gif" alt="Panda Animation" className="panda-anim" width={48} height={48} unoptimized />
          </div>
        </div>
        <div className="header-right">
          <div className="lang-switcher-v2">
            <button className="lang-btn-v2" onClick={() => setLangList((v) => !v)}>
              {i18n.language === "zh" ? t("langZh") : t("langEn")}
            </button>
            {langList && (
              <ul className="lang-list-v2">
                <li className={i18n.language === "zh" ? "selected" : ""} onClick={() => { handleLangChange("zh"); setLangList(false); }}>{t("langZh")}</li>
                <li className={i18n.language === "en" ? "selected" : ""} onClick={() => { handleLangChange("en"); setLangList(false); }}>{t("langEn")}</li>
              </ul>
            )}
          </div>
          <button className="contact-btn-v2" onClick={() => setShowContactUs(true)}>{t("contact")}</button>
          {(user && (user.avatar || user.name || user.email)) ? (
            <GoogleAvatarButton user={user} size={40} onClick={() => {
              clearCachedGoogleAuth();
              setUser(null);
            }}/>
          ) : (
            <></>
            // <GoogleLoginButton onLogin={u => setUser(u)} />
          )}
        </div>
      </header>
      {/* ContactUs 弹窗 */}
      {ContactUs && showContactUs && (
        <ContactUs 
          isOpen={showContactUs} 
          onClose={() => setShowContactUs(false)} 
          lang={i18n.language} 
        />
      )}
      {/* 下半部分 */}
      <div className="main-v2" style={{ position: 'relative' }}>
        {showWelcome ? (
          <Welcome handleStart={() => {
            setShowWelcome(false);
            setTab('naming');
          }} />
        ) : (
          <>
            <aside className={"tabbar-v2" + (collapsed ? " collapsed" : "")}
              style={{ transition: 'width 0.3s cubic-bezier(.4,0,.2,1)', width: collapsed ? 60 : 130 }}>
              <div className="tabbar-list">
                {TABS.map((tabItem) => (
                  <div
                    key={tabItem.key}
                    className={"tabbar-item" + (tab === tabItem.key ? " active" : "")}
                    onClick={() => handleTabClick(tabItem.key)}
                  >
                    <div className="tabbar-item-inner">
                      <Image src={tabItem.icon} alt={t(tabItem.title)} className="tabbar-icon" width={24} height={24} />
                      <span
                        className="tabbar-title"
                        style={{
                          transition: 'opacity 0.3s cubic-bezier(.4,0,.2,1)',
                          opacity: collapsed ? 0 : 1,
                          width: collapsed ? 0 : 'auto',
                          pointerEvents: collapsed ? 'none' : 'auto',
                        }}
                      >{t(tabItem.title)}</span>
                    </div>
                  </div>
                ))}
              </div>
              {/* <div className="tabbar-bottom">
                <div className={"tabbar-item" + (tab === "settings" ? " active" : "")}
                  onClick={() => handleTabClick("settings")}
                >
                  <div className="tabbar-item-inner">
                    <img src="/settings.svg" alt={t("settings")} className="tabbar-icon" />
                    <span
                      className="tabbar-title"
                      style={{
                        transition: 'opacity 0.3s cubic-bezier(.4,0,.2,1)',
                        opacity: collapsed ? 0 : 1,
                        width: collapsed ? 0 : 'auto',
                        marginLeft: collapsed ? 0 : 8,
                        pointerEvents: collapsed ? 'none' : 'auto',
                      }}
                    >{t("settings")}</span>
                  </div>
                </div>
              </div> */}
            </aside>
            <section className="tab-content-v2">
              {tab === "naming" && (
                <CustomNamingPage />
              )}
              {tab === "bespoke" && (
                <BespokePage />
              )}
              {tab === "surname" && (
                <Surname />
              )}
              {tab === "birth" && (
                <Birthday />
              )}
              {/* {tab === "settings" && (
                <div className="tab-panel">{t("settings")}</div>
              )} */}
            </section>
          </>
        )}
      </div>
    </div>
  );
}

