import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './RegisterScreen.module.css';
import { FaLock, FaEnvelope, FaUserCircle, FaCalendarAlt, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState(''); 
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const { register } = useAuth(); 
  const navigate = useNavigate();

  // --- MÁSCARA DE TELEFONE ---
  const formatPhoneNumber = (value) => {
    if (!value) return value;
    // Remove tudo que não é dígito
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;

    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
    }
    if (phoneNumberLength <= 10) {
        return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 6)}-${phoneNumber.slice(6)}`;
    }
    // Formato para 9 dígitos (celular)
    return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 7)}-${phoneNumber.slice(7, 11)}`;
  };

  // --- VALIDAÇÃO ---
  const validateForm = () => {
    // 1. Validação de Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        toast.error("Por favor, insira um e-mail válido.");
        return false;
    }

    // 2. Validação de Telefone (Mínimo 10 dígitos: DDD + 8 números)
    const rawPhone = phone.replace(/[^\d]/g, '');
    if (rawPhone.length < 10 || rawPhone.length > 11) {
        toast.error("Por favor, insira um telefone válido com DDD (ex: (21) 99999-9999).");
        return false;
    }

    // 3. Validação de Endereço (Mínimo 5 caracteres)
    if (!address || address.trim().length < 5) {
        toast.error("Por favor, insira um endereço completo.");
        return false;
    }

    // 4. Validação de Senha (Opcional, mas recomendada)
    if (password.length < 6) {
        toast.error("A senha deve ter pelo menos 6 caracteres.");
        return false;
    }

    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Verifica validações antes de enviar
    if (!validateForm()) {
        return;
    }
    
    const result = await register(username, email, password, dob, phone, address);

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

          {/* Campo Telefone com Máscara */}
          <div className={styles.inputGroup}>
            <FaPhoneAlt className={styles.inputIcon} />
            <input 
              type="text" 
              placeholder="Telefone / Celular" 
              required 
              className={styles.inputField} 
              value={phone}
              onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
              maxLength="15"
            />
          </div>

          {/* Campo Endereço */}
          <div className={styles.inputGroup}>
            <FaMapMarkerAlt className={styles.inputIcon} />
            <input 
              type="text" 
              placeholder="Endereço Completo" 
              required 
              className={styles.inputField} 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
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