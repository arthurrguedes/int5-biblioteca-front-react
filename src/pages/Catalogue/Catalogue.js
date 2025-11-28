import React, { useState, useMemo, useEffect } from 'react';
import styles from './Catalogue.module.css';
import { FaSearch } from 'react-icons/fa';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import BookCard from '../../components/BookCard/BookCard';
import { bookService } from '../../services/bookService';

const Catalogue = () => {
  const [categories, setCategories] = useState([]); 
  const [books, setBooks] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Busca livros e categorias
        const [booksData, genresData] = await Promise.all([
          bookService.getAllBooks(),
          bookService.getGenres()
        ]);
        
        setBooks(booksData);
        setCategories(genresData); 
      } catch (error) {
        console.error("Erro ao carregar catálogo:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []); 

  const handleCategoryClick = (category) => {
    // Se clicar na mesma, desmarca. Se for outra, seleciona.
    setSelectedCategory(category === selectedCategory ? null : category);
    setSearchTerm(''); // Limpa a busca ao trocar categoria
  };

  // Filtragem 
  const filteredBooks = useMemo(() => {
    let filtered = books;
    const lowerSearchTerm = searchTerm.toLowerCase().trim();

    // Filtro por categoria
    if (selectedCategory) {
        filtered = filtered.filter(book => book.category.includes(selectedCategory));
    }

    // Filtro por texto
    if (lowerSearchTerm) {
        filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(lowerSearchTerm) ||
        book.author.toLowerCase().includes(lowerSearchTerm) ||
        book.category.toLowerCase().includes(lowerSearchTerm)
      );
    }

    return filtered;
  }, [selectedCategory, searchTerm, books]);

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
        {/* Sidebar de categorias */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarTitle}>Nosso acervo</div>
          
          <ul className={styles.categoryList}>
            {categories.map(category => (
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

        {/* Conteúdo principal */}
        <div className={styles.mainContent}>
          
          {/* Barra de busca */}
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

          {/* Cabeçalho da lista */}
          <div className={styles.categoryHeader}>
            <span className={styles.categoryHeaderText}>{getHeaderTitle()}</span>
          </div>

          {/* Grid de livros */}
          {loading ? (
             <div style={{ padding: '20px', textAlign: 'center' }}>Carregando acervo...</div>
          ) : (
            <div className={styles.bookGrid}>
                {filteredBooks.length > 0 ? (
                filteredBooks.map(book => (
                    <BookCard key={book.id} book={book} linkTo={`/catalogo/livro/${book.id}`} />
                ))
                ) : (
                <div className={styles.noResults}>Nenhum livro encontrado.</div>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Catalogue;