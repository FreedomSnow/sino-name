"use client";

import React, { useState } from "react";
import HomePage from "./features/home/HomePage";
import "./page.css";

const TABS = [
  { key: "home", icon: "/home.svg", title: "Home" },
  { key: "more", icon: "/more.svg", title: "More" },
];

export default function Home() {
  const [tab, setTab] = useState("home");
  const [langList, setLangList] = useState(false);
  const [lang, setLang] = useState("zh");
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
  return (
    <div className="layout-root-v2">
      {/* 顶部栏 */}
      <header className="header-v2">
        <div className="header-left">
          <img src="/icon.png" alt="Logo" className="header-logo" />
          <span className="header-title">Sino Name</span>
        </div>
        <div className="header-center">
          <div className="panda-anim-area">
            {/* 熊猫动画区域，可用gif或svg sprite或canvas等实现 */}
            <img src="/panda-icon.gif" alt="Panda Animation" className="panda-anim" />
          </div>
        </div>
        <div className="header-right">
          <div className="lang-switcher-v2">
            <button className="lang-btn-v2" onClick={() => setLangList((v) => !v)}>
              {lang === "zh" ? "中文" : "English"}
            </button>
            {langList && (
              <ul className="lang-list-v2">
                <li className={lang === "zh" ? "selected" : ""} onClick={() => { setLang("zh"); setLangList(false); }}>中文</li>
                <li className={lang === "en" ? "selected" : ""} onClick={() => { setLang("en"); setLangList(false); }}>English</li>
              </ul>
            )}
          </div>
          <button className="contact-btn-v2">联系我们</button>
        </div>
      </header>
      {/* 下半部分 */}
      <div className="main-v2">
        <aside className={"tabbar-v2" + (collapsed ? " collapsed" : "")}
          style={{ transition: 'width 0.3s cubic-bezier(.4,0,.2,1)', width: collapsed ? 60 : 180 }}>
          <div className="tabbar-list">
            {TABS.map((t) => (
              <div
                key={t.key}
                className={"tabbar-item" + (tab === t.key ? " active" : "")}
                onClick={() => handleTabClick(t.key)}
              >
                <div className="tabbar-item-inner">
                  <img src={t.icon} alt={t.title} className="tabbar-icon" />
                  <span
                    className="tabbar-title"
                    style={{
                      transition: 'opacity 0.3s cubic-bezier(.4,0,.2,1)',
                      opacity: collapsed ? 0 : 1,
                      width: collapsed ? 0 : 'auto',
                      marginLeft: collapsed ? 0 : 8,
                      pointerEvents: collapsed ? 'none' : 'auto',
                    }}
                  >{t.title}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="tabbar-bottom">
            <div className={"tabbar-item" + (tab === "settings" ? " active" : "")}
              onClick={() => handleTabClick("settings")}
            >
              <div className="tabbar-item-inner">
                <img src="/settings.svg" alt="Settings" className="tabbar-icon" />
                <span
                  className="tabbar-title"
                  style={{
                    transition: 'opacity 0.3s cubic-bezier(.4,0,.2,1)',
                    opacity: collapsed ? 0 : 1,
                    width: collapsed ? 0 : 'auto',
                    marginLeft: collapsed ? 0 : 8,
                    pointerEvents: collapsed ? 'none' : 'auto',
                  }}
                >Settings</span>
              </div>
            </div>
          </div>
        </aside>
        <section className="tab-content-v2">
          {tab === "home" && (
            <HomePage />
          )}
          {tab === "more" && (
            <div className="tab-panel">更多</div>
          )}
          {tab === "settings" && (
            <div className="tab-panel">设置</div>
          )}
        </section>
      </div>
    </div>
  );
}
