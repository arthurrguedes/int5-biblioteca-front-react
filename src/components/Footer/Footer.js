import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        
        <div className={styles.brand}>Biblioteca+</div>

        <div className={styles.copyright}>
          &copy; {new Date().getFullYear()} Biblioteca+. Todos os direitos reservados.
        </div>

      </div>
    </footer>
  );
};

export default Footer;