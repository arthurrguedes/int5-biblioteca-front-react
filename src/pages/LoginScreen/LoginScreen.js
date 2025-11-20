import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './LoginScreen.module.css';
import { FaLock, FaEnvelope } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext'; // Importar o hook de autenticação

const LoginScreen = () => {
  // Estados para dados do formulário
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  
  // Estado para seleção de perfil
  const [userType, setUserType] = useState('usuario'); // 'usuario' ou 'bibliotecario'
  
  // Hook do Contexto de Autenticação
  const { login } = useAuth(); 

  const handleLogin = (e) => {
    e.preventDefault();
    
    // 1. Verificar se os campos estão preenchidos
    if (!email || !senha) {
        console.error("Preencha todos os campos.");
        return; 
    }

    // 2. Chamar a função de login do contexto, passando credenciais e perfil
    // O useAuth().login() lida com a chamada à API e o armazenamento do JWT
    login(email, senha, userType); 

    console.log(`Tentativa de login enviada: ${email} como ${userType}`);
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.contentCard}>
        <div className={styles.header}>
          {/* O logo B+ foi comentado, mas é essencial para o visual do protótipo */}
          <h1 className={styles.logo}>B+</h1>
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
          {/* Campo Email - Capturando o valor */}
          <div className={styles.inputGroup}>
            <FaEnvelope className={styles.inputIcon} />
            <input 
              type="email" 
              placeholder="Digite seu email" 
              required 
              className={styles.inputField} 
              value={email} // Conecta ao estado 'email'
              onChange={(e) => setEmail(e.target.value)} // Atualiza o estado
            />
          </div>

          {/* Campo Senha - Capturando o valor */}
          <div className={styles.inputGroup}>
            <FaLock className={styles.inputIcon} />
            <input 
              type="password" 
              placeholder="Digite sua senha" 
              required 
              className={styles.inputField}
              value={senha} // Conecta ao estado 'senha'
              onChange={(e) => setSenha(e.target.value)} // Atualiza o estado
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
      
      {/* Decoração de Livros (Mantenha ou substitua por SVG no CSS para maior fidelidade) */}
      <div className={styles.bookDecoration}>
        <div className={styles.bookIcon}></div>
        <div className={styles.bookIconOpen}></div>
      </div>
    </div>
  );
};

export default LoginScreen;