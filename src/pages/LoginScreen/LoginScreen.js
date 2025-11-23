import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import styles from './LoginScreen.module.css';
import { FaLock, FaEnvelope } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext'; 
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { toast } from 'react-toastify';

const LoginScreen = () => {
  const [userType, setUserType] = useState('usuario');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth(); 
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    const isLibrarian = userType === 'bibliotecario';
    const result = await login(email, password, isLibrarian);

    if (result.success) {
      navigate('/');
    } else {
      toast.error(result.message || "Erro ao realizar login.");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.contentCard}>
        <div className={styles.header}>
          <h2 className={styles.title}>Bem vindos à Biblioteca+!</h2>
          <p className={styles.subtitle}>FAÇA SEU LOGIN</p>
        </div>

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
          <Input 
            type="text"
            placeholder={userType === 'bibliotecario' ? 'Usuário: admin' : 'Digite seu email'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={FaEnvelope}
            required
          />

          <Input 
            type="password"
            placeholder={userType === 'bibliotecario' ? 'Senha: admin123' : 'Digite sua senha'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={FaLock}
            required
          />

          <p className={styles.forgotPassword}>
            Esqueceu sua senha? <Link to="#" className={styles.forgotLink}>Clique aqui</Link>
          </p>

          <Button type="submit" variant="primary" fullWidth>
            Entrar
          </Button>

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