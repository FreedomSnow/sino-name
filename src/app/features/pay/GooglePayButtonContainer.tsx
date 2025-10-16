"use client";

import React from 'react';
import './GooglePayButtonContainer.css';

interface Props {
  className?: string;
  children?: React.ReactNode;
}

const GooglePayButtonContainer: React.FC<Props> = ({ className, children }) => {
  return (
    <div className={`googlepay-button-container ${className ?? ''}`}>
      {children}
    </div>
  );
};

export default GooglePayButtonContainer;
