
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// 你可以将文案内容替换为自己的
const resources = {
  zh: {
    translation: {
      title: "Sino Name - AI智能起名 | 百家姓定制 | 宝宝取名 | 专业中文英文名字生成",
      mainTitle: "Sino Name - AI智能起名平台",
      mainSubtitle: "AI智能起名 · 百家姓 · 定制专属名字",
      // ...existing code...
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
      // OAuth Success/Failed
      loading: "加载中",
      success: "成功",
      error: "错误",
      login_successful: "登录成功！",
      login_failed: "登录失败",
      verifying_login: "正在验证登录信息...",
      missing_parameters: "缺少必要的参数",
      verification_failed: "验证失败",
      processing_error: "处理过程中发生错误",
      google_login_success: "您已成功使用谷歌账号登录",
      user_avatar: "用户头像",
      welcome: "欢迎",
      continue_using: "继续使用",
      back_to_home: "返回首页",
      try_again: "重试",
      error_code: "错误代码",
      // OAuth Pages
      loading_user_info: "加载用户信息中...",
      loading_error_info: "加载错误信息中...",
      verification_successful: "验证成功",
      oauth_success_title: "OAuth登录成功！",
      google_account_verified: "Google账号已验证",
      oauth_success_message: "恭喜！您已成功通过Google账号登录。",
      user_information: "用户信息",
      name: "姓名",
      email: "邮箱",
      avatar: "头像",
      redirecting_in_seconds: "{{seconds}}秒后自动跳转到首页",
      continue_to_app: "继续使用应用",
      what_you_can_do: "您现在可以：",
      access_protected_features: "访问所有受保护的功能",
      save_personal_settings: "保存您的个人设置",
      use_advanced_features: "使用高级功能",
      manage_account_info: "管理您的账户信息",
      // OAuth Error Pages
      oauth_error_title: "OAuth登录失败",
      error_type: "错误类型",
      error_details: "错误详情",
      status_code: "状态码",
      timestamp: "时间",
      retry_login: "重新登录",
      suggested_solutions: "建议解决方案",
      common_solutions: "常见问题解决方案：",
      check_network_connection: "检查网络连接是否正常",
      ensure_google_account_available: "确保Google账号可用",
      clear_browser_cache: "清除浏览器缓存和cookies",
      contact_support_if_persistent: "如果问题持续，请联系技术支持",
      //Common
      pronounce: "发音",
      edit: "编辑",
      submit: "提交",
      fullName: "姓名",
      // Welcome
      welcome_title: "欢迎来到Sino Name!",
      welcomeDesc: `我们是高端中文命名平台，提供以下专业服务：<br><br><b>自主命名服务</b>：请详述您的需求（信息越完整越好），我们将据此生成个性化中文名<br><b>深度定制姓名</b>：带您体验纯正中式命名流程，融合传统习俗，打造契合您特质的中文名<br><b>中华姓氏库</b>：详解中国姓氏体系，涵盖发音、书写及源流<br><b>生辰命理分析</b>：根据您的出生日期，提供五行八字等传统命理解读`,
      welcomeStart: "→ 开始你的中文命名之旅",
      // Naming
      customNamingTitle: "自主命名服务",
      customNamingTip: "输入姓名生成发音相近的中文名，想要更个性化的中文名可添加描述",
      customNamingNamePlaceholder: "请输入姓名",
      customNamingDesc: "需求",
      customNamingDescPlaceholder: "请输入您的命名需求...",
      // Bespoke
      bespokeTitle: "深度定制姓名",
      bespokeChatWelcomeMsg: `您好，欢迎体验姓名定制服务！我是您的专属顾问Mike。\n在中国文化中，姓名结构为姓氏居前、名字在后。姓氏承袭家族血脉，名字则由父母精心择定，通常含1-2个汉字，凝聚美好期许——如祈愿子女康健聪慧、人生顺遂。`,
      bespokeChatSurnameMsg: `现在，让我们开始为您定制专属姓氏。您可从中国姓氏库中自由选择，或由我为您精心推荐。`,
      bespokeMoreSurnames: "中国百家姓",
      bespokeMikeCustom: "Mike帮您定制姓氏",
      bespokeInputSelectedSurnameTip: `选中<b>"{{surname}}"</b>为您的姓氏, 您意下如何？若方案满意，请确认回复。`,
      bespokeInputSend: "发送",
      bespokeSelectedSurname:`我选中<b>"{{surname}}"</b>作为姓氏`,
      bespokeChatInfoMsg: `恭贺您获得传承级中国姓氏<b>"{{surname}}"</b>，现在开启名字定制阶段。请完善以下信息并提交于我：`,
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
      title: "Sino Name - AI-powered Naming | Surname Customization | Baby Name | Professional Chinese & English Name Generator",
      mainTitle: "Sino Name - AI-powered Naming Platform",
      mainSubtitle: "AI Naming · Surname Database · Custom Name Generation",
      // ...existing code...
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
      // OAuth Success/Failed
      loading: "Loading",
      success: "Success",
      error: "Error",
      login_successful: "Login Successful!",
      login_failed: "Login Failed",
      verifying_login: "Verifying login information...",
      missing_parameters: "Missing required parameters",
      verification_failed: "Verification failed",
      processing_error: "An error occurred during processing",
      google_login_success: "You have successfully logged in with your Google account",
      user_avatar: "User Avatar",
      welcome: "Welcome",
      continue_using: "Continue Using",
      back_to_home: "Back to Home",
      try_again: "Try Again",
      error_code: "Error Code",
      // OAuth Pages
      loading_user_info: "Loading user information...",
      loading_error_info: "Loading error information...",
      verification_successful: "Verification Successful",
      oauth_success_title: "OAuth Login Successful!",
      google_account_verified: "Google Account Verified",
      oauth_success_message: "Congratulations! You have successfully logged in with your Google account.",
      user_information: "User Information",
      name: "Name",
      email: "Email",
      avatar: "Avatar",
      redirecting_in_seconds: "Redirecting to home page in {{seconds}} seconds",
      continue_to_app: "Continue to App",
      what_you_can_do: "What you can do now:",
      access_protected_features: "Access all protected features",
      save_personal_settings: "Save your personal settings",
      use_advanced_features: "Use advanced features",
      manage_account_info: "Manage your account information",
      // OAuth Error Pages
      oauth_error_title: "OAuth Login Failed",
      error_type: "Error Type",
      error_details: "Error Details",
      status_code: "Status Code",
      timestamp: "Timestamp",
      retry_login: "Retry Login",
      suggested_solutions: "Suggested Solutions:",
      common_solutions: "Common Solutions:",
      check_network_connection: "Check network connection",
      ensure_google_account_available: "Ensure Google account is available",
      clear_browser_cache: "Clear browser cache and cookies",
      contact_support_if_persistent: "Contact support if problem persists",
      //Common
      pronounce: "Pronounce",
      edit: "Edit",
      submit: "Submit",
      fullName: "Name",
      // Welcome
      welcome_title: "Welcome to Sino Name!",
      welcomeDesc: `We are a premier Chinese naming platform offering these professional services:

<b>Custom Name Creation</b>: Submit detailed requirements (the more specific the better) to receive personalized Chinese name options
<b>Tailored Naming Experience</b>: We guide you through authentic Chinese naming rituals incorporating cultural traditions to craft your perfect Chinese name
<b>Chinese Surname Database</b>: Comprehensive reference of all Chinese surnames with pronunciation, character writing, and historical origins
<b>Birth Date Analysis</b>: Receive metaphysical interpretations including Wu Xing (Five Elements) and Ba Zi (Four Pillars) based on your birth date`,
      welcomeStart: "→ Start Your Chinese Naming Journey",
      // Naming
      customNamingTitle: "Custom Name Creation",
      customNamingTip: "Input your name to generate a Chinese name with a similar pronunciation. If you want a more personalized Chinese name, you can add a description.",
      customNamingNamePlaceholder: "Please enter your name",
      customNamingDesc: "Description",
      customNamingDescPlaceholder: "Please enter your naming requirements...",
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

// 获取默认语言，确保服务器端和客户端一致
const getDefaultLanguage = () => {
  // 服务器端始终使用中文，避免水合错误
  if (typeof window === "undefined") {
    return "zh";
  }
  
  // 客户端优先使用localStorage中的语言设置
  const storedLang = localStorage.getItem("sino-lang");
  if (storedLang && (storedLang === "zh" || storedLang === "en")) {
    return storedLang;
  }
  
  // 如果没有存储的语言设置，默认使用中文
  return "zh";
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getDefaultLanguage(),
    fallbackLng: "zh",
    interpolation: { escapeValue: false },
    // 确保服务器端和客户端使用相同的语言
    react: {
      useSuspense: false
    },
    // 添加语言检测和同步
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

// 在客户端初始化后同步语言设置
if (typeof window !== "undefined") {
  const currentLang = i18n.language;
  const storedLang = localStorage.getItem("sino-lang");
  
  // 如果localStorage中的语言与当前语言不同，同步更新
  if (storedLang && storedLang !== currentLang) {
    i18n.changeLanguage(storedLang);
  } else if (!storedLang) {
    // 如果没有存储的语言，将当前语言存储到localStorage
    localStorage.setItem("sino-lang", currentLang);
  }
}

export default i18n;
