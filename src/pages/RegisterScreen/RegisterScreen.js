import React from 'react';
import { Link } from 'react-router-dom';
import styles from './RegisterScreen.module.css';
import { FaLock, FaEnvelope, FaUserCircle, FaCalendarAlt } from 'react-icons/fa';

const RegisterScreen = () => {
  const handleRegister = (e) => {
    e.preventDefault();
    console.log('Tentativa de cadastro');
    // Adicionar aqui a lógica real de cadastro
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.contentCard}>
        <div className={styles.header}>
          <h1 className={styles.logo}>B+</h1>
          <h2 className={styles.title}>É novo? Cadastre-se abaixo</h2>
        </div>

        <form onSubmit={handleRegister} className={styles.form}>
          {/* Campo Usuário */}
          <div className={styles.inputGroup}>
            <FaUserCircle className={styles.inputIcon} />
            <input type="text" placeholder="Digite seu usuário" required className={styles.inputField} />
          </div>

          {/* Campo Email */}
          <div className={styles.inputGroup}>
            <FaEnvelope className={styles.inputIcon} />
            <input type="email" placeholder="Digite seu email" required className={styles.inputField} />
          </div>

          {/* Campo Senha */}
          <div className={styles.inputGroup}>
            <FaLock className={styles.inputIcon} />
            <input type="password" placeholder="Digite sua senha" required className={styles.inputField} />
          </div>
          
          {/* Campo Data de Nascimento */}
          <div className={styles.inputGroup}>
            <FaCalendarAlt className={styles.inputIcon} />
            <input type="date" placeholder="Data de nascimento" required className={styles.inputField} />
          </div>

          <button type="submit" className={styles.registerButton}>
            Cadastrar-se
          </button>

          <p className={styles.loginLinkText}>
            Já possui cadastro? <Link to="/login" className={styles.loginLink}>Faça seu login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterScreen;