import React, { useState, useMemo } from 'react';
import styles from './Catalogue.module.css';
import { FaSearch, FaBookOpen } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// --- Dados Mockados para Simulação ---
const MOCK_BOOKS = [
  { id: 1, title: 'Gestão de recursos humanos: teorias e reflexões', author: 'Kelly Cesar', category: 'Humor', isbn: '978852703857', edition: '1ª (2018)', pages: 272, description: 'Descrição detalhada do livro...' },
  { id: 2, title: 'O Guia do Mochileiro das Galáxias', author: 'Douglas Adams', category: 'Ficção Científica', isbn: '1234567890123', edition: 'Edição 10', pages: 300, description: 'Uma aventura hilária no espaço.' },
  { id: 3, title: 'A Culpa é das Estrelas', author: 'John Green', category: 'Romance', isbn: '9876543210987', edition: 'Edição 5', pages: 280, description: 'Um romance emocionante.' },
  { id: 4, title: 'Código Limpo', author: 'Robert C. Martin', category: 'Tecnologia', isbn: '1122334455667', edition: 'Edição 1', pages: 464, description: 'Guia essencial para escrever código de qualidade.' },
  { id: 5, title: 'Use a Cabeça! Java', author: 'Kathy Sierra', category: 'Tecnologia', isbn: '5544332211009', edition: 'Edição 2', pages: 688, description: 'Aprenda Java de forma divertida.' },
  { id: 6, title: 'O Poder do Hábito', author: 'Charles Duhigg', category: 'Autoajuda', isbn: '1111111111111', edition: 'Edição 3', pages: 400, description: 'Descubra como os hábitos funcionam.' },
  { id: 7, title: 'It: A Coisa', author: 'Stephen King', category: 'Terror', isbn: '2222222222222', edition: 'Edição 4', pages: 1138, description: 'O clássico do terror.' },
  { id: 8, title: 'A Semente do Amanhã', author: 'Roberto C. Martin', category: 'Tecnologia', isbn: '3333333333333', edition: 'Edição 1', pages: 200, description: 'Um guia sobre sustentabilidade.' },
  { id: 9, title: 'Misterio no Expresso Oriente', author: 'Agatha Christie', category: 'Mistério', isbn: '4444444444444', edition: 'Edição 1', pages: 350, description: 'Um caso clássico de detetive.' },
  // Adicione mais livros conforme as categorias
  { id: 10, title: 'O Senhor dos Anéis', author: 'J.R.R. Tolkien', category: 'Fantasia', isbn: '5555555555555', edition: 'Edição 1', pages: 1200, description: 'A jornada épica pela Terra Média.' },
  { id: 11, title: 'Piquenique na Relva', author: 'Autor Hilario', category: 'Humor', isbn: '6666666666666', edition: 'Edição 2', pages: 150, description: 'Contos engraçados.' },
  { id: 12, title: 'O Monge e o Executivo', author: 'James C. Hunter', category: 'Autoajuda', isbn: '7777777777777', edition: 'Edição 1', pages: 180, description: 'Liderança e serviço.' },
  { id: 13, title: 'O Labirinto do Fauno', author: 'Guillermo del Toro', category: 'Fantasia', isbn: '8888888888888', edition: 'Edição 1', pages: 250, description: 'Conto de fantasia sombria.' },
];

const CATEGORIES = [
  'Humor', 'Tecnologia', 'Romance', 'Terror', 'Autoajuda', 
  'Ficção Científica', 'Fantasia', 'Mistério', 'Aventura', 'Histórico'
];
// --- Fim dos Dados Mockados ---

// Componente para o Card de Livro (Reutilizado da imagem)
const BookCard = ({ book }) => (
  // O link real deve ser dinâmico (ex: /catalogo/livro/1)
  <Link to={`/catalogo/livro/${book.id}`} className={styles.bookCard}>
    <div className={styles.bookPlaceholder}>
      <FaBookOpen style={{ fontSize: '40px', color: '#ccc' }} />
    </div>
    <div>
      <div className={styles.bookTitle} title={book.title}>{book.title}</div>
      <div className={styles.bookAuthor}>{book.author}</div>
    </div>
  </Link>
);

const Catalogue = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Função para lidar com a seleção de categoria
  const handleCategoryClick = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category); // Toggle
    setSearchTerm(''); // Limpa a busca ao selecionar categoria
  };

  // Lógica de filtragem e busca
  const filteredBooks = useMemo(() => {
    let books = MOCK_BOOKS;
    const lowerSearchTerm = searchTerm.toLowerCase().trim();

    // 1. Filtrar por categoria
    if (selectedCategory) {
      books = books.filter(book => book.category === selectedCategory);
    }

    // 2. Filtrar por termo de busca (título, autor ou categoria)
    if (lowerSearchTerm) {
      books = books.filter(book => 
        book.title.toLowerCase().includes(lowerSearchTerm) ||
        book.author.toLowerCase().includes(lowerSearchTerm) ||
        book.category.toLowerCase().includes(lowerSearchTerm)
      );
    }

    return books;
  }, [selectedCategory, searchTerm]);

  // Função para extrair o título do cabeçalho
  const getHeaderTitle = () => {
    if (searchTerm) {
      return `Resultados da busca por: "${searchTerm}"`;
    }
    if (selectedCategory) {
      return selectedCategory;
    }
    return 'Todos os Livros';
  };

  return (
    <div className={styles.catalogueContainer}>
      {/* Breadcrumb simulado */}
      <div className={styles.breadcrumb}>
        / (usuário) / Catálogo / <span>{getHeaderTitle()}</span>
      </div>

      <div className={styles.contentLayout}>
        
        {/* Sidebar de Categorias */}
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

        {/* Conteúdo Principal */}
        <div className={styles.mainContent}>
          
          {/* Barra de Busca */}
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Digite o nome do livro, autor ou categoria"
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              className={styles.searchButton}
              onClick={() => { /* A busca é automática pelo useMemo, mas o botão pode ser usado para focar */ }}
            >
              <FaSearch />
            </button>
          </div>

          {/* Listagem de Livros */}
          <div className={styles.categoryHeader}>
            <span className={styles.categoryHeaderText}>{getHeaderTitle()}</span>
          </div>

          <div className={styles.bookGrid}>
            {filteredBooks.length > 0 ? (
              filteredBooks.map(book => (
                <BookCard key={book.id} book={book} />
              ))
            ) : (
              <div className={styles.noResults}>Nenhum livro encontrado para os critérios de busca/filtro.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalogue;