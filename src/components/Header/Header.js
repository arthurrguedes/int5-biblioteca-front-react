import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import { FaUserCircle, FaChevronDown } from 'react-icons/fa';
import LogoImage from '../../assets/logo.png';

const Header = () => {
  // Estado para controlar a visibilidade do dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  return (
    <header className={styles.header}>
      <div className={styles.leftNav}> 
        <Link to="/" className={styles.logoLink}> 
          <img src={LogoImage} alt="Logo Biblioteca Plus" className={styles.logoImage} /> 
        </Link>
      </div>

      <div className={styles.rightNav}> 
        <a href="#" className={styles.navLink}>Sobre Nós</a>
        <a href="#" className={styles.navLink}>Catálogo</a>
        <a href="#" className={styles.navLink}>Reservas</a>
        <a href="#" className={styles.navLink}>Contato</a>
        
        <div 
          className={styles.profileDropdownContainer} 
          onClick={toggleDropdown} 
        >
          <div className={styles.profileContainer}>
            <FaUserCircle className={styles.userIcon} />
            <FaChevronDown className={styles.dropdownIcon} />
          </div>

          {isDropdownOpen && (
            <div className={styles.dropdownMenu}>
              <Link to="/login" className={styles.dropdownItem} onClick={toggleDropdown}>
                Login
              </Link>
              <div className={styles.dropdownDivider}></div>
              <Link to="/cadastro" className={styles.dropdownItem} onClick={toggleDropdown}>
                Cadastre-se
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;