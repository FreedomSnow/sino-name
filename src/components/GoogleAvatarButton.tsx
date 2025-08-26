import React from 'react';
import { GoogleUser } from '@/types/auth';

interface Props {
  user: GoogleUser;
  size?: number;
  onClick?: () => void;
}

const GoogleAvatarButton: React.FC<Props> = ({ user, size = 40, onClick }) => {
  let content: React.ReactNode;
  if (user.avatar) {
    content = (
      <img
        src={user.avatar}
        alt="avatar"
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          background: '#eee',
          display: 'block',
        }}
        referrerPolicy="no-referrer"
      />
    );
  } else if (user.name && user.name[0]) {
    content = (
      <span
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: '#eee',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 600,
          fontSize: size * 0.5,
          color: '#555',
          userSelect: 'none',
        }}
      >
        {user.name[0].toUpperCase()}
      </span>
    );
  } else if (user.email && user.email[0]) {
    content = (
      <span
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: '#eee',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 600,
          fontSize: size * 0.5,
          color: '#555',
          userSelect: 'none',
        }}
      >
        {user.email[0].toUpperCase()}
      </span>
    );
  } else {
    content = (
      <span
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: '#eee',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 600,
          fontSize: size * 0.5,
          color: '#555',
          userSelect: 'none',
        }}
      >
        ?
      </span>
    );
  }

  return (
    <button
      onClick={onClick}
      style={{
        border: 'none',
        background: 'transparent',
        padding: 0,
        cursor: 'pointer',
        outline: 'none',
        width: size,
        height: size,
        borderRadius: '50%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      aria-label="Google 用户头像"
    >
      {content}
    </button>
  );
};

export default GoogleAvatarButton;
