import React, { useState, useMemo, useEffect } from 'react';
import styles from './Catalogue.module.css';
import { FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import BookCard from '../../components/BookCard/BookCard';
import { bookService } from '../../services/bookService';

const ITEMS_PER_PAGE = 12;

const Catalogue = () => {
  const [categories, setCategories] = useState([]); 
  const [books, setBooks] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
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
    setSelectedCategory(category === selectedCategory ? null : category);
    setSearchTerm(''); 
  };

  // Filtragem 
  const filteredBooks = useMemo(() => {
    let filtered = books;
    const lowerSearchTerm = searchTerm.toLowerCase().trim();

    if (selectedCategory) {
        filtered = filtered.filter(book => book.category.includes(selectedCategory));
    }

    if (lowerSearchTerm) {
        filtered = filtered.filter(book => 
          book.title.toLowerCase().includes(lowerSearchTerm) ||
          book.author.toLowerCase().includes(lowerSearchTerm) ||
          book.category.toLowerCase().includes(lowerSearchTerm)
        );
    }

    return filtered;
  }, [selectedCategory, searchTerm, books]);

  // Resetar para página 1 mudando o filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  // Lógica de paginação 
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentBooks = filteredBooks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

          <div className={styles.categoryHeader} style={{ display: 'flex', flexDirection: 'column' }}>
            <span className={styles.categoryHeaderText}>{getHeaderTitle()}</span>

            <span style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
            {filteredBooks.length} livro(s) encontrado(s)
            </span>
          </div>

          {loading ? (
             <div style={{ padding: '20px', textAlign: 'center' }}>Carregando acervo...</div>
          ) : (
            <>
              <div className={styles.bookGrid}>
                  {currentBooks.length > 0 ? (
                    currentBooks.map(book => (
                        <BookCard key={book.id} book={book} linkTo={`/catalogo/livro/${book.id}`} />
                    ))
                  ) : (
                    <div className={styles.noResults}>Nenhum livro encontrado.</div>
                  )}
              </div>

              {/* Controles de paginação */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '30px' }}>
                    <button 
                        onClick={() => paginate(currentPage - 1)} 
                        disabled={currentPage === 1}
                        style={{
                            padding: '8px 12px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            background: currentPage === 1 ? '#eee' : 'white',
                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                        }}
                    >
                        <FaChevronLeft /> Anterior
                    </button>
                    
                    <span style={{ fontWeight: 'bold', color: '#333' }}>
                        Página {currentPage} de {totalPages}
                    </span>

                    <button 
                        onClick={() => paginate(currentPage + 1)} 
                        disabled={currentPage === totalPages}
                        style={{
                            padding: '8px 12px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            background: currentPage === totalPages ? '#eee' : 'white',
                            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                        }}
                    >
                        Próximo <FaChevronRight />
                    </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Catalogue;