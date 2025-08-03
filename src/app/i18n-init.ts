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
      homepageDesc: `是否渴望拥有一个承载文化灵魂的中文名？\n<strong>「Sino Name」</strong>为旅居者、求学者及所有倾心东方文化者，奉上专业级中文命名艺术。\n\n我们将以你的个性为墨，以千年文化为砚，精心淬炼：\n❖ 深度文化浸润——打破音译桎梏，让名字自然流淌于中文语境 \n❖ 三重匠心交付——3-5个定制选项，每个名字皆附：\n　　▸ 诗意外延解析\n　　▸ 声韵发音指南\n　　▸ 汉字美学赏析\n❖ 永恒文化印记——让每个音节都镌刻你的独特气质\n\n此刻启程，让世界听见你的东方回响`,
      homepageStart: "→ 开始你的中文命名之旅",
      customNameTitle: "姓名定制",
      customNameFirstChatMsg: `你好，欢迎来到姓名定制服务！我是你的专属客服 Mike。\n\n在中国，姓名通常是姓氏在前，名字在后。\n姓氏世代相传，名字则由父母选取，通常为一到两个字，\n寄托着美好的愿望，例如希望孩子健康、聪明或幸福。`,
      customNameSecondChatMsg: `现在，我们先来定制您的姓氏吧。中国俗称“百家姓”，我将列出一些常见姓氏供您参考，您可以自行选择，或者由我来为您挑选。`
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
      homepageDesc: `Longing for a Chinese name with true cultural resonance? \n<strong>「Sino Name」</strong> crafts professionally personalized names for expats, students, and all China enthusiasts. \n\nWe blend your essence with 5,000 years of tradition to create: \n❖ Cultural Integration－Names born from Chinese linguistic soil, not mechanical translation \n❖ Triple-Layer Expertise－Receive 3-5 options featuring:\n　　▸ Poetic meaning breakdown\n　　▸ Tone-perfect pronunciation guide\n　　▸ Calligraphic character artistry\n❖ Timeless Identity－Every syllable echoes your unique spirit \n\nBegin Your Legacy in Characters`,
      homepageStart: "→ Start Your Chinese Naming Journey",
      customNameTitle: "Name Customization",
      customNameFirstChatMsg:`Hello and welcome to the Personalized Name Service! I'm Mike, your dedicated service representative.\n\nIn China, names typically follow the order of surname first, followed by the given name.\n Surnames are passed down through generations, while given names are chosen by parents. \nThey are usually one or two characters long and carry positive wishes, such as hopes for the child's health, intelligence, or happiness.`,
      customNameSecondChatMsg: `Now, let's start by customizing your surname. In China we have the concept of the "Hundred Family Surnames." I will list some common surnames for you. You can choose one yourself, or I can choose one for you.`
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
