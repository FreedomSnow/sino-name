import React from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import "./PandaLoadingView.css";

interface PandaLoadingViewProps {
  showText?: boolean;
  customText?: string;
  size?: number;
}

const PandaLoadingView: React.FC<PandaLoadingViewProps> = ({ 
  showText = false,
  customText,
  size = 80
}) => {
  const { t } = useTranslation();
  const loadingText = customText || t('aiLoading', 'AI智能处理中...');

  return (
    <div className="panda-loading-view">
      <div className="panda-loading-container">
        <Image 
          src="/panda-loading.gif" 
          alt="loading" 
          className="panda-loading-img" 
          width={size} 
          height={size} 
          unoptimized 
        />
        {showText && (
          <span className="panda-loading-text">{loadingText}</span>
        )}
      </div>
    </div>
  );
};

export default PandaLoadingView;
