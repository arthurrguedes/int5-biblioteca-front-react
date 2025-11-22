// src/components/Header/Header.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import { FaUserCircle, FaChevronDown, FaSignOutAlt } from 'react-icons/fa';
import LogoImage from '../../assets/logo.png';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  
  const openDropdown = () => {
    setIsDropdownOpen(true);
  };
  
  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const handleLogout = () => {
    logout();
    closeDropdown();
    navigate('/login');
  };

  // Define todos os links da navegação
  const getNavLinks = () => {
    
    // LINKS DO ADMIN: Estoque, Controles, Relatórios + Comuns
    const linksAdmin = [
      { to: '/estoque', label: 'Estoque' },
      { to: '/controle-reservas', label: 'Controle de Reservas' },
      { to: '/controle-emprestimos', label: 'Controle de Empréstimos' },
      { to: '/relatorios', label: 'Relatórios' },
      { to: '/contato', label: 'Contato' },
      { to: '/sobre-nos', label: 'Sobre Nós' },
    ];
    
    // LINKS DO USUÁRIO COMUM (Corrigido para evitar repetições e manter a ordem)
    const linksUser = [
      { to: '/catalogo', label: 'Catálogo' },
      { to: '/reservas', label: 'Reservas' },
      { to: '/emprestimos', label: 'Empréstimos' },
      { to: '/contato', label: 'Contato' },
      { to: '/sobre-nos', label: 'Sobre Nós' },
    ];

    // LINKS PARA USUÁRIO DESLOGADO (Mantendo a ordem estrutural original do template)
    const linksDeslogado = [
      { to: '#', label: 'Sobre Nós' }, // Link 1
      { to: '#', label: 'Catálogo' },  // Link 2
      { to: '#', label: 'Reservas' },  // Link 3
      { to: '#', label: 'Contato' },   // Link 4
      { to: '#', label: 'Sobre Nós' }, // O template original tinha 5 links fixos, incluindo repetição de Sobre Nós
    ];
    
    // Se o user object não existe, verificamos se há token (não)
    if (!isLoggedIn) {
        // Para o estado deslogado, vamos usar os 4 links originais, removendo a repetição
        // que causava a desordem, e mantendo os que você viu na imagem mais cedo.
        return [
          { to: '#', label: 'Sobre Nós' }, 
          { to: '#', label: 'Catálogo' },  
          { to: '#', label: 'Reservas' },  
          { to: '#', label: 'Contato' },   
        ];
    }

    if (user?.role === 'admin') {
      // Retorna a lista exclusiva e correta do Admin
      return linksAdmin;
    } 
    
    if (user?.role === 'user') {
      // Retorna a lista exclusiva e correta do Usuário Comum
      return linksUser;
    }

    // Fallback para caso não haja role, mas esteja logado
    return linksDeslogado;
  };

  return (
    <header className={styles.header}>
      <div className={styles.leftNav}> 
        <Link to="/" className={styles.logoLink}> 
          <img src={LogoImage} alt="Logo Biblioteca Plus" className={styles.logoImage} /> 
        </Link>
      </div>

      <div className={styles.rightNav}> 
        {/* Renderiza links dinamicamente */}
        {getNavLinks().map((link, index) => (
          // Usando o índice como chave temporária, já que o "to" pode ser '#'
          <Link 
            key={link.to + index} // Chave combinada para unicidade
            to={link.to} 
            className={styles.navLink}
            // Impede navegação se o link for apenas um placeholder '#'
            onClick={link.to === '#' ? (e) => e.preventDefault() : undefined} 
          >
            {link.label}
          </Link>
        ))}
        
        <div 
          className={styles.profileDropdownContainer} 
          onClick={toggleDropdown} 
          onMouseEnter={openDropdown} 
          onMouseLeave={closeDropdown} 
        >
          <div className={styles.profileContainer}>
            <FaUserCircle className={styles.userIcon} />
            <FaChevronDown className={styles.dropdownIcon} />
          </div>

          {isDropdownOpen && (
            <div className={styles.dropdownMenu}>
              {isLoggedIn ? (
                <>
                  <div className={styles.dropdownItem}>
                    Olá, **{user.username}** ({user.role})
                  </div>
                  <div className={styles.dropdownDivider}></div>
                  
                  {/* Links do Dropdown para Admin */}
                  {user.role === 'admin' && (
                    <>
                      <Link to="/perfil" className={styles.dropdownItem} onClick={closeDropdown}>
                        Perfil
                      </Link>
                      <Link to="/controle-reservas" className={styles.dropdownItem} onClick={closeDropdown}>
                        Controle de Reservas
                      </Link>
                      <div className={styles.dropdownDivider}></div>
                      <Link to="/controle-emprestimos" className={styles.dropdownItem} onClick={closeDropdown}>
                        Cont. de Empréstimos
                      </Link>
                      <div className={styles.dropdownDivider}></div>
                      <Link to="/relatorios" className={styles.dropdownItem} onClick={closeDropdown}>
                        Relatórios
                      </Link>
                      <div className={styles.dropdownDivider}></div>
                      <Link to="#" className={styles.dropdownItem} onClick={handleLogout}>
                         <FaSignOutAlt style={{ marginRight: '5px' }} /> Sair
                      </Link>
                    </>
                  )}

                  {/* Links do Dropdown para Usuário Comum */}
                  {user.role === 'user' && (
                    <>
                      <Link to="/perfil" className={styles.dropdownItem} onClick={closeDropdown}>
                        Perfil
                      </Link>
                      <div className={styles.dropdownDivider}></div>
                      <Link to="/emprestimos" className={styles.dropdownItem} onClick={closeDropdown}>
                        Empréstimos
                      </Link>
                      <div className={styles.dropdownDivider}></div>
                      <Link to="#" className={styles.dropdownItem} onClick={handleLogout}>
                         <FaSignOutAlt style={{ marginRight: '5px' }} /> Sair
                      </Link>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Link to="/login" className={styles.dropdownItem} onClick={toggleDropdown}>
                    Login
                  </Link>
                  <div className={styles.dropdownDivider}></div>
                  <Link to="/cadastro" className={styles.dropdownItem} onClick={toggleDropdown}>
                    Cadastre-se
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;