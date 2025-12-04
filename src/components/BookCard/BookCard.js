import React from 'react'; 
import { Link } from 'react-router-dom';
import { FaBookOpen } from 'react-icons/fa';
import styles from './BookCard.module.css';
import { mapeamentodeimg } from '../../mapeamento/coverMap.js'; // <-- CORRIGIDO AQUI!

const BookCard = ({ book, linkTo }) => {
  const Wrapper = linkTo ? Link : 'div';
  
  const coverUrl = mapeamentodeimg[book.isbn]; 

  return (
    <Wrapper to={linkTo} className={styles.card}>
      {coverUrl ? (
          // Exibe a imagem se a URL foi encontrada no mapa
          <img 
            src={coverUrl} 
            alt={`Capa do livro ${book.title}`} 
            className={styles.coverImage} 
          />
      ) : (
          // Se o ISBN não estiver mapeado, exibe o placeholder.
          <div className={styles.placeholder}>
            <FaBookOpen />
          </div>
      )}
      
      <div>
        <div className={styles.title} title={book.title}>{book.title}</div>
        <div className={styles.author}>{book.author}</div>
      </div>
    </Wrapper>
  );
};

export default BookCard;