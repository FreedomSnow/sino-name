// 用户信息类型
export interface SurnameItem {
    name: string;
    pinyin?: string;
    explanation_cn?: string;
    explanation_en?: string;
}

export interface CustomNameItem {
    name: string;
    pinyin?: string;
    source_cn?: string;
    source_en?: string;
}