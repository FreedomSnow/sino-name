import React, { useState, useEffect } from 'react';
import { DatePicker, ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import enUS from 'antd/es/locale/en_US';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { useTranslation } from 'react-i18next';
import solarlunar from 'solarlunar';
import lunar from 'lunar-javascript';
const { Lunar } = lunar;
import './Birthday.css';

const Birthday: React.FC<{ onQuery?: (date: string) => void }> = ({ onQuery }) => {
  // 页面首次加载时清空 localStorage（仅刷新或重新进入网站时）
  useEffect(() => {
    let navType: string | number | undefined;
    const navEntries = window.performance?.getEntriesByType?.('navigation');
    if (navEntries && navEntries.length > 0) {
      navType = (navEntries[0] as unknown as { type: string }).type;
    } else if (window.performance?.navigation) {
      navType = window.performance.navigation.type;
    }
    if (navType === 'reload' || navType === 1 || navType === 'navigate') {
      window.localStorage.removeItem('birthdayState');
    }
  }, []);
  // 12生肖列表
  const zodiacListZh = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
  const zodiacListEn = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];

  // 生肖守护神
  const guardiansZh = [
    '千手观音菩萨（鼠）', '虚空藏菩萨（牛）', '虚空藏菩萨（虎）', '文殊菩萨（兔）', '普贤菩萨（龙）', '普贤菩萨（蛇）',
    '大势至菩萨（马）', '大日如来佛（羊）', '大日如来佛（猴）', '不动明王菩萨（鸡）', '阿弥陀佛（狗）', '阿弥陀佛（猪）'
  ];
  const guardiansEn = [
    'Thousand-Hand Guanyin Bodhisattva (Rat)',
    'Akasagarbha Bodhisattva (Ox)',
    'Akasagarbha Bodhisattva (Tiger)',
    'Manjushri Bodhisattva (Rabbit)',
    'Samantabhadra Bodhisattva (Dragon)',
    'Samantabhadra Bodhisattva (Snake)',
    'Mahasthamaprapta Bodhisattva (Horse)',
    'Vairocana Buddha (Goat)',
    'Vairocana Buddha (Monkey)',
    'Acala Bodhisattva (Rooster)',
    'Amitabha Buddha (Dog)',
    'Amitabha Buddha (Pig)'
  ];

  // 星座区间
  const constellationsZh = [
    '摩羯座', '水瓶座', '双鱼座', '白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座'
  ];
  const constellationsEn = [
    'Capricorn', 'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn'
  ];
  const constellationEdge = [20, 19, 21, 21, 21, 22, 23, 23, 23, 24, 23, 22];

  // 农历生辰花
  const birthdayFlowerListZh = [
    '梅花：耐寒坚韧，象征傲骨精神',
    '杏花：寓意自由浪漫',
    '桃花：代表爱情与美好',
    '牡丹：国色天香，象征富贵',
    '石榴花：鲜艳夺目，寓意多子多福',
    '荷花：纯洁高雅，适应力强',
    '茉莉花：香气清新，象征质朴贞洁',
    '桂花：金黄芬芳，象征吉祥与丰收',
    '菊花：耐寒傲霜，象征高洁品格',
    '芙蓉花：清晨绽放，象征纤细艳丽之美',
    '山茶花：红艳耐寒，象征稳重与热情',
    '水仙花：冬日开花，象征团圆与纯洁'
  ];
  // 农历生辰花
  const birthdayFlowerListEn = [
    'Plum Blossom: Hardy and tenacious, symbolizing unyielding spirit.',
    'Apricot Blossom: Symbolizes freedom and romance.',
    'Peach Blossom: Represents love and beauty.',
    'Peony: National beauty, symbol of wealth.',
    'Pomegranate Flower: Bright and eye-catching, meaning fertility and prosperity.',
    'Lotus: Pure and elegant, highly adaptable.',
    'Jasmine: Fresh fragrance, symbolizing simplicity and chastity.',
    'Osmanthus: Golden and fragrant, symbolizing good fortune and harvest.',
    'Chrysanthemum: Hardy and frost-resistant, symbolizing noble character.',
    'Hibiscus: Blooms in the morning, symbolizing delicate beauty.',
    'Camellia: Red and hardy, symbolizing steadiness and enthusiasm.',
    'Narcissus: Blooms in winter, symbolizing reunion and purity.'
  ];
  const { t, i18n } = useTranslation();
  const [birthDate, setBirthDate] = useState<dayjs.Dayjs | null>(() => {
    const saved = window.localStorage.getItem('birthdayState');
    if (saved) {
      try {
        const state = JSON.parse(saved);
        return state.birthDate ? dayjs(state.birthDate) : null;
      } catch { return null; }
    }
    return null;
  });
  const [zodiacIdx, setZodiacIdx] = useState<number | null>(() => {
    const saved = window.localStorage.getItem('birthdayState');
    if (saved) {
      try {
        const state = JSON.parse(saved);
        return typeof state.zodiacIdx === 'number' ? state.zodiacIdx : null;
      } catch { return null; }
    }
    return null;
  });

  useEffect(() => {
    dayjs.locale(i18n.language === 'zh' ? 'zh-cn' : 'en');
  }, [i18n.language]);

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    setBirthDate(date);
    setZodiacIdx(null);
    saveState({ birthDate: date ? date.format('YYYY-MM-DD') : null, zodiacIdx: null });
  };

  const handleQuery = () => {
    if (birthDate) {
      const year = birthDate.year();
      const idx = (year - 1900) % 12;
      setZodiacIdx(idx);
      saveState({ birthDate: birthDate.format('YYYY-MM-DD'), zodiacIdx: idx });
      if (onQuery) onQuery(birthDate.format('YYYY-MM-DD'));
    }
  };
  // 监听 tab 切换或页面恢复时同步状态
  useEffect(() => {
    const syncState = () => {
      const saved = window.localStorage.getItem('birthdayState');
      if (saved) {
        try {
          const state = JSON.parse(saved);
          setBirthDate(state.birthDate ? dayjs(state.birthDate) : null);
          setZodiacIdx(typeof state.zodiacIdx === 'number' ? state.zodiacIdx : null);
        } catch {}
      }
    };
    window.addEventListener('visibilitychange', syncState);
    return () => {
      window.removeEventListener('visibilitychange', syncState);
    };
  }, []);

  // 保存页面所有相关状态到 localStorage
  function saveState(partial: Record<string, unknown>) {
    const prev = window.localStorage.getItem('birthdayState');
    let state: Record<string, unknown> = {};
    if (prev) {
      try { state = JSON.parse(prev); } catch { state = {}; }
    }
    state = { ...state, birthDate: birthDate ? birthDate.format('YYYY-MM-DD') : null, zodiacIdx, ...partial };
    window.localStorage.setItem('birthdayState', JSON.stringify(state));
  }

  return (
    <ConfigProvider locale={i18n.language === 'zh' ? zhCN : enUS}>
      <div className="birthday-root">
        <div className="birthday-title">{t('birthdayTitle')}</div>
        <div className="birthday-content">
            <div className="birthday-row">
                <span className="birthday-label">{t('birthdayTitle')}</span>
                <DatePicker
                    className="birthday-picker"
                    value={birthDate}
                    onChange={handleDateChange}
                    format={i18n.language === 'zh' ? 'YYYY-MM-DD' : 'MM/DD/YYYY'}
                    placeholder={t('birthdayPickerPlaceholder')}
                    disabledDate={current => current && current > dayjs()}
                    allowClear
                />
                <button className="birthday-query-btn" onClick={handleQuery}>{t('birthdayQueryBtn')}</button>
            </div>
            {birthDate && zodiacIdx !== null && (
              <>
                <div className="birthday-zodiac-row">
                    <span className="birthday-zodiac-label">{t('birthdayZodiacLabel')}</span>
                    <span className="birthday-zodiac-value">
                        {i18n.language === 'zh' ? zodiacListZh[zodiacIdx] : zodiacListEn[zodiacIdx]}
                    </span>
                </div>
                <div className="birthday-guardian-row">
                  <span className="birthday-guardian-label">{t('birthdayGuardianLabel')}</span>
                  <span className="birthday-guardian-value">
                    {(() => {
                      return i18n.language === 'zh' ? guardiansZh[zodiacIdx] : guardiansEn[zodiacIdx];
                    })()}
                  </span>
                </div>
                <div className="birthday-constellation-row">
                  <span className="birthday-constellation-label">{t('birthdayConstellationLabel')}</span>
                  <span className="birthday-constellation-value">
                    {(() => {
                      if (!birthDate) return '';
                      const month = birthDate.month() + 1;
                      const day = birthDate.date();
                      let idx = month - 1;
                      if (day < constellationEdge[idx]) idx = (idx + 11) % 12;
                      return i18n.language === 'zh' ? constellationsZh[idx] : constellationsEn[idx];
                    })()}
                  </span>
                </div>
                <div className="birthday-lunar-row">
                    <span className="birthday-lunar-label">{t('birthdayLunarLabel')}</span>
                    <span className="birthday-lunar-value">
                        {(() => {
                          const lunarDate = solarlunar.solar2lunar(birthDate.year(), birthDate.month() + 1, birthDate.date());
                          return `${lunarDate.lYear}-${lunarDate.lMonth}-${lunarDate.lDay}`;
                        })()}
                    </span>
                </div>
                <div className="birthday-flower-row">
                    <span className="birthday-flower-label">{t('birthdayFlowerLabel')}</span>
                    <span className="birthday-flower-value">
                      {(() => {
                        if (!birthDate || zodiacIdx === null) return '';
                        const lunarDate = solarlunar.solar2lunar(birthDate.year(), birthDate.month() + 1, birthDate.date());
                        const monthIdx = lunarDate.lMonth - 1;
                        if (monthIdx < 0 || monthIdx > 11) return '';
                        return i18n.language === 'zh'
                          ? birthdayFlowerListZh[monthIdx]
                          : birthdayFlowerListEn[monthIdx];
                      })()}
                    </span>
                </div>
                <div className="birthday-bazi-row">
                  <span className="birthday-bazi-label">{t('birthdayBaziLabel')}</span>
                  <span className="birthday-bazi-value">
                    {(() => {
                      const lunarDate0 = solarlunar.solar2lunar(birthDate.year(), birthDate.month() + 1, birthDate.date());
                      const lunarDate1 = Lunar.fromYmd(lunarDate0.lYear, lunarDate0.lMonth, lunarDate0.lDay, lunarDate0.isLeapMonth);
                      const eightChar = lunarDate1.getEightChar();
                      // 获取年、月、日干支和五行
                      const ganzhi = eightChar.getYear() + '年 ' + eightChar.getMonth() + '月 ' + eightChar.getDay() + '日';
                      const wuxing = eightChar.getYearWuXing() + ' ' + eightChar.getMonthWuXing() + ' ' + eightChar.getDayWuXing();
                      return i18n.language === 'zh'
                        ? `八字：${ganzhi}，五行：${wuxing}`
                        : `Eight Characters: ${eightChar.getYear()} Year ${eightChar.getMonth()} Month ${eightChar.getDay()} Day, Five Elements: ${eightChar.getYearWuXing()} ${eightChar.getMonthWuXing()} ${eightChar.getDayWuXing()}`;
                    })()}
                  </span>
                </div>
              </>
            )}
        </div>

      </div>
    </ConfigProvider>
  );
};

export default Birthday;
