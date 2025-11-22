import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import { FaUserCircle, FaChevronDown, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import LogoImage from '../../assets/logo.png';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  // Estado para o Dropdown de Perfil
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // Estado para o Menu Mobile (Sanduíche)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  
  // --- Controles do Perfil ---
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setIsDropdownOpen(false); // Fecha perfil
  
  // --- Controles do Menu Mobile ---
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isDropdownOpen) setIsDropdownOpen(false); // Fecha perfil se abrir menu
  };
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeDropdown();
    closeMobileMenu();
    navigate('/login');
  };

  // Lista de Links
  const getNavLinks = () => {
    const linksAdmin = [
      { to: '/estoque', label: 'Estoque' },
      { to: '/controle-reservas', label: 'Controle de Reservas' },
      { to: '/controle-emprestimos', label: 'Controle de Empréstimos' },
      { to: '/relatorios', label: 'Relatórios' },
      { to: '/contato', label: 'Contato' },
      { to: '/sobre-nos', label: 'Sobre Nós' },
    ];
    
    const linksUser = [
      { to: '/catalogo', label: 'Catálogo' },
      { to: '/reservas', label: 'Reservas' },
      { to: '/emprestimos', label: 'Empréstimos' },
      { to: '/contato', label: 'Contato' },
      { to: '/sobre-nos', label: 'Sobre Nós' },
    ];

    const linksDeslogado = [
      { to: '/login', label: 'Sobre Nós' }, 
      { to: '/login', label: 'Catálogo' },  
      { to: '/login', label: 'Reservas' },  
      { to: '/login', label: 'Contato' },   
    ];
    
    if (!isLoggedIn) return linksDeslogado;
    if (user?.role === 'admin') return linksAdmin;
    return linksUser;
  };

  const navLinks = getNavLinks();

  return (
    <header className={styles.header}>
      {/* Logo à Esquerda */}
      <div className={styles.leftNav}> 
        <Link to="/" className={styles.logoLink} onClick={closeMobileMenu}> 
          <img src={LogoImage} alt="Logo Biblioteca Plus" className={styles.logoImage} /> 
        </Link>
      </div>

      <div className={styles.rightNav}> 
        
        {/* 1. Links em Linha (Apenas Desktop) */}
        <div className={styles.desktopLinks}>
          {navLinks.map((link, index) => (
            <Link 
              key={index} 
              to={link.to} 
              className={styles.navLink}
            >
              {link.label}
            </Link>
          ))}
        </div>
        
        {/* 2. Ícone de Perfil + Dropdown (Sempre visível) */}
        <div 
          className={styles.profileDropdownContainer} 
          onClick={toggleDropdown}
          // onMouseEnter e Leave podem ser removidos para melhor UX mobile (clique é melhor)
        >
          <div className={styles.profileContainer}>
            <FaUserCircle className={styles.userIcon} />
            <FaChevronDown className={styles.dropdownIcon} />
          </div>

          {isDropdownOpen && (
            <div className={styles.dropdownMenu}>
              {isLoggedIn ? (
                <>
                  <div className={styles.dropdownItem} style={{ cursor: 'default', fontWeight: 'bold' }}>
                    {user.username} <span style={{ fontSize: '12px', fontWeight: 'normal' }}>({user.role})</span>
                  </div>
                  <div className={styles.dropdownDivider}></div>
                  
                  <Link to="/perfil" className={styles.dropdownItem} onClick={closeDropdown}>
                    Meu Perfil
                  </Link>
                  
                  <div className={styles.dropdownDivider}></div>
                  <div 
                    className={styles.dropdownItem} 
                    onClick={handleLogout} 
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  >
                     <FaSignOutAlt style={{ marginRight: '8px' }} /> Sair
                  </div>
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

        {/* 3. Menu Sanduíche (Apenas Mobile - À direita do perfil) */}
        <div className={styles.hamburgerIcon} onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

      </div>

      {/* 4. Lista de Links Mobile (Abre quando sanduíche é clicado) */}
      {isMobileMenuOpen && (
        <nav className={styles.mobileMenu}>
          {navLinks.map((link, index) => (
            <Link 
              key={index} 
              to={link.to} 
              className={styles.mobileNavLink}
              onClick={closeMobileMenu}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}

    </header>
  );
};

export default Header;