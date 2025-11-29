import React from 'react';
import styles from './Input.module.css';

const Input = ({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  icon: Icon, // Componente de ícone
  required = false,
  name
}) => {
  return (
    <div className={styles.inputWrapper}>
      {Icon && <Icon className={styles.icon} />}
      <input
        type={type}
        name={name}
        className={styles.inputField}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
};

export default Input;