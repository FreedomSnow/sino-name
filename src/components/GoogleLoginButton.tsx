import React from 'react';

interface GoogleLoginButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ 
  className = '', 
  children = '使用Google登录' 
}) => {
  const handleGoogleLogin = () => {
    // 直接跳转到我们的Google登录API
    window.location.href = '/api/auth/google/login';
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className={`flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${className}`}
    >
      <img 
        src="/icon-google.svg" 
        alt="Google" 
        className="w-5 h-5"
      />
      {children}
    </button>
  );
};
