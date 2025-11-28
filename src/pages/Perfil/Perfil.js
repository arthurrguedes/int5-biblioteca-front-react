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
    nascimento: 'Data não cadastrada', 
    telefone: '', 
    endereco: '' 
  });

  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        nome: user.username,
        email: user.email || ''
      }));
    }
  }, [user]);

  const [editData, setEditData] = useState(profileData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
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
    const result = await updateProfile({
        email: editData.email
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
                placeholder="(Apenas visual)"
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
                placeholder="(Apenas visual)"
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