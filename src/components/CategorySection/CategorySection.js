import React from 'react';
import styles from './CategorySection.module.css';

const CategorySection = ({ title, books }) => {
  const isEmpty = !books || books.length === 0;

  return (
    <div className={styles.sectionContainer}>
      <div className={styles.header}>
        <div className={styles.titleBadge}>
          <span className={styles.titleText}>{title}</span>
        </div>
        <a href="#" className={styles.viewMore}>Ver mais</a>
      </div>

      <div className={styles.contentArea}>
        {isEmpty ? (
          <p className={styles.emptyText}>Nenhum livro disponível no momento.</p>
        ) : (
          // Aqui seria o mapeamento dos cards de livros
          books.map((book, index) => <div key={index}>{book.title}</div>)
        )}
      </div>
    </div>
  );
};

export default CategorySection;