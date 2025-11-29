import React from 'react';
import styles from './Button.module.css';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary',
  type = 'button', 
  fullWidth = false,
  size = 'medium',
  disabled = false,
  style = {}
}) => {
  return (
    <button 
      type={type}
      className={`
        ${styles.button} 
        ${styles[variant]} 
        ${fullWidth ? styles.fullWidth : ''}
        ${size === 'small' ? styles.small : ''}
      `}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  );
};

export default Button;