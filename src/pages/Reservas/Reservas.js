import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import styles from './Reservas.module.css';

// Dados mockados sincronizados com o Catálogo
// IMPORTANTE: Para o redirecionamento funcionar, o livro precisa existir nesta lista.
const MOCK_BOOKS = [
  { id: 1, title: 'Gestão de recursos humanos: teorias e reflexões', author: 'Kelly Cesar', year: '2018', edition: '1ª', language: 'Português', pages: 272, status: 'disponivel', queuePosition: null },
  { id: 2, title: 'O Guia do Mochileiro das Galáxias', author: 'Douglas Adams', year: '2010', edition: '10ª', language: 'Português', pages: 300, status: 'indisponivel', queuePosition: 5 },
  { id: 3, title: 'A Culpa é das Estrelas', author: 'John Green', year: '2012', edition: '5ª', language: 'Português', pages: 280, status: 'disponivel', queuePosition: null },
  { id: 4, title: 'Código Limpo', author: 'Robert C. Martin', year: '2009', edition: '1ª', language: 'Português', pages: 464, status: 'disponivel', queuePosition: null },
  { id: 5, title: 'Use a Cabeça! Java', author: 'Kathy Sierra', year: '2007', edition: '2ª', language: 'Português', pages: 688, status: 'disponivel', queuePosition: null },
  { id: 6, title: 'O Poder do Hábito', author: 'Charles Duhigg', year: '2012', edition: '3ª', language: 'Português', pages: 400, status: 'reservado', queuePosition: null },
  { id: 7, title: 'It: A Coisa', author: 'Stephen King', year: '2014', edition: '4ª', language: 'Português', pages: 1138, status: 'indisponivel', queuePosition: 10 },
  { id: 8, title: 'A Semente do Amanhã', author: 'Roberto C. Martin', year: '2019', edition: '1ª', language: 'Português', pages: 200, status: 'disponivel', queuePosition: null },
  { id: 9, title: 'Misterio no Expresso Oriente', author: 'Agatha Christie', year: '2020', edition: '1ª', language: 'Português', pages: 350, status: 'disponivel', queuePosition: null },
  { id: 10, title: 'O Senhor dos Anéis', author: 'J.R.R. Tolkien', year: '2019', edition: '1ª', language: 'Português', pages: 1200, status: 'disponivel', queuePosition: null },
  { id: 11, title: 'Piquenique na Relva', author: 'Autor Hilario', year: '2018', edition: '2ª', language: 'Português', pages: 150, status: 'disponivel', queuePosition: null },
  { id: 12, title: 'O Monge e o Executivo', author: 'James C. Hunter', year: '2004', edition: '1ª', language: 'Português', pages: 180, status: 'reservado', queuePosition: null },
  { id: 13, title: 'O Labirinto do Fauno', author: 'Guillermo del Toro', year: '2019', edition: '1ª', language: 'Português', pages: 250, status: 'disponivel', queuePosition: null },
  // Adicional da tela de empréstimos
  { id: 99, title: 'Café Com Deus Pai Edição 2025', author: 'Júnior Rostirola', year: '2025', edition: '-', language: 'Português', pages: 424, status: 'indisponivel', queuePosition: 2 },
];

const Reservas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [quantities, setQuantities] = useState({}); 

  const location = useLocation();
  const navigate = useNavigate();

  // Efeito para capturar o livro enviado pela navegação (Catálogo ou Detalhes)
  useEffect(() => {
    if (location.state && location.state.selectedBookTitle) {
      const titleToFind = location.state.selectedBookTitle;
      
      // Busca o livro na lista mockada
      const foundBook = MOCK_BOOKS.find(b => 
        b.title.toLowerCase().trim() === titleToFind.toLowerCase().trim()
      );

      if (foundBook) {
        setSelectedBook(foundBook); // Seleciona o card e abre a sidebar
        setSearchTerm(foundBook.title); // Filtra a lista para mostrar apenas este livro
      }
    }
  }, [location.state]);

  const filteredBooks = MOCK_BOOKS.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleQuantityChange = (id, delta) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta)
    }));
  };

  const handleSelectBook = (book) => {
    setSelectedBook(book);
  };

  const handleConfirmAction = () => {
    if (!selectedBook) return;

    if (selectedBook.status === 'disponivel') {
      alert(`Reserva confirmada para: ${selectedBook.title}`);
    } else if (selectedBook.status === 'indisponivel') {
      alert(`Você entrou na fila de espera para: ${selectedBook.title}`);
    } else if (selectedBook.status === 'reservado') {
      const confirmCancel = window.confirm('Deseja realmente cancelar esta reserva?');
      if (confirmCancel) {
        alert('Reserva cancelada com sucesso.');
      }
    }
  };

  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  
  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: '(usuário)', path: '#' },
    { label: 'Reserva', path: '/reservas' }
  ];

  return (
    <div className={styles.container}>
      <Breadcrumb items={breadcrumbItems} />

      <div className={styles.contentLayout}>
        
        {/* LISTA DE LIVROS */}
        <div className={styles.leftColumn}>
          <h1 className={styles.pageTitle}>Faça sua reserva</h1>
          
          <div className={styles.searchBar}>
            <input 
              type="text" 
              placeholder="Digite o nome do livro ou autor" 
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className={styles.searchIcon} />
          </div>

          <div className={styles.bookList}>
            {filteredBooks.length > 0 ? (
              filteredBooks.map(book => (
                <div 
                  key={book.id} 
                  className={`${styles.bookCard} ${selectedBook?.id === book.id ? styles.selected : ''}`}
                >
                  <div className={styles.bookInfo}>
                    <div className={styles.bookCover}></div>
                    <div className={styles.bookDetails}>
                      <h3>{book.title}</h3>
                      <p><strong>Autor(a):</strong> {book.author}</p>
                      <p><strong>Edição/Ano:</strong> {book.edition} ({book.year})</p>
                      <p><strong>Idioma:</strong> {book.language}</p>
                      <p><strong>Páginas:</strong> {book.pages}</p>
                      
                      {book.status === 'disponivel' && <p className={`${styles.statusText} ${styles.statusAvailable}`}>Disponível</p>}
                      {book.status === 'indisponivel' && <p className={`${styles.statusText} ${styles.statusUnavailable}`}>Indisponível</p>}
                      {book.status === 'reservado' && <p className={`${styles.statusText} ${styles.statusReserved}`}>Reservado por você</p>}
                    </div>
                  </div>

                  <div className={styles.bookActions}>
                    <div className={styles.quantityControl}>
                      <button className={styles.qtyBtn} onClick={() => handleQuantityChange(book.id, -1)}>-</button>
                      <span className={styles.qtyValue}>{quantities[book.id] || 1}</span>
                      <button className={styles.qtyBtn} onClick={() => handleQuantityChange(book.id, 1)}>+</button>
                    </div>

                    {book.status === 'disponivel' && (
                      <button 
                        className={`${styles.actionButton} ${styles.btnGreen}`}
                        onClick={() => handleSelectBook(book)}
                      >
                        Reservar
                      </button>
                    )}

                    {book.status === 'indisponivel' && (
                      <button 
                        className={`${styles.actionButton} ${styles.btnOrange}`}
                        onClick={() => handleSelectBook(book)}
                      >
                        Entrar na fila
                      </button>
                    )}

                    {book.status === 'reservado' && (
                      <button 
                        className={`${styles.actionButton} ${styles.btnRed}`}
                        onClick={() => handleSelectBook(book)}
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                Nenhum livro encontrado.
              </div>
            )}
          </div>

          <button 
            className={styles.myLoansButton}
            onClick={() => navigate('/emprestimos')}
          >
            Meus Emprestimos
          </button>
        </div>

        {/* SIDEBAR DE DETALHES */}
        <div className={styles.rightColumn}>
          <div className={styles.sidebarCard}>
            <div className={styles.orangeHeader}></div>
            
            {selectedBook ? (
              <>
                <div className={styles.sidebarBookInfo}>
                  <div className={styles.sidebarCover}></div>
                  <div className={styles.sidebarText}>
                    <h4>{selectedBook.title}</h4>
                    <p>{selectedBook.author}</p>
                  </div>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.label}>Retirada</span>
                  <span className={styles.value}>{formatDate(today)}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Devolução</span>
                  <span className={styles.value}>{formatDate(nextWeek)}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Fila de Espera</span>
                  <span className={styles.value}>
                    {selectedBook.queuePosition 
                      ? `${selectedBook.queuePosition} na fila` 
                      : '0 na fila'}
                  </span>
                </div>

                <div className={styles.rulesSection}>
                  <div className={styles.rulesTitle}>Regras para reserva</div>
                  <div className={styles.rulesText}>
                    Prazo para retirada: 48 horas<br/>
                    Limite de reservas por usuario: xx<br/>
                    Cancelamento automático em caso de não retirada
                  </div>
                </div>

                <button 
                  className={styles.confirmButton} 
                  onClick={handleConfirmAction}
                  style={{ 
                    backgroundColor: selectedBook.status === 'reservado' ? '#e57373' : '#4caf50' 
                  }}
                >
                  {selectedBook.status === 'reservado' ? 'Confirmar Cancelamento' : 'Confirmar'}
                </button>
              </>
            ) : (
              <div className={styles.noSelection}>
                Selecione um livro para ver os detalhes.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Reservas;