import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import styles from './LoginScreen.module.css';
import { FaLock, FaEnvelope, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext'; 

const LoginScreen = () => {
  const [userType, setUserType] = useState('usuario'); // 'usuario' ou 'bibliotecario'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth(); // Usar o hook de autenticação
  const navigate = useNavigate(); // Hook de navegação

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Admin login simulation: use 'admin' for email and 'admin123' for password
    const isLibrarian = userType === 'bibliotecario';

    const result = login(email, password, isLibrarian);

    if (result.success) {
      // Redireciona com base na role
      if (result.role === 'admin') {
        navigate('/'); // Redireciona para home ou painel admin
      } else {
        navigate('/'); // Redireciona para home do usuário
      }
    } else {
      alert(result.message); // Exibe mensagem de erro
    }
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
            <input 
              type="text" // Alterado para text para aceitar 'admin'
              placeholder={userType === 'bibliotecario' ? 'Usuário: admin' : 'Digite seu email'} 
              required 
              className={styles.inputField} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Campo Senha */}
          <div className={styles.inputGroup}>
            <FaLock className={styles.inputIcon} />
            <input 
              type="password" 
              placeholder={userType === 'bibliotecario' ? 'Senha: admin123' : 'Digite sua senha'} 
              required 
              className={styles.inputField} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
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