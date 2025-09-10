import React, { useState } from 'react';
import { DatePicker, ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import enUS from 'antd/es/locale/en_US';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import './UserInfoForm.css';
import { CACHE_KEYS } from "@/app/cacheKeys";

interface UserInfoFormProps {
  lastName?: string;
  onSubmit: (data: UserInfoData) => void;
}

export interface UserInfoData {
  lastName: string;
  givenName: string;
  gender: '男' | '女' | '';
  birth: string;
  classic: '' | '诗经' | '古诗词';
  note: string;
}


const UserInfoForm: React.FC<UserInfoFormProps> = ({ lastName, onSubmit }) => {
  const { t, i18n } = useTranslation();
  // 首次加载标志，防止初始化时触发保存
  const [isInitialMount, setIsInitialMount] = useState(true);
  const initialForm: UserInfoData = {
    lastName: '',
    givenName: '',
    gender: '',
    birth: '',
    classic: '',
    note: '',
  };
  const [form, setForm] = useState<UserInfoData>(() => {
    const cache = localStorage.getItem(CACHE_KEYS.userInfoForm);
    let result = initialForm;
    if (cache) {
      try {
        result = JSON.parse(cache);
      } catch {
        result = initialForm;
      }
    }
    if (lastName) {
      result.lastName = lastName;
    }
    return result;
  });

  // 监听form变化，非首次加载时缓存
  React.useEffect(() => {
    if (isInitialMount) {
      setIsInitialMount(false);
      return;
    }
    localStorage.setItem(CACHE_KEYS.userInfoForm, JSON.stringify(form));
  }, [form, isInitialMount]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBirthChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      setForm(prev => ({ ...prev, birth: date.format('YYYY-MM-DD') }));
    } else {
      setForm(prev => ({ ...prev, birth: '' }));
    }
  };

  const handleRadioChange = (name: keyof UserInfoData, value: string) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <ConfigProvider locale={i18n.language === 'zh' ? zhCN : enUS}>
      <form className="user-info-form" onSubmit={handleSubmit}>
      <div className="user-info-form-group">
        <label htmlFor="name">{t('formLastNameLabel')}</label>
        <input
          id="lastName"
          name="lastName"
          type="text"
          value={form.lastName}
          onChange={handleChange}
          placeholder={t('formLastNamePlaceholder')}
          required
        />
      </div>
      <div className="user-info-form-group">
        <label htmlFor="name">{t('formGivenNameLabel')}</label>
        <input
          id="givenName"
          name="givenName"
          type="text"
          value={form.givenName}
          onChange={handleChange}
          placeholder={t('formGivenNamePlaceholder')}
          required
        />
      </div>
      <div className="user-info-form-group">
        <label>{t('formGenderLabel')}</label>
        <div className="user-info-form-radio-group">
          <label><input type="radio" name="gender" value="男" checked={form.gender === '男'} onChange={() => handleRadioChange('gender', '男')} /> {t('formGenderMale')}</label>
          <label><input type="radio" name="gender" value="女" checked={form.gender === '女'} onChange={() => handleRadioChange('gender', '女')} /> {t('formGenderFemale')}</label>
          <label><input type="radio" name="gender" value="" checked={form.gender === ''} onChange={() => handleRadioChange('gender', '保密')} /> {t('formGenderSecret')}</label>
        </div>
      </div>
      <div className="birth user-info-form-group" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
        <div style={{ display: 'flex', flexDirection: 'row', gap: 16 }}>
          <label className="birth-title" htmlFor="birth" style={{ minWidth: 80, textAlign: 'left' }}>{t('formBirthLabel')}</label>
          <div style={{ flex: 1 }}>
            <DatePicker
              id="birth"
              className="user-info-form-datepicker"
              value={form.birth ? dayjs(form.birth) : null}
              onChange={handleBirthChange}
              format="YYYY-MM-DD"
              placeholder={t('formBirthPlaceholder')}
              disabledDate={(current: dayjs.Dayjs) => current && current > dayjs()}
              allowClear
            />
          </div>
        </div>
        <span className="user-info-form-desc">{t('formBirthDesc')}</span>
      </div>
      <div className="user-info-form-group">
        <label>{t('formClassicLabel')}</label>
        <div className="user-info-form-radio-group">
          <label><input type="radio" name="classic" value="" checked={form.classic === ''} onChange={() => handleRadioChange('classic', '')} /> {t('formClassicAny')}</label>
          <label><input type="radio" name="classic" value="诗经" checked={form.classic === '诗经'} onChange={() => handleRadioChange('classic', '诗经')} /> {t('formClassicShijing')}</label>
          <label><input type="radio" name="classic" value="古诗词" checked={form.classic === '古诗词'} onChange={() => handleRadioChange('classic', '古诗词')} /> {t('formClassicPoetry')}</label>
        </div>
      </div>
      <div className="user-info-form-group">
        <label htmlFor="note">{t('formNoteLabel')}</label>
        <textarea
          id="note"
          name="note"
          value={form.note}
          onChange={handleChange}
          placeholder={t('formNotePlaceholder')}
          rows={3}
        />
      </div>
      <button className="user-info-form-submit" type="submit">
        <img src="/pay.svg" alt="pay" className="user-info-form-btn-icon" />
        {t('submit')}
      </button>
      </form>
    </ConfigProvider>
  );
};

export default UserInfoForm;
