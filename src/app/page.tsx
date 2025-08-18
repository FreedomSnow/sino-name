"use client";

import React, { useState } from "react";
import Head from "next/head";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import BespokePage from "./features/bespoke/Bespoke";
import CustomNamingPage from "./features/custom/CustomNaming";
import Surname from "./features/surname/Surname";
import "./i18n-init";
import "./page.css";
import { useEffect } from "react";
import Birthday from "./features/birth/Birthday";
import Welcome from "./features/welcome/Welcome";

const TABS = [
  { key: "naming", icon: "/home.svg", title: "tabNaming" },
  { key: "bespoke", icon: "/bespoke.svg", title: "tabBespoke" },
  { key: "surname", icon: "/surname.svg", title: "tabSurname" },
  { key: "birth", icon: "/birthday.svg", title: "tabBirthday" },
];

export default function Home() {
  const [tab, setTab] = useState("home");
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
  const [collapsed, setCollapsed] = useState(false);
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
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState<{ name: string; avatar: string; email: string; provider: string; loginTime: number } | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [ContactUs, setContactUs] = useState<React.ComponentType<{ isOpen: boolean; onClose: () => void; lang?: string }> | null>(null);
  const [Login, setLogin] = useState<React.ComponentType<{ isOpen: boolean; onClose: () => void; onLogin: (user: { name: string; avatar: string; email: string; provider: string; loginTime: number }) => void }> | null>(null);

  // 动态导入组件
  useEffect(() => {
    if (mounted) {
      Promise.all([
        import('./features/contact-us/ContactUs.jsx'),
        import('./features/login/Login')
      ]).then(([contactUsModule, loginModule]) => {
        setContactUs(() => contactUsModule.default);
        setLogin(() => loginModule.default);
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
    <>
      <Head>
        <title>{t('title')}</title>
        <meta name="robots" content="index, follow" />
      </Head>
      <div className="layout-root-v2">
        <h1 className="main-title" style={{ display: 'none' }}>{t('mainTitle')}</h1>
        <h3 className="main-subtitle" style={{ display: 'none' }}>{t('mainSubtitle')}</h3>
        {/* 顶部栏 */}
        <meta property="og:title" content={t('title')} style={{ display: 'none' }} />
        <meta property="og:description" content={t('mainSubtitle')} style={{ display: 'none' }} />
        <meta property="og:type" content="website" style={{ display: 'none' }} />
        <meta property="og:url" content="https://TODOUPDATTE.com" style={{ display: 'none' }} />
        <meta property="og:image" content="https://TODOUPDATTE.com/icon.png" style={{ display: 'none' }} />
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
            {user ? (
              <button className="login-btn-v2 user-avatar-btn" style={{ padding: 0, border: 'none', background: 'none', marginLeft: 12 }}>
                {user.avatar ? (
                  <Image src={user.avatar} alt={user.name} width={32} height={32} style={{ borderRadius: '50%', background: '#eee' }} />
                ) : (
                  <span style={{
                    width: 32,
                    height: 32,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    background: '#6c7ae0',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: 18,
                    userSelect: 'none',
                  }}>{user.name ? user.name[0].toUpperCase() : '?'}</span>
                )}
              </button>
            ) : (
              <button className="login-btn-v2" onClick={() => setShowLogin(true)}>{t("login")}</button>
            )}
            {/* Login 弹窗 */}
            {Login && showLogin && (
              <Login isOpen={showLogin} onClose={() => setShowLogin(false)} onLogin={setUser} />
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
    </>
  );
}

