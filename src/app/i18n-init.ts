
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import BespokePage from "./features/bespoke/Bespoke";

// 你可以将文案内容替换为自己的
const resources = {
  zh: {
    translation: {
      langZh: "中文",
      langEn: "English",
      contact: "联系我们",
      login: "登录",
      // Tabs
      tabNaming: "起名",
      tabBespoke: "定制",
      tabSurname: "姓氏",
      tabBirthday: "生日",
      settings: "设置",
      // Login
      login_title: "三方登录",
      login_with: "使用{{provider}}登录",
      //Common
      pronounce: "发音",
      edit: "编辑",
      submit: "提交",
      // Welcome
      welcome: "欢迎来到Sino Name!",
      welcomeDesc: `我们是高端中文命名平台，提供以下专业服务：<br><br><b>自主命名服务</b>：请详述您的需求（信息越完整越好），我们将据此生成个性化中文名<br><b>深度定制姓名</b>：带您体验纯正中式命名流程，融合传统习俗，打造契合您特质的中文名<br><b>中华姓氏库</b>：详解中国姓氏体系，涵盖发音、书写及源流<br><b>生辰命理分析</b>：根据您的出生日期，提供五行八字等传统命理解读`,
      welcomeStart: "→ 开始你的中文命名之旅",
      // Naming
      customNamingTitle: "自主命名服务",
      customNamingPlaceholder: "请输入您的命名需求...",
      // Bespoke
      bespokeTitle: "深度定制姓名",
      bespokeChatWelcomeMsg: `您好，欢迎体验姓名定制服务！我是您的专属顾问Mike。\n在中国文化中，姓名结构为姓氏居前、名字在后。姓氏承袭家族血脉，名字则由父母精心择定，通常含1-2个汉字，凝聚美好期许——如祈愿子女康健聪慧、人生顺遂。`,
      bespokeChatSurnameMsg: `现在，让我们开始为您定制专属姓氏。您可从中国姓氏库中自由选择，或由我为您精心推荐。`,
      bespokeMoreSurnames: "中国百家姓",
      bespokeMikeCustom: "Mike帮您定制姓氏",
      bespokeInputSelectedSurnameTip: `选中<b>“{{surname}}”</b>为您的姓氏, 您意下如何？若方案满意，请确认回复。`,
      bespokeInputSend: "发送",
      bespokeSelectedSurname:`我选中<b>“{{surname}}”</b>作为姓氏`,
      bespokeChatInfoMsg: `恭贺您获得传承级中国姓氏<b>“{{surname}}”</b>，现在开启名字定制阶段。请完善以下信息并提交于我：`,
      bespokeLastNameChoose:`基于您的姓氏<b>"{{lastName}}"</b>，我们为您定制了以下中国姓氏方案，敬请审阅。请选择最契合您心意的姓氏并提交`,
      // UserInfoForm
      formLastNameLabel: "姓氏",
      formLastNamePlaceholder: "请输入姓氏",
      formGivenNameLabel: "名字",
      formGivenNamePlaceholder: "请输入名字",
      formGenderLabel: "性别",
      formGenderMale: "男",
      formGenderFemale: "女",
      formGenderSecret: "保密",
      formBirthLabel: "出生年月",
      formBirthPlaceholder: "请选择出生日期",
      formBirthDesc: "出生日期便于我们推算出您的中国生肖, 中国八字, 幸运石, 守护神等信息",
      formClassicLabel: "借鉴古籍",
      formClassicAny: "随意",
      formClassicShijing: "诗经",
      formClassicPoetry: "古诗词",
      formNoteLabel: "其他说明",
      formNotePlaceholder: "如有特殊需求请填写",
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
      contactus_submitSuccess: "感谢您的反馈！我们会尽快回复您。",
      contactus_submitError: "提交失败, 请稍后重试",
      // Surname
      surname_title: "中国百家姓",
      active_surname_use: "使用",
      // Birthday
      birthdayTitle: "出生日期",
      birthdayPickerPlaceholder: "请选择您的生日",
      birthdayQueryBtn: "查询",
      birthdayZodiacLabel: "您的生肖是",
      birthdayGuardianLabel: "生肖守护神",
      birthdayConstellationLabel: "您的星座是",
      birthdayLunarLabel: "农历生日是",
      birthdayFlowerLabel: "农历生辰花",
      birthdayBaziLabel: "农历生辰五行八字",
    }
  },
  en: {
    translation: {
      langZh: "中文",
      langEn: "English",
      contact: "Contact Us",
      login: "Login",
      // Tabs
      tabNaming: "Naming",
      tabBespoke: "Bespoke",
      tabSurname: "Surname",
      tabBirthday: "Birthday",
      settings: "Settings",
      // Login
      login_title: "Social Login",
      login_with: "Login with {{provider}}",
      //Common
      pronounce: "Pronounce",
      edit: "Edit",
      submit: "Submit",
      // Welcome
      welcome: "Welcome to Sino Name!",
      welcomeDesc: `We are a premier Chinese naming platform offering these professional services:

<b>Custom Name Creation</b>: Submit detailed requirements (the more specific the better) to receive personalized Chinese name options
<b>Tailored Naming Experience</b>: We guide you through authentic Chinese naming rituals incorporating cultural traditions to craft your perfect Chinese name
<b>Chinese Surname Database</b>: Comprehensive reference of all Chinese surnames with pronunciation, character writing, and historical origins
<b>Birth Date Analysis</b>: Receive metaphysical interpretations including Wu Xing (Five Elements) and Ba Zi (Four Pillars) based on your birth date`,
      welcomeStart: "→ Start Your Chinese Naming Journey",
      // Naming
      customNamingTitle: "Custom Name Creation",
      customNamingPlaceholder: "Please enter your naming requirements...",
      // Bespoke
      bespokeTitle: "Tailored bespoke Experience",
      bespokeChatWelcomeMsg:`Welcome to our Bespoke bespoke Service! I'm Mike, your dedicated consultant. \nIn Chinese tradition, surnames precede given names. Surnames carry ancestral heritage, while given names—typically one or two characters—are carefully chosen by parents to embody meaningful aspirations, such as wishes for health, wisdom, or happiness.`,
      bespokeChatSurnameMsg: `Let's begin crafting your bespoke surname now. You may select any from our curated Chinese surname collection, or allow me to handpick options for you.`,
      bespokeMoreSurnames: "Classic Chinese Surnames",
      bespokeMikeCustom: "Mike Bespoke Surnames for You",
      bespokeInputSelectedSurnameTip: `You have selected <b>"{{surname}}"</b> as your surname. How do you find the proposal? Should it meet your expectations, kindly send your approval.`,
      bespokeInputSend: "Send",
      bespokeSelectedSurname: `I have selected <b>"{{surname}}"</b> as my surname`,
      bespokeChatInfoMsg:`Congratulations on your heritage-grade Chinese surname <b>"{{surname}}"</b>! Let's now curate your given name. Kindly complete the profile below and send it over:`,
      bespokeLastNameChoose: `Based on your LastName <b>"{{lastName}}"</b>, I've curated these bespoke Chinese surname options. Please review whether any resonates with you, and feel free to select the best suiting one for confirmation.`,
      // UserInfoForm
      formLastNameLabel: "Last Name",
      formLastNamePlaceholder: "Please enter your last name",
      formGivenNameLabel: "Given Name",
      formGivenNamePlaceholder: "Please enter your given name",
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
    
      contactus_submitSuccess: "Thank you for your feedback! We will get back to you soon.",
      contactus_submitError: "Submission failed, please try again later",
      // Surname
      surname_title: "Chinese Surnames",
      active_surname_use: "Use",
      // Birthday
      birthdayTitle: "Birthday",
      birthdayPickerPlaceholder: "Please select your birthday",
      birthdayQueryBtn: "Query",
      birthdayZodiacLabel: "Your zodiac sign is",
      birthdayGuardianLabel: "Zodiac Guardian Deity",
      birthdayConstellationLabel: "Your constellation is",
      birthdayLunarLabel: "Lunar Date is",
      birthdayFlowerLabel: "Lunar Birthday Flower",
      birthdayBaziLabel: "Lunar Bazi (Five Elements & Eight Characters)",
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
