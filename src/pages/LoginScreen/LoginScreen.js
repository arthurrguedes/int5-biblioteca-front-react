import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './LoginScreen.module.css';
import { FaLock, FaEnvelope, FaUserCircle } from 'react-icons/fa';

const LoginScreen = () => {
  const [userType, setUserType] = useState('usuario'); // 'usuario' ou 'bibliotecario'
  
  const handleLogin = (e) => {
    e.preventDefault();
    console.log(`Tentativa de login como: ${userType}`);
    // Adicionar aqui a lógica real de autenticação
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.contentCard}>
        <div className={styles.header}>
         { /*<h1 className={styles.logo}>B+</h1>*/}
          <h2 className={styles.title}>Bem vindos à Biblioteca+!</h2>
          <p className={styles.subtitle}>FAÇA SEU LOGIN</p>
        </div>

        {/* Seleção de Tipo de Usuário */}
        <div className={styles.userTypeSelector}>
          <button 
            className={`${styles.userTypeButton} ${userType === 'usuario' ? styles.active : ''}`}
            onClick={() => setUserType('usuario')}
          >
            Usuário
          </button>
          <button 
            className={`${styles.userTypeButton} ${userType === 'bibliotecario' ? styles.active : ''}`}
            onClick={() => setUserType('bibliotecario')}
          >
            Bibliotecário
          </button>
        </div>

        <form onSubmit={handleLogin} className={styles.form}>
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

          <p className={styles.forgotPassword}>
            Esqueceu sua senha? <Link to="#" className={styles.forgotLink}>Clique aqui</Link>
          </p>

          <button type="submit" className={styles.loginButton}>
            Entrar
          </button>

          <p className={styles.registerLinkText}>
            Não possui login? <Link to="/cadastro" className={styles.forgotLink}>Cadastre-se aqui</Link>
          </p>
        </form>
      </div>
      
      <div className={styles.bookDecoration}>
        <div className={styles.bookIcon}></div>
        <div className={styles.bookIconOpen}></div>
      </div>
    </div>
  );
};

export default LoginScreen;