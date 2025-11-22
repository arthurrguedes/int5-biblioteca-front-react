import React, { useState, useMemo } from 'react';
import styles from './Estoque.module.css';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { FaSearch } from 'react-icons/fa';

// Categorias
const CATEGORIES = [
  'Todos os Livros',
  'Humor', 'Tecnologia', 'Romance', 'Autoajuda', 'Terror', 
  'Ficção Científica', 'Fantasia', 'Mistério', 'Aventura', 'Histórico'
];

// Dados de Estoque Sincronizados com o Catálogo
// Adicionei campos 'totalStock', 'rented' e 'reserved' para simular o status
const INITIAL_INVENTORY = [
  { id: 1, title: 'Gestão de recursos humanos: teorias e reflexões', author: 'Kelly Cesar', category: 'Humor', totalStock: 20, rented: 2, reserved: 1 },
  { id: 2, title: 'O Guia do Mochileiro das Galáxias', author: 'Douglas Adams', category: 'Ficção Científica', totalStock: 5, rented: 5, reserved: 0 }, // Indisponível
  { id: 3, title: 'A Culpa é das Estrelas', author: 'John Green', category: 'Romance', totalStock: 15, rented: 3, reserved: 0 },
  { id: 4, title: 'Código Limpo', author: 'Robert C. Martin', category: 'Tecnologia', totalStock: 10, rented: 8, reserved: 1 }, // Último exemplar (10 - 9 = 1)
  { id: 5, title: 'Use a Cabeça! Java', author: 'Kathy Sierra', category: 'Tecnologia', totalStock: 8, rented: 0, reserved: 0 },
  { id: 6, title: 'O Poder do Hábito', author: 'Charles Duhigg', category: 'Autoajuda', totalStock: 12, rented: 4, reserved: 2 },
  { id: 7, title: 'It: A Coisa', author: 'Stephen King', category: 'Terror', totalStock: 3, rented: 2, reserved: 1 }, // Indisponível
  { id: 8, title: 'A Semente do Amanhã', author: 'Roberto C. Martin', category: 'Tecnologia', totalStock: 6, rented: 1, reserved: 0 },
  { id: 9, title: 'Misterio no Expresso Oriente', author: 'Agatha Christie', category: 'Mistério', totalStock: 5, rented: 4, reserved: 0 }, // Último exemplar
  { id: 10, title: 'O Senhor dos Anéis', author: 'J.R.R. Tolkien', category: 'Fantasia', totalStock: 4, rented: 0, reserved: 0 },
  { id: 11, title: 'Piquenique na Relva', author: 'Autor Hilario', category: 'Humor', totalStock: 2, rented: 0, reserved: 0 },
  { id: 12, title: 'O Monge e o Executivo', author: 'James C. Hunter', category: 'Autoajuda', totalStock: 20, rented: 10, reserved: 5 },
  { id: 13, title: 'O Labirinto do Fauno', author: 'Guillermo del Toro', category: 'Fantasia', totalStock: 7, rented: 2, reserved: 1 },
];

const Estoque = () => {
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos os Livros');

  // Lógica para atualizar o estoque TOTAL (Ação do bibliotecário)
  const handleStockChange = (id, delta) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        const newTotal = Math.max(0, item.totalStock + delta);
        // Validação: Não reduzir abaixo do que já está em uso
        if (newTotal < (item.rented + item.reserved)) {
          alert("Não é possível reduzir o estoque físico abaixo da quantidade emprestada/reservada.");
          return item;
        }
        return { ...item, totalStock: newTotal };
      }
      return item;
    }));
  };

  // Filtragem
  const filteredItems = useMemo(() => {
    return inventory.filter(item => {
      const matchesCategory = selectedCategory === 'Todos os Livros' ? true : item.category === selectedCategory;
      
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.author.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [inventory, selectedCategory, searchTerm]);

  // Helper para calcular status e disponibilidade
  const getItemStatus = (item) => {
    const available = item.totalStock - item.rented - item.reserved;
    
    if (available <= 0) return { label: 'Indisponível', style: styles.statusUnavailable, count: 0 };
    if (available === 1) return { label: 'Último exemplar', style: styles.statusLastUnit, count: 1 };
    return { label: 'Disponível', style: styles.statusAvailable, count: available };
  };

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: '(usuário)', path: '#' },
    { label: 'Estoque', path: '/estoque' },
    { label: 'Livro', path: '#' }
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
              <li 
                key={cat} 
                className={`${styles.categoryItem} ${selectedCategory === cat ? styles.active : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </li>
            ))}
          </ul>
        </div>

        {/* Conteúdo Principal */}
        <div className={styles.mainContent}>
          
          {/* Header da Seção */}
          <div className={styles.headerSection}>
            <h2 className={styles.categoryHeader}>{selectedCategory}</h2>
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
          </div>

          {/* Grid/Tabela */}
          <div className={styles.gridHeader}>
            <div>Livro</div>
            <div>Estoque Atual</div>
            <div>Status</div>
          </div>

          <div className={styles.stockList}>
            {filteredItems.length > 0 ? (
              filteredItems.map(item => {
                const status = getItemStatus(item);
                
                return (
                  <div key={item.id} className={styles.stockCard}>
                    
                    {/* Coluna 1: Checkbox + Info */}
                    <div className={styles.bookInfo}>
                      <input type="checkbox" className={styles.checkbox} />
                      <div className={styles.bookCover}></div>
                      <div className={styles.bookDetails}>
                        <h3>{item.title}</h3>
                        <p><strong>Autor(a):</strong> {item.author}</p>
                        {/* Exibição opcional de detalhes internos para depuração/gestão */}
                        {/* <p style={{fontSize: '10px', color: '#999'}}>Total: {item.totalStock} | Emp: {item.rented} | Res: {item.reserved}</p> */}
                      </div>
                    </div>

                    {/* Coluna 2: Controle de Estoque (Ação Admin) */}
                    <div className={styles.stockControl}>
                      <button className={styles.qtyBtn} onClick={() => handleStockChange(item.id, -1)}>-</button>
                      <span className={styles.qtyValue}>{status.count}</span>
                      <button className={styles.qtyBtn} onClick={() => handleStockChange(item.id, 1)}>+</button>
                    </div>

                    {/* Coluna 3: Status Texto */}
                    <div className={`${styles.statusBadge} ${status.style}`}>
                      {status.label}
                    </div>

                  </div>
                );
              })
            ) : (
              <div className={styles.noResults}>Nenhum livro encontrado nesta categoria.</div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Estoque;