import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// 你可以将文案内容替换为自己的
const resources = {
  zh: {
    translation: {
      langZh: "中文",
      langEn: "英文",
      contact: "联系我们",
      tabHome: "首页",
      tabMore: "更多",
      settings: "设置",
      more: "更多内容",
      welcome: "欢迎来到Sino Name!",
      homepageDesc: "这是首页描述。"
    }
  },
  en: {
    translation: {
      langZh: "Chinese",
      langEn: "English",
      contact: "Contact Us",
      tabHome: "Home",
      tabMore: "More",
      settings: "Settings",
      more: "More Content",
      welcome: "Welcome to Sino Name!",
      homepageDesc: "This is the homepage description."
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng:
      typeof window !== "undefined"
        ? (localStorage.getItem("sino-lang") || (navigator.language.startsWith("zh") ? "zh" : "en"))
        : (typeof navigator !== "undefined" && navigator.language.startsWith("zh") ? "zh" : "en"),
    fallbackLng: "en",
    interpolation: { escapeValue: false }
  });

export default i18n;
