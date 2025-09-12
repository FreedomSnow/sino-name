import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

const STORAGE_KEY = 'birthdayState';

export const useBirthdayState = () => {
  const [birthDate, setBirthDate] = useState<dayjs.Dayjs | null>(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const state = JSON.parse(saved);
        return state.birthDate ? dayjs(state.birthDate) : null;
      } catch { return null; }
    }
    return null;
  });

  const [zodiacIdx, setZodiacIdx] = useState<number | null>(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const state = JSON.parse(saved);
        return typeof state.zodiacIdx === 'number' ? state.zodiacIdx : null;
      } catch { return null; }
    }
    return null;
  });

  // 修复 saveState 函数 - 完全使用传入的参数，不使用闭包中的旧值
  const saveState = (partial: Record<string, unknown>) => {
    const prev = window.localStorage.getItem(STORAGE_KEY);
    let state: Record<string, unknown> = {};
    if (prev) {
      try { state = JSON.parse(prev); } catch { state = {}; }
    }
    // 关键修复：直接使用 partial 参数，移除闭包变量引用
    state = { ...state, ...partial };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  };

  // 清空状态（页面刷新时）
  useEffect(() => {
    let navType: string | number | undefined;
    const navEntries = window.performance?.getEntriesByType?.('navigation');
    if (navEntries && navEntries.length > 0) {
      navType = (navEntries[0] as unknown as { type: string }).type;
    } else if (window.performance?.navigation) {
      navType = window.performance.navigation.type;
    }
    if (navType === 'reload' || navType === 1 || navType === 'navigate') {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // 监听 tab 切换同步状态
  useEffect(() => {
    const syncState = () => {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const state = JSON.parse(saved);
          setBirthDate(state.birthDate ? dayjs(state.birthDate) : null);
          setZodiacIdx(typeof state.zodiacIdx === 'number' ? state.zodiacIdx : null);
        } catch { }
      }
    };
    window.addEventListener('visibilitychange', syncState);
    return () => {
      window.removeEventListener('visibilitychange', syncState);
    };
  }, []);

  return {
    birthDate,
    setBirthDate,
    zodiacIdx,
    setZodiacIdx,
    saveState
  };
};