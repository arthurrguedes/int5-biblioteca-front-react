import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext'; // Pega dados do contexto
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import styles from './Perfil.module.css';
import { FaUser } from 'react-icons/fa';

const Perfil = () => {
  const { user } = useAuth(); // Pega usuário logado (username, role)
  
  const [isEditing, setIsEditing] = useState(false);

  // Estado inicial com dados simulados + dados do contexto
  const [profileData, setProfileData] = useState({
    nome: user?.username || 'Usuário Teste',
    email: 'usuario@exemplo.com',
    nascimento: '29/08/1998',
    telefone: '(21) 98765-4321',
    endereco: 'Rua Santa Luzia, 123 - Centro, Rio de Janeiro - RJ'
  });

  // Estado temporário para edição
  const [editData, setEditData] = useState(profileData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditClick = () => {
    setEditData(profileData); // Garante que começa com dados atuais
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData(profileData); // Reverte mudanças
  };

  const handleClear = () => {
    // Limpa apenas os campos editáveis
    setEditData(prev => ({
      ...prev,
      email: '',
      telefone: '',
      endereco: ''
    }));
  };

  const handleUpdate = () => {
    // Aqui você chamaria a API para salvar
    setProfileData(editData);
    setIsEditing(false);
    alert('Perfil atualizado com sucesso!');
  };

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: '(usuário)', path: '#' },
    { label: 'Perfil', path: '/perfil' }
  ];

  return (
    <div className={styles.container}>
      <div style={{ width: '100%', maxWidth: '1200px' }}>
        <Breadcrumb items={breadcrumbItems} />
      </div>
      
      <h1 className={styles.pageTitle}>Meu Perfil</h1>

      <div className={styles.profileCard}>
        {/* Avatar e Tag */}
        <div className={styles.avatarContainer}>
          <div className={styles.avatarCircle}>
            <FaUser />
          </div>
          {user?.role === 'admin' && (
            <div className={styles.adminTag}>Admin</div>
          )}
        </div>

        {/* Lista de Informações */}
        <div className={styles.infoList}>
          
          {/* Nome (Não editável) */}
          <div className={styles.infoGroup}>
            <label className={styles.label}>Nome Completo:</label>
            <span className={styles.value}>{profileData.nome}</span>
          </div>

          {/* Email (Editável) */}
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

          {/* Nascimento (Não editável) */}
          <div className={styles.infoGroup}>
            <label className={styles.label}>Data de Nascimento:</label>
            <span className={styles.value}>{profileData.nascimento}</span>
          </div>

          {/* Telefone (Editável) */}
          <div className={styles.infoGroup}>
            <label className={styles.label}>Telefone:</label>
            {isEditing ? (
              <input 
                type="text" 
                name="telefone"
                className={styles.input}
                value={editData.telefone}
                onChange={handleInputChange}
              />
            ) : (
              <span className={styles.value}>{profileData.telefone}</span>
            )}
          </div>

          {/* Endereço (Editável) */}
          <div className={styles.infoGroup}>
            <label className={styles.label}>Endereço:</label>
            {isEditing ? (
              <input 
                type="text" 
                name="endereco"
                className={styles.input}
                value={editData.endereco}
                onChange={handleInputChange}
              />
            ) : (
              <span className={styles.value}>{profileData.endereco}</span>
            )}
          </div>

        </div>

        {/* Botões de Ação */}
        <div className={styles.actionButtons}>
          {isEditing ? (
            <>
              <button className={styles.btnPrimary} onClick={handleUpdate}>Atualizar</button>
              <button className={styles.btnSecondary} onClick={handleClear}>Limpar</button>
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