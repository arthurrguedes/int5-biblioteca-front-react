import React, { useState, useMemo } from 'react';
import styles from './Catalogue.module.css';
import { FaSearch } from 'react-icons/fa';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import BookCard from '../../components/BookCard/BookCard';

const MOCK_BOOKS = [
  { id: 1, title: 'Gestão de recursos humanos: teorias e reflexões', author: 'Kelly Cesar', category: 'Humor', isbn: '978852703857', edition: '1ª (2018)', pages: 272 },
  { id: 2, title: 'O Guia do Mochileiro das Galáxias', author: 'Douglas Adams', category: 'Ficção Científica', isbn: '1234567890123', edition: 'Edição 10', pages: 300 },
  { id: 3, title: 'A Culpa é das Estrelas', author: 'John Green', category: 'Romance', isbn: '9876543210987', edition: 'Edição 5', pages: 280 },
  { id: 4, title: 'Código Limpo', author: 'Robert C. Martin', category: 'Tecnologia', isbn: '1122334455667', edition: 'Edição 1', pages: 464 },
  { id: 5, title: 'Use a Cabeça! Java', author: 'Kathy Sierra', category: 'Tecnologia', isbn: '5544332211009', edition: 'Edição 2', pages: 688 },
  { id: 6, title: 'O Poder do Hábito', author: 'Charles Duhigg', category: 'Autoajuda', isbn: '1111111111111', edition: 'Edição 3', pages: 400 },
  { id: 7, title: 'It: A Coisa', author: 'Stephen King', category: 'Terror', isbn: '2222222222222', edition: 'Edição 4', pages: 1138 },
  { id: 8, title: 'A Semente do Amanhã', author: 'Roberto C. Martin', category: 'Tecnologia', isbn: '3333333333333', edition: 'Edição 1', pages: 200 },
  { id: 9, title: 'Misterio no Expresso Oriente', author: 'Agatha Christie', category: 'Mistério', isbn: '4444444444444', edition: 'Edição 1', pages: 350 },
  { id: 10, title: 'O Senhor dos Anéis', author: 'J.R.R. Tolkien', category: 'Fantasia', isbn: '5555555555555', edition: 'Edição 1', pages: 1200 },
  { id: 11, title: 'Piquenique na Relva', author: 'Autor Hilario', category: 'Humor', isbn: '6666666666666', edition: 'Edição 2', pages: 150 },
  { id: 12, title: 'O Monge e o Executivo', author: 'James C. Hunter', category: 'Autoajuda', isbn: '7777777777777', edition: 'Edição 1', pages: 180 },
  { id: 13, title: 'O Labirinto do Fauno', author: 'Guillermo del Toro', category: 'Fantasia', isbn: '8888888888888', edition: 'Edição 1', pages: 250 },
];

const CATEGORIES = [
  'Humor', 'Tecnologia', 'Romance', 'Terror', 'Autoajuda', 
  'Ficção Científica', 'Fantasia', 'Mistério', 'Aventura', 'Histórico'
];

const Catalogue = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const handleCategoryClick = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
    setSearchTerm(''); 
  };

  const filteredBooks = useMemo(() => {
    let books = MOCK_BOOKS;
    const lowerSearchTerm = searchTerm.toLowerCase().trim();

    if (selectedCategory) {
      books = books.filter(book => book.category === selectedCategory);
    }

    if (lowerSearchTerm) {
      books = books.filter(book => 
        book.title.toLowerCase().includes(lowerSearchTerm) ||
        book.author.toLowerCase().includes(lowerSearchTerm) ||
        book.category.toLowerCase().includes(lowerSearchTerm)
      );
    }

    return books;
  }, [selectedCategory, searchTerm]);

  const getHeaderTitle = () => {
    if (searchTerm) return `Resultados da busca por: "${searchTerm}"`;
    if (selectedCategory) return selectedCategory;
    return 'Todos os Livros';
  };

  const breadcrumbItems = useMemo(() => {
    const items = [
      { label: 'Home', path: '/' },
      { label: 'Catálogo', path: '/catalogo' }
    ];

    if (searchTerm) {
      items.push({ label: `Busca: "${searchTerm}"`, path: '#' });
    } else if (selectedCategory) {
      items.push({ label: selectedCategory, path: '#' });
    }

    return items;
  }, [searchTerm, selectedCategory]);

  return (
    <div className={styles.catalogueContainer}>
      <div style={{ marginBottom: '20px' }}>
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className={styles.contentLayout}>
        <div className={styles.sidebar}>
          <div className={styles.sidebarTitle}>Nosso acervo</div>
          <ul className={styles.categoryList}>
            {CATEGORIES.map(category => (
              <li 
                key={category}
                className={`${styles.categoryItem} ${selectedCategory === category ? styles.active : ''}`}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.mainContent}>
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Digite o nome do livro, autor ou categoria"
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className={styles.searchButton}>
              <FaSearch />
            </button>
          </div>

          <div className={styles.categoryHeader}>
            <span className={styles.categoryHeaderText}>{getHeaderTitle()}</span>
          </div>

          <div className={styles.bookGrid}>
            {filteredBooks.length > 0 ? (
              filteredBooks.map(book => (
                <BookCard key={book.id} book={book} linkTo={`/catalogo/livro/${book.id}`} />
              ))
            ) : (
              <div className={styles.noResults}>Nenhum livro encontrado.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalogue;