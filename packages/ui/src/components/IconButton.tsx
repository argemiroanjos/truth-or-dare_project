import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const IconButton: React.FC<IconButtonProps> = ({ children, className = '', ...props }) => {
  return (
    <button
      className={`bg-white/10 text-white p-2 rounded-full shadow-lg hover:bg-white/20 transform hover:scale-110 transition-all duration-300 z-30 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default IconButton;