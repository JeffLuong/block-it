import React from 'react';

import './Button.css';

type ButtonProps = {
  onClick: (arg?: any) => any,
  children: React.ReactNode,
  className?: string
};

const Button: React.FC<ButtonProps> = ({ onClick, children, className }) => (
  <button
    type="button"
    onClick={onClick}
    className={className ? `Button ${className}`: 'Button'}>
    {children}
  </button>
);

export default Button;