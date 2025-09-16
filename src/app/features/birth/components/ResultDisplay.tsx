import React from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { ZODIAC_DATA, GUARDIAN_DATA, CONSTELLATION_DATA } from '../constants';
import { getConstellation, getLunarDate, getBirthdayFlower, getBaziWuxing } from '../utils';

interface ResultDisplayProps {
    birthDate: dayjs.Dayjs;
    zodiacIdx: number;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ birthDate, zodiacIdx }) => {
    const { t, i18n } = useTranslation();

    return (
        <>
            <div className="birthday-zodiac-row">
                <span className="birthday-zodiac-label">{t('birthdayZodiacLabel')}</span>
                <span className="birthday-zodiac-value">
                    {i18n.language === 'zh' ? ZODIAC_DATA.zh[zodiacIdx] : ZODIAC_DATA.en[zodiacIdx]}
                </span>
            </div>

            <div className="birthday-guardian-row">
                <span className="birthday-guardian-label">{t('birthdayGuardianLabel')}</span>
                <span className="birthday-guardian-value">
                    {i18n.language === 'zh' ? GUARDIAN_DATA.zh[zodiacIdx] : GUARDIAN_DATA.en[zodiacIdx]}
                </span>
            </div>

            <div className="birthday-constellation-row">
                <span className="birthday-constellation-label">{t('birthdayConstellationLabel')}</span>
                <span className="birthday-constellation-value">
                    {(() => {
                        const month = birthDate.month() + 1;
                        const day = birthDate.date();
                        const constellationIndex = getConstellation(month, day);
                        return i18n.language === 'zh' ? CONSTELLATION_DATA.zh[constellationIndex] : CONSTELLATION_DATA.en[constellationIndex];
                    })()}
                </span>
            </div>

            <div className="birthday-lunar-row">
                <span className="birthday-lunar-label">{t('birthdayLunarLabel')}</span>
                <span className="birthday-lunar-value">{getLunarDate(birthDate)}</span>
            </div>

            <div className="birthday-flower-row">
                <span className="birthday-flower-label">{t('birthdayFlowerLabel')}</span>
                <span className="birthday-flower-value">{getBirthdayFlower(birthDate, i18n.language)}</span>
            </div>

            <div className="birthday-bazi-row">
                <span className="birthday-bazi-label">{t('birthdayBaziLabel')}</span>
                <span className="birthday-bazi-value">{getBaziWuxing(birthDate, i18n.language)}</span>
            </div>
        </>
    );
};