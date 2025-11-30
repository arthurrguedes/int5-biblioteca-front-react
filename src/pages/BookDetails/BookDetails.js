import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styles from './BookDetails.module.css';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { FaSearch } from 'react-icons/fa';
import { bookService } from '../../services/bookService'; 
import { reservasService } from '../../services/reservasService'; 
import { useAuth } from '../../contexts/AuthContext'; 
import { toast } from 'react-toastify';
import { mapeamentodeimg } from '../../mapeamento/coverMap'; // ✅ novo import

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]); 

  // ✅ função para pegar a capa pelo ISBN
  const getCoverImage = (isbn) => {
    if (!isbn) return "/img/capa-indisponivel.jpg";
    return mapeamentodeimg[isbn] || "/img/capa-indisponivel.jpg";
  };

  // Carrega os dados de livro e categorias
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [bookData, genresData] = await Promise.all([
          bookService.getBookById(id),
          bookService.getGenres()
        ]);
        
        setBook(bookData);
        setCategories(genresData);
      } catch (error) {
        console.error("Erro ao carregar:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  // Reserva
  const handleReserve = async () => {
    if (!user) {
        toast.info("Faça login para reservar livros.");
        navigate('/login');
        return;
    }

    const result = await reservasService.createReservation(book.id);

    if (result.success) {
        if (result.type === 'RESERVA') {
            toast.success(result.message);
            navigate('/reservas');
        } else if (result.type === 'ESPERA') {
            toast.warn(result.message, { autoClose: 5000 }); 
        }
    } else {
        toast.error(result.message);
    }
  };
  
  if (loading) return <div className={styles.container}><p style={{padding: 20}}>Carregando...</p></div>;

  if (!book) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>Livro não encontrado.</div>
        <button onClick={() => navigate('/catalogo')} className={styles.reserveButton}>
            Voltar ao Catálogo
        </button>
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
        
        {/* Sidebar com as categorias */}
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

        {/* Conteúdo principal */}
        <div className={styles.mainContent}>
          
            {/* Header */}
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

            {/* Card do livro */}
            <div className={styles.bookDetailCard}>
                <div className={styles.categoryBadge}>{book.category}</div>

                {/* ✅ capa do livro renderizada pelo mapeamento */}
                <div className={styles.bookCover}>
                  <img
                    src={getCoverImage(book.isbn)}
                    alt={book.title}
                    className={styles.coverImage}
                  />
                </div>

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
