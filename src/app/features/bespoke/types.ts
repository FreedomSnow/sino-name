// 通用姓氏AI结果类型，供各组件引用
export interface LastNameItem {
  lastName: string;
  pinyin: string;
  explanation: {
    zh: string;
    en: string;
  };
}
