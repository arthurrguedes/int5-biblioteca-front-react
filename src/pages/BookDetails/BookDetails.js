import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styles from './BookDetails.module.css';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { FaSearch } from 'react-icons/fa';
import { bookService } from '../../services/bookService'; 
import { reservasService } from '../../services/reservasService'; 
import { useAuth } from '../../contexts/AuthContext'; 
import { toast } from 'react-toastify';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]); 

  // Carrega os dados reais do Livro e Categorias
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Busca livro e categorias em paralelo
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

  // Lógica de Reserva
  const handleReserve = async () => {
    if (!user) {
        toast.info("Faça login para reservar livros.");
        navigate('/login');
        return;
    }

    // Chama o serviço de reserva
    const result = await reservasService.createReservation(book.id);

    if (result.success) {
        if (result.type === 'RESERVA') {
            toast.success(result.message);
            navigate('/reservas');
        } else {
            toast.warn(result.message); // Lista de Espera
        }
    } else {
        toast.error(result.message);
    }
  };

  // Verificações de Segurança (Antes de renderizar qualquer coisa que use 'book')
  
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
        
        {/* Sidebar com Categorias Reais */}
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

            {/* Card do Livro */}
            <div className={styles.bookDetailCard}>
                <div className={styles.categoryBadge}>{book.category}</div>
                <div className={styles.bookCover}></div>

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