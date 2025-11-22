import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importar useNavigate
import { toast } from 'react-toastify';
import styles from './RegisterScreen.module.css';
import { FaLock, FaEnvelope, FaUserCircle, FaCalendarAlt } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext'; // Importar useAuth

const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Data de nascimento não será usada no AuthContext, mas mantemos o estado
  const [dob, setDob] = useState(''); 

  const { register } = useAuth(); // Usar o hook de autenticação
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    
    // Lógica de cadastro simulada: sempre loga como 'user'
    const result = register(username, email, password);

    if (result.success) {
      toast.success('Cadastro realizado com sucesso! Bem-vindo(a).');
      navigate('/');
    } else {
      toast.error('Erro ao realizar cadastro. Tente novamente.');
    }
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
            <input 
              type="text" 
              placeholder="Digite seu usuário" 
              required 
              className={styles.inputField} 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Campo Email */}
          <div className={styles.inputGroup}>
            <FaEnvelope className={styles.inputIcon} />
            <input 
              type="email" 
              placeholder="Digite seu email" 
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
              placeholder="Digite sua senha" 
              required 
              className={styles.inputField} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          {/* Campo Data de Nascimento */}
          <div className={styles.inputGroup}>
            <FaCalendarAlt className={styles.inputIcon} />
            <input 
              type="date" 
              placeholder="Data de nascimento" 
              required 
              className={styles.inputField}
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
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