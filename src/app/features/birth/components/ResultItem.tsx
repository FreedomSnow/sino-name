import React from 'react';

interface ResultItemProps {
  label: string;
  value: string;
  className?: string;
}

export const ResultItem: React.FC<ResultItemProps> = ({ label, value, className = '' }) => {
  return (
    <div className={`birthday-result-row ${className}`}>
      <span className={`birthday-result-label ${className}-label`}>{label}</span>
      <span className={`birthday-result-value ${className}-value`}>{value}</span>
    </div>
  );
};