import { useState } from 'react';
import styles from './ContactUs.module.css';
import { useTranslation } from 'react-i18next';

const ContactUs = (props) => {
  // 添加额外的安全检查
  if (!props || typeof props !== 'object') {
    return null;
  }
  
  const { isOpen = false, onClose = () => {} } = props;
  
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 按照指定格式组合content
    const content = `${formData.name}\n\n${formData.subject}\n\n${formData.message}`;
    
    // 创建FormData对象
    const formDataToSubmit = new FormData();
    formDataToSubmit.append('title', '["sino-name"]');
    formDataToSubmit.append('contact', formData.email);
    formDataToSubmit.append('content', content);
    
    try {
      const response = await fetch('http://43.138.115.192:3000/api/feedback', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formDataToSubmit
      });
      
      if (response.ok) {
        alert(t('contactus_submitSuccess'));
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        onClose();
      } else {
        alert(t('contactus_submitError') || '提交失败，请稍后重试');
      }
    } catch (error) {
      console.error('提交错误:', error);
      alert(t('contactus_submitError') || '提交失败，请稍后重试');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{t('contactus_title')}</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <i className="fa-solid fa-times"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">{t('contactus_name')}</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder={t('contactus_namePlaceholder')}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">{t('contactus_email')}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={t('contactus_emailPlaceholder')}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="subject">{t('contactus_subject')}</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder={t('contactus_subjectPlaceholder')}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="message">{t('contactus_message')}</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder={t('contactus_messagePlaceholder')}
              rows="5"
              required
            />
          </div>
          <div className={styles.actions}>
            {/* <button type="button" className={styles.cancelBtn} onClick={handleCancel}>
              {t(lang, 'contactus_cancel')}
            </button> */}
            <button type="submit" className={styles.submitBtn}>
              {t('submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContactUs;