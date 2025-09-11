import dayjs from 'dayjs';
import solarlunar from 'solarlunar';
import lunar from 'lunar-javascript';
import { BIRTHDAY_FLOWER_DATA } from './constants';

const { Lunar } = lunar;

// 星座计算函数
export const getConstellation = (month: number, day: number): number => {
  const constellationRanges = [
    [12, 22, 12, 31, 0], [1, 1, 1, 19, 0],    [1, 20, 2, 18, 1],   [2, 19, 3, 20, 2],
    [3, 21, 4, 19, 3],   [4, 20, 5, 20, 4],   [5, 21, 6, 21, 5],   [6, 22, 7, 22, 6],
    [7, 23, 8, 22, 7],   [8, 23, 9, 22, 8],   [9, 23, 10, 23, 9],  [10, 24, 11, 22, 10],
    [11, 23, 12, 21, 11]
  ];

  for (const [startMonth, startDay, endMonth, endDay, index] of constellationRanges) {
    if (startMonth === endMonth) {
      if (month === startMonth && day >= startDay && day <= endDay) {
        return index;
      }
    } else {
      if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) {
        return index;
      }
    }
  }
  return 0;
};

// 计算生肖
export const getZodiac = (year: number): number => {
  return (year - 1900) % 12;
};

// 获取农历日期
export const getLunarDate = (date: dayjs.Dayjs) => {
  const lunarDate = solarlunar.solar2lunar(date.year(), date.month() + 1, date.date());
  return `${lunarDate.lYear}-${lunarDate.lMonth}-${lunarDate.lDay}`;
};

// 获取生辰花
export const getBirthdayFlower = (date: dayjs.Dayjs, language: string) => {
  const lunarDate = solarlunar.solar2lunar(date.year(), date.month() + 1, date.date());
  const monthIdx = lunarDate.lMonth - 1;
  if (monthIdx < 0 || monthIdx > 11) return '';

  const flowers = language === 'zh' ? BIRTHDAY_FLOWER_DATA.zh : BIRTHDAY_FLOWER_DATA.en;
  return flowers[monthIdx];
};

// 获取八字五行
export const getBaziWuxing = (date: dayjs.Dayjs, language: string) => {
  const lunarDate0 = solarlunar.solar2lunar(date.year(), date.month() + 1, date.date());
  const lunarDate1 = Lunar.fromYmd(lunarDate0.lYear, lunarDate0.lMonth, lunarDate0.lDay, lunarDate0.isLeapMonth);
  const eightChar = lunarDate1.getEightChar();

  const ganzhi = eightChar.getYear() + '年 ' + eightChar.getMonth() + '月 ' + eightChar.getDay() + '日';
  const wuxing = eightChar.getYearWuXing() + ' ' + eightChar.getMonthWuXing() + ' ' + eightChar.getDayWuXing();

  return language === 'zh'
    ? `八字：${ganzhi}，五行：${wuxing}`
    : `Eight Characters: ${eightChar.getYear()} Year ${eightChar.getMonth()} Month ${eightChar.getDay()} Day, Five Elements: ${eightChar.getYearWuXing()} ${eightChar.getMonthWuXing()} ${eightChar.getDayWuXing()}`;
};