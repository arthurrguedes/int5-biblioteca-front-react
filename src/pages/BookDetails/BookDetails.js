import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styles from './BookDetails.module.css';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { FaSearch } from 'react-icons/fa';
import { bookService } from '../../services/bookService';

const BookDetails = () => {
  const [categories, setCategories] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [bookData, genresData] = await Promise.all([
        bookService.getBookById(id),
        bookService.getGenres()
      ]);
      
      setBook(bookData);
      setCategories(genresData);
      setLoading(false);
    };
    loadData();
  }, [id]);

  useEffect(() => {
    const loadBook = async () => {
      setLoading(true);
      const data = await bookService.getBookById(id);
      setBook(data);
      setLoading(false);
    };
    loadBook();
  }, [id]);

  const handleReserve = () => {
    navigate('/reservas', { state: { selectedBookTitle: book.title } });
  };

  if (loading) return <div className={styles.container}>Carregando...</div>;

  if (!book) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>Livro não encontrado.</div>
        <button onClick={() => navigate('/catalogo')}>Voltar ao Catálogo</button>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Catálogo', path: '/catalogo' },
    { label: book.category, path: '#' }
  ];

  return (
    <div className={styles.container}>
      <Breadcrumb items={breadcrumbItems} />

      <div className={styles.contentLayout}>
        
        {/* Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarTitle}>Nosso acervo</div>
          <ul className={styles.categoryList}>
            {categories.map(cat => (
              <li key={cat} className={styles.categoryItem}>
                <Link to="/catalogo" style={{ textDecoration: 'none', color: 'inherit' }}>
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Conteúdo Principal */}
        <div className={styles.mainContent}>
          
          {/* Header com Busca */}
          <div className={styles.headerSection}>
            <div className={styles.searchBar}>
              <input 
                type="text" 
                placeholder="Digite o nome do livro ou autor" 
                className={styles.searchInput}
              />
              <FaSearch className={styles.searchIcon} />
            </div>
          </div>

          {/* Card do Livro */}
          <div className={styles.bookDetailCard}>
            {/* Badge de Categoria */}
            <div className={styles.categoryBadge}>{book.category}</div>

            {/* Capa */}
            <div className={styles.bookCover}></div>

            {/* Detalhes */}
            <div className={styles.bookInfo}>
              <h1 className={styles.title}>{book.title}</h1>
              <div className={styles.author}>{book.author}</div>

              <div className={styles.metadata}>
                <p><span className={styles.label}>Editora:</span> {book.editora}</p>
                <p><span className={styles.label}>ISBN:</span> {book.isbn}</p>
                <p><span className={styles.label}>Edição/Ano:</span> {book.edition} ({book.year})</p>
                <p><span className={styles.label}>Idioma:</span> {book.language}</p>
                <p><span className={styles.label}>Estoque:</span> {book.totalStock} unidades</p>
              </div>

              <button className={styles.reserveButton} onClick={handleReserve}>
                Reservar
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BookDetails;