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
import UserAvatarButton from '@/components/UserAvatarButton';
import { useUserAuth } from '@/utils/cacheUserAuth';
import type { UserInfo } from '@/types/auth';
import UserProfile from './features/login/UserProfile';
import { getUserAuth, logout } from '@/services/tokenService';
import PandaLoadingView from "@/components/PandaLoadingView";

const TABS = [
  { key: "bespoke", icon: "/bespoke.svg", title: "tabBespoke" },
  { key: "naming", icon: "/home.svg", title: "tabNaming" },
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
  const [tab, setTab] = useState("bespoke");
  const [collapsed, setCollapsed] = useState(false);
  const [langList, setLangList] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { t, i18n } = useTranslation();

  const [loading, setLoading] = useState(true);

  // 使用新的 Hook 监听 Google Auth 变化
  const userAuth = useUserAuth();
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("sino-lang");
      const browserLang = navigator.language.startsWith("zh") ? "zh" : "en";
      const targetLang = cached === "zh" || cached === "en" ? cached : browserLang;
      if (i18n.language !== targetLang) {
        i18n.changeLanguage(targetLang);
      }

      // 当 userAuth 变化时更新 user
      if (userAuth && userAuth.user) {
        setUser(userAuth.user);
        console.log('User updated from userAuth hook:', userAuth.user);
      } else if (userAuth === null) {
        setUser(null);
        console.log('User cleared from userAuth hook');
      }
      
      // 验证用户登录状态
      const validateAuth = async () => {
        try {
          setLoading(true);
          const authResult = await getUserAuth();
          if (authResult && authResult.user) {
            console.log('用户认证信息有效');
          } else {
            console.log('用户未登录或认证信息无效');
          }
        } catch (error) {
          console.error('验证用户认证信息出错:', error);
        } finally {
          setLoading(false);
        }
      };
      
      validateAuth();
      
      // 监听令牌刷新失败事件
      const handleTokenRefreshFailed = (event: CustomEvent) => {
        console.log('收到令牌刷新失败事件:', event.detail);
        setUser(null); // 清除用户状态
        setLoading(false); // 停止加载状态
        
        // 显示友好的错误提示
        const message = event.detail?.message || '登录已过期，请重新登录';
        alert(message);
      };
      
      window.addEventListener('token-refresh-failed', handleTokenRefreshFailed as EventListener);
      
      // 清理事件监听器
      return () => {
        window.removeEventListener('token-refresh-failed', handleTokenRefreshFailed as EventListener);
      };
    }
  }, [i18n, userAuth]);
  
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
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [ContactUs, setContactUs] = useState<React.ComponentType<{ isOpen: boolean; onClose: () => void; lang?: string }> | null>(null);

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

  // 显示加载状态
  if (loading) {
    return (
      <PandaLoadingView />
    );
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
            <UserAvatarButton user={user} size={40} onClick={() => {
              setShowUserProfile(true);
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
      
      {/* UserProfile 弹窗 */}
      {user && showUserProfile && (
        <UserProfile 
          isOpen={showUserProfile}
          onClose={() => setShowUserProfile(false)}
          user={user}
          points={100}
          onLogout={async () => {
            console.log('Logging out user');
            await logout(); // 调用tokenService中的logout函数
            console.log('User logged out');
            setUser(null);
            setShowUserProfile(false);
          }}
        />
      )}
      {/* 下半部分 */}
      <div className="main-v2" style={{ position: 'relative' }}>
        {showWelcome ? (
          <Welcome handleStart={() => {
            setShowWelcome(false);
            setTab('bespoke');
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
                    <Image src="/settings.svg" alt={t("settings")} className="tabbar-icon" width={24} height={24} />
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
              {tab === "bespoke" && (
                <BespokePage />
              )}
              {tab === "naming" && (
                <CustomNamingPage />
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

