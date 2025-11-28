import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import styles from './Perfil.module.css';
import { FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Perfil = () => {
  const { user, updateProfile } = useAuth(); 
  
  const [isEditing, setIsEditing] = useState(false);

  // Estado inicial com dados do usuário logado
  const [profileData, setProfileData] = useState({
    nome: user?.username || 'Usuário',
    email: user?.email || '', 
    telefone: user?.telefone || '', 
    endereco: user?.endereco || '' 
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        nome: user.username,
        email: user.email || '',
        telefone: user.telefone || '',
        endereco: user.endereco || ''
      });
    }
  }, [user]);

  const [editData, setEditData] = useState(profileData);

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
    // 1. Validação de Email (Regex Simples)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editData.email)) {
        toast.error("Por favor, insira um e-mail válido.");
        return false;
    }

    // 2. Validação de Telefone (Mínimo 10 dígitos: DDD + 8 números)
    const rawPhone = editData.telefone.replace(/[^\d]/g, '');
    if (rawPhone.length < 10 || rawPhone.length > 11) {
        toast.error("Por favor, insira um telefone válido com DDD (ex: (21) 99999-9999).");
        return false;
    }

    // 3. Validação de Endereço (Mínimo 5 caracteres para considerar válido)
    if (!editData.endereco || editData.endereco.trim().length < 5) {
        toast.error("Por favor, insira um endereço completo.");
        return false;
    }

    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;

    // Se for telefone, aplica a máscara
    if (name === 'telefone') {
        finalValue = formatPhoneNumber(value);
    }

    setEditData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleEditClick = () => {
    setEditData(profileData);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData(profileData);
  };

  const handleUpdate = async () => {
    // Chama a validação antes de enviar
    if (!validateForm()) {
        return;
    }

    const result = await updateProfile({
        email: editData.email,
        telefone: editData.telefone,
        endereco: editData.endereco
    });

    if (result.success) {
        toast.success('Perfil atualizado com sucesso!');
        setProfileData(editData); 
        setIsEditing(false);
    } else {
        toast.error(result.message || "Erro ao atualizar.");
    }
  };

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: '(usuário)', path: '#' },
    { label: 'Perfil', path: '/perfil' }
  ];

  return (
    <div className={styles.container}>
      <Breadcrumb items={breadcrumbItems} />
      <h1 className={styles.pageTitle}>Meu Perfil</h1>

      <div className={styles.profileCard}>
        <div className={styles.avatarContainer}>
          <div className={styles.avatarCircle}><FaUser /></div>
          {user?.role === 'admin' && <div className={styles.adminTag}>Admin</div>}
        </div>

        <div className={styles.infoList}>
          {/* Nome */}
          <div className={styles.infoGroup}>
            <label className={styles.label}>Nome Completo:</label>
            <span className={styles.value}>{profileData.nome}</span>
          </div>

          {/* Email */}
          <div className={styles.infoGroup}>
            <label className={styles.label}>Email:</label>
            {isEditing ? (
              <input 
                type="email" 
                name="email"
                className={styles.input}
                value={editData.email}
                onChange={handleInputChange}
                placeholder="exemplo@email.com"
              />
            ) : (
              <span className={styles.value}>{profileData.email}</span>
            )}
          </div>

          {/* Telefone */}
          <div className={styles.infoGroup}>
            <label className={styles.label}>Telefone:</label>
            {isEditing ? (
              <input 
                type="text" 
                name="telefone"
                className={styles.input}
                value={editData.telefone}
                onChange={handleInputChange}
                placeholder="(XX) XXXXX-XXXX"
                maxLength="15" // Limita o tamanho visual da máscara
              />
            ) : (
              <span className={styles.value}>{profileData.telefone || '-'}</span>
            )}
          </div>

          {/* Endereço */}
          <div className={styles.infoGroup}>
            <label className={styles.label}>Endereço:</label>
            {isEditing ? (
              <input 
                type="text" 
                name="endereco"
                className={styles.input}
                value={editData.endereco}
                onChange={handleInputChange}
                placeholder="Rua, Número, Complemento"
              />
            ) : (
              <span className={styles.value}>{profileData.endereco || '-'}</span>
            )}
          </div>
        </div>

        <div className={styles.actionButtons}>
          {isEditing ? (
            <>
              <button className={styles.btnPrimary} onClick={handleUpdate}>Salvar</button>
              <button className={styles.btnSecondary} onClick={handleCancel}>Cancelar</button>
            </>
          ) : (
            <button className={styles.btnPrimary} onClick={handleEditClick}>Editar Perfil</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Perfil;