import React from 'react';

interface GooglePayContentProps {
    isLoading: boolean;
    error: string | null;
    isAvailable: boolean;
    containerRef: React.RefObject<HTMLDivElement | null>;
}

export const GooglePayContent: React.FC<GooglePayContentProps> = ({
    isLoading,
    error,
    isAvailable,
    containerRef
}) => {
    if (isLoading) {
        return (
            <div className="google-pay-loading">
                <div className="google-pay-loading-spinner"></div>
                <span>加载 Google Pay...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="google-pay-error">
                Google Pay 加载失败: {error}
            </div>
        );
    }

    if (!isAvailable) {
        return (
            <div className="google-pay-not-available">
                Google Pay 在此设备上不可用
            </div>
        );
    }

    return <div className="google-pay-button-wrapper" ref={containerRef} />;
};