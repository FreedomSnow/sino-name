import React, { useState } from 'react';
import { DatePicker } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import './DatePickerSection.css';

interface DatePickerSectionProps {
    birthDate: dayjs.Dayjs | null;
    onDateChange: (date: dayjs.Dayjs | null) => void;
    onQuery: () => void;
}

export const DatePickerSection: React.FC<DatePickerSectionProps> = ({
    birthDate,
    onDateChange,
    onQuery
}) => {
    const { t, i18n } = useTranslation();
    const [pickerOpen, setPickerOpen] = useState(false);


    const handleDatePickerChange = (date: dayjs.Dayjs | null) => {
        console.log('Date selected:', date?.format('YYYY-MM-DD'));
        onDateChange(date);
        setPickerOpen(false);
        if (date) {
            onQuery();
        }
    };

    return (
        <div className="birthday-row">
            <span className="birthday-label">{t('birthdayTitle')}</span>
            <DatePicker
                className="birthday-picker"
                value={birthDate}
                onChange={handleDatePickerChange}
                format={i18n.language === 'zh' ? 'YYYY-MM-DD' : 'MM/DD/YYYY'}
                placeholder={t('birthdayPickerPlaceholder')}
                allowClear={false}
                // open={true}
                onOpenChange={(open) => {
                    setPickerOpen(open);
                    console.log('DatePicker onOpenChange:', open);
                }}
                defaultPickerValue={birthDate || dayjs()}
                suffixIcon={
                    <div className="birthday-suffix-icons" onClick={(e) => e.stopPropagation()}>
                        {/* 日历图标 */}
                        <CalendarOutlined
                            className="birthday-calendar-icon"
                            onClick={() => { if (!pickerOpen) { setPickerOpen(true); } }}
                        />
                    </div>
                }
            />
        </div>
    );
};