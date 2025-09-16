import React, { useEffect } from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import enUS from 'antd/es/locale/en_US';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { useTranslation } from 'react-i18next';

// 导入子组件
import { DatePickerSection } from './components/DatePickerSection';
import { ResultDisplay } from './components/ResultDisplay';

// 导入 Hook 和工具函数
import { getZodiac } from './utils';
import { useBirthdayState } from './hooks/useBirthdayState';
import './Birthday.css';

const Birthday: React.FC<{ onQuery?: (date: string) => void }> = ({ onQuery }) => {
  const { t, i18n } = useTranslation();
  const { birthDate, setBirthDate, zodiacIdx, setZodiacIdx, saveState } = useBirthdayState();

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
      const idx = getZodiac(birthDate.year());
      setZodiacIdx(idx);
      saveState({ birthDate: birthDate.format('YYYY-MM-DD'), zodiacIdx: idx });
      if (onQuery) onQuery(birthDate.format('YYYY-MM-DD'));
    }
  };

  return (
    <ConfigProvider locale={i18n.language === 'zh' ? zhCN : enUS}>
      <div className="birthday-root">
        <div className="birthday-title">{t('birthdayTitle')}</div>
        <div className="birthday-content">
          {/* 日期选择器部分 */}
          <DatePickerSection
            birthDate={birthDate}
            onDateChange={handleDateChange}
            onQuery={handleQuery}
          />

          {/* 结果显示部分 */}
          {birthDate && zodiacIdx !== null && (
            <ResultDisplay birthDate={birthDate} zodiacIdx={zodiacIdx} />
          )}
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Birthday;
