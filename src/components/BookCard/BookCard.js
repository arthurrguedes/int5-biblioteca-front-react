// src/components/BookCard/BookCard.js

import React from 'react'; 
import { Link } from 'react-router-dom';
import { FaBookOpen } from 'react-icons/fa';
import styles from './BookCard.module.css';
// ALTERE A LINHA ABAIXO PARA INCLUIR O '.js'
import { CUSTOM_COVER_MAP } from '../../mapeamento/coverMap.js'; // <-- CORRIGIDO AQUI!

const BookCard = ({ book, linkTo }) => {
  const Wrapper = linkTo ? Link : 'div';
  
  // Tenta buscar a URL no mapa usando o ISBN (inventado) como chave
  const coverUrl = CUSTOM_COVER_MAP[book.isbn]; 

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