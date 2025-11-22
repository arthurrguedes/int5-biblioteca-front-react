import React, { useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styles from './BookDetails.module.css';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { FaSearch } from 'react-icons/fa';

// Dados Mockados Expandidos (Para ter detalhes completos)
const MOCK_BOOKS_DETAILS = [
  { 
    id: 1, 
    title: 'Gestão de recursos humanos: teorias e reflexões', 
    author: 'Kely César Martins de Paiva', 
    category: 'Humor', // Na imagem está humor, mantive para fidelidade, embora o titulo pareça técnico
    isbn: '978852701537', 
    editora: 'Editora Intersaberes Ltda',
    edition: '1ª',
    year: '2019', 
    language: 'Português',
    pages: 272, 
  },
  { 
    id: 2, 
    title: 'O Guia do Mochileiro das Galáxias', 
    author: 'Douglas Adams', 
    category: 'Ficção Científica', 
    isbn: '1234567890123', 
    editora: 'Editora Arqueiro',
    edition: '10ª', 
    year: '2010',
    language: 'Português',
    pages: 300 
  },
  { 
    id: 3, 
    title: 'A Culpa é das Estrelas', 
    author: 'John Green', 
    category: 'Romance', 
    isbn: '9876543210987', 
    editora: 'Intrínseca',
    edition: '5ª', 
    year: '2012',
    language: 'Português',
    pages: 280 
  },
  { 
    id: 4, 
    title: 'Código Limpo', 
    author: 'Robert C. Martin', 
    category: 'Tecnologia', 
    isbn: '1122334455667', 
    editora: 'Alta Books',
    edition: '1ª', 
    year: '2009',
    language: 'Português',
    pages: 464 
  },
  // Adicione os outros IDs conforme necessário para não quebrar
];

const CATEGORIES = [
  'Humor', 'Tecnologia', 'Romance', 'Autoajuda', 'Terror', 
  'Ficção Científica', 'Fantasia', 'Mistério', 'Aventura', 'Histórico'
];

const BookDetails = () => {
  const { id } = useParams(); // Pega o ID da URL
  const navigate = useNavigate();

  // Busca o livro pelo ID
  const book = useMemo(() => {
    return MOCK_BOOKS_DETAILS.find(b => b.id === parseInt(id));
  }, [id]);

  const handleReserve = () => {
    // Redireciona para a tela de Reservas já com o livro selecionado
    navigate('/reservas', { state: { selectedBookTitle: book.title } });
  };

  // Se não achar o livro (ex: ID inválido)
  if (!book) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>Livro não encontrado.</div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: '(usuário)', path: '#' },
    { label: 'Catálogo', path: '/catalogo' },
    { label: 'Gênero', path: '#' }, // Poderia ser dinâmico se tivéssemos a rota
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
            {CATEGORIES.map(cat => (
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
                <p><span className={styles.label}>Páginas:</span> {book.pages}</p>
                <p><span className={styles.label}>Categoria(s):</span> {book.category}</p>
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