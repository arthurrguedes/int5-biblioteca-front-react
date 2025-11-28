import React from 'react';
import { Link } from 'react-router-dom';
import { FaBookOpen } from 'react-icons/fa';
import styles from './BookCard.module.css';

const BookCard = ({ book, linkTo }) => {
  const Wrapper = linkTo ? Link : 'div';

  return (
    <Wrapper to={linkTo} className={styles.card}>
      <div className={styles.placeholder}>
        <FaBookOpen />
      </div>
      <div>
        <div className={styles.title} title={book.title}>{book.title}</div>
        <div className={styles.author}>{book.author}</div>
      </div>
    </Wrapper>
  );
};

export default BookCard;