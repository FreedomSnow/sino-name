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
      welcomeChatMsg: `您好，欢迎来到姓名定制服务！我是您的专属客服 Mike。\n\n在中国，姓名通常是姓氏在前，名字在后。\n姓氏世代相传，名字则由父母选取，通常为一到两个字，\n寄托着美好的愿望，例如希望孩子健康、聪明或幸福。`,
      surnameChatMsg: `现在，我们先来定制您的姓氏吧。\n中国俗称“百家姓”，我将列出一些常见姓氏供您参考，您可以自行选择，或者由我来为您挑选。`,
      mikeCustomSurname: "Mike为您定制姓氏",
      inputSelectedSurnameTip: `选中“{{surname}}”为您的姓氏，确认无误后请发送给Mike`,
      selectedUserSurname:`我选中“{{surname}}”作为姓氏`,
      nameChatMsg: `恭喜您拥有了正宗的中国姓氏“{{surname}}”，接下来让我们来定制名吧。\n请您填写下列信息并发送给我`,
      formNameLabel: "姓名",
      formNamePlaceholder: "请输入姓名",
      formGenderLabel: "性别",
      formGenderMale: "男",
      formGenderFemale: "女",
      formGenderSecret: "保密",
      formBirthLabel: "出生年月",
      formBirthPlaceholder: "请选择出生日期",
      formBirthDesc: "出生日期便于我们推算出您的中国生肖，中国八字，幸运石，守护神等信息",
      formClassicLabel: "借鉴古籍",
      formClassicAny: "随意",
      formClassicShijing: "诗经",
      formClassicPoetry: "古诗词",
      formNoteLabel: "其他说明",
      formNotePlaceholder: "如有特殊需求请填写",
      formSubmitBtn: "提交",
      // ContactUs
      contactus_title: "联系我们",
      contactus_name: "姓名",
      contactus_namePlaceholder: "请输入您的姓名",
      contactus_email: "邮箱",
      contactus_emailPlaceholder: "请输入您的邮箱地址",
      contactus_subject: "主题",
      contactus_subjectPlaceholder: "请输入反馈主题",
      contactus_message: "消息内容",
      contactus_messagePlaceholder: "请详细描述您的问题或建议...",
      contactus_contactInfo: "联系信息",
      contactus_emailInfo: "邮箱：example@email.com",
      contactus_responseTime: "我们会在24小时内回复您的消息",
      contactus_cancel: "取消",
      contactus_submit: "提交",
      contactus_submitSuccess: "感谢您的反馈！我们会尽快回复您。",
      contactus_submitError: "提交失败，请稍后重试"
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
      welcomeChatMsg:`Hello and welcome to the Personalized Name Service! I'm Mike, your dedicated service representative.\n\nIn China, names typically follow the order of surname first, followed by the given name.\n Surnames are passed down through generations, while given names are chosen by parents. \nThey are usually one or two characters long and carry positive wishes, such as hopes for the child's health, intelligence, or happiness.`,
      surnameChatMsg: `Now, let's start by customizing your surname. \nIn China we have the concept of the "Hundred Family Surnames." I will list some common surnames for you. You can choose one yourself, or I can choose one for you.`,
      mikeCustomSurname: "Mike Custom Surname",
      inputSelectedSurnameTip: `You have selected "{{surname}}" as your surname. Please send it to Mike for confirmation.`,
      selectedUserSurname: `I have selected "{{surname}}" as my surname`,
      nameChatMsg:`Congratulations on acquiring the authentic Chinese surname "{{surname}}". \nNow, let's proceed to customize your given name.\nPlease fill out the following information and send it to me.`,
      formNameLabel: "Name",
      formNamePlaceholder: "Please enter your name",
      formGenderLabel: "Gender",
      formGenderMale: "Male",
      formGenderFemale: "Female",
      formGenderSecret: "Secret",
      formBirthLabel: "Date of Birth",
      formBirthPlaceholder: "Please select your birth date",
      formBirthDesc: "Birth helps us calculate your Chinese zodiac, Bazi, lucky stone, guardian deity, etc.",
      formClassicLabel: "Classic Reference",
      formClassicAny: "Any",
      formClassicShijing: "Shijing",
      formClassicPoetry: "Ancient Poetry",
      formNoteLabel: "Other Notes",
      formNotePlaceholder: "Please fill in if you have special requirements",
      formSubmitBtn: "Submit",
      // ContactUs
      contactus_title: "Contact Us",
      contactus_name: "Name",
      contactus_namePlaceholder: "Enter your name",
      contactus_email: "Email",
      contactus_emailPlaceholder: "Enter your email address",
      contactus_subject: "Subject",
      contactus_subjectPlaceholder: "Enter feedback subject",
      contactus_message: "Message",
      contactus_messagePlaceholder: "Please describe your issue or suggestion in detail...",
      contactus_contactInfo: "Contact Information",
      contactus_emailInfo: "Email: example@email.com",
      contactus_responseTime: "We will respond to your message within 24 hours",
      contactus_cancel: "Cancel",
      contactus_submit: "Submit",
      contactus_submitSuccess: "Thank you for your feedback! We will get back to you soon.",
      contactus_submitError: "Submission failed, please try again later"
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
