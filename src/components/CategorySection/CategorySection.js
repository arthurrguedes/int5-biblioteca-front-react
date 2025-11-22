import React from 'react';
import { Link } from 'react-router-dom';
import styles from './CategorySection.module.css';
import BookCard from '../BookCard/BookCard';

const CategorySection = ({ title, books }) => {
  const isEmpty = !books || books.length === 0;

  return (
    <div className={styles.sectionContainer}>
      <div className={styles.header}>
        <div className={styles.titleBadge}>
          <span className={styles.titleText}>{title}</span>
        </div>
        <Link to="/catalogo" className={styles.viewMore}>Ver mais</Link>
      </div>

      <div className={styles.contentArea}>
        {isEmpty ? (
          <p className={styles.emptyText}>Nenhum livro disponível nesta seção.</p>
        ) : (
          <div className={styles.booksScrollContainer}>
            {books.map((book) => (
              <div key={book.id} style={{ width: '160px', flexShrink: 0 }}>
                <BookCard book={book} linkTo={`/catalogo/livro/${book.id}`} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategorySection;