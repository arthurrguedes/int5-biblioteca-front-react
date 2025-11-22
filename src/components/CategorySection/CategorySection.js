import React from 'react';
import { Link } from 'react-router-dom';
import { FaBookOpen } from 'react-icons/fa';
import styles from './CategorySection.module.css';

const CategorySection = ({ title, books }) => {
  const isEmpty = !books || books.length === 0;

  return (
    <div className={styles.sectionContainer}>
      <div className={styles.header}>
        <div className={styles.titleBadge}>
          <span className={styles.titleText}>{title}</span>
        </div>
        {/* Link para o catálogo filtrado se desejar implementar depois */}
        <Link to="/catalogo" className={styles.viewMore}>Ver mais</Link>
      </div>

      <div className={styles.contentArea}>
        {isEmpty ? (
          <p className={styles.emptyText}>Nenhum livro disponível nesta seção.</p>
        ) : (
          <div className={styles.booksScrollContainer}>
            {books.map((book) => (
              <Link to={`/catalogo/livro/${book.id}`} key={book.id} className={styles.bookCard}>
                <div className={styles.bookPlaceholder}>
                  <FaBookOpen style={{ fontSize: '30px', color: '#ccc' }} />
                </div>
                <div className={styles.bookInfo}>
                  <div className={styles.bookTitle} title={book.title}>{book.title}</div>
                  <div className={styles.bookAuthor}>{book.author}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategorySection;