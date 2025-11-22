import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Breadcrumb.module.css';

/**
 * Componente Breadcrumb (Caminho de Navegação)
 * * @param {Array<{ label: string, path: string }>} items - Array de objetos do caminho.
 * * Exemplo de uso:
 * <Breadcrumb items={[
 * { label: 'Home', path: '/' },
 * { label: 'Catálogo', path: '/catalogo' },
 * { label: 'Humor', path: '/catalogo?category=Humor' }
 * ]} />
 */
const Breadcrumb = ({ items }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav className={styles.breadcrumbContainer} aria-label="breadcrumb">
      <ol className={styles.breadcrumbList}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.label} className={styles.breadcrumbItem}>
              {/* Se não for o último item, é um link clicável */}
              {!isLast ? (
                <Link to={item.path} className={styles.link}>
                  {item.label}
                </Link>
              ) : (
                // O último item é o ativo e não clicável
                <span className={styles.active} aria-current="page">
                  {item.label}
                </span>
              )}
              
              {/* Adiciona separador, exceto no último item */}
              {!isLast && <span className={styles.separator}>/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;