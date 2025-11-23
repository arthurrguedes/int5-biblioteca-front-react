import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './RegisterScreen.module.css';
import { FaLock, FaEnvelope, FaUserCircle, FaCalendarAlt } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState(''); 

  const { register } = useAuth(); 
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    const result = await register(username, email, password, dob);

    if (result.success) {
      toast.success('Cadastro realizado com sucesso! Bem-vindo(a).');
      navigate('/login');
    } else {
      toast.error(result.message || 'Erro ao realizar cadastro.');
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