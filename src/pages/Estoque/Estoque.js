import React, { useState, useMemo, useEffect } from 'react';
import styles from './Estoque.module.css';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { bookService } from '../../services/bookService';

const ITEMS_PER_PAGE = 12;

const Estoque = () => {
  const [categories, setCategories] = useState(['Todos os Livros']);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos os Livros');
  
  // Paginação
  const [currentPage, setCurrentPage] = useState(1);

  // Carrega dados
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [booksData, genresData] = await Promise.all([
          bookService.getAllBooks(),
          bookService.getGenres()
        ]);

        const safeBooksData = booksData.map(book => ({
            ...book,
            rented: book.rented || 0,
            reserved: book.reserved || 0
        }));

        setInventory(safeBooksData);
        setCategories(['Todos os Livros', ...genresData]);
      } catch (error) {
        toast.error("Erro ao carregar estoque.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleStockChange = async (id, delta) => {
    const currentItem = inventory.find(item => item.id === id);
    if (!currentItem) return;

    const newTotal = Math.max(0, currentItem.totalStock + delta);

    if (newTotal < (currentItem.rented + currentItem.reserved)) {
      toast.error("Não é possível reduzir o estoque físico abaixo da quantidade em uso.");
      return;
    }

    const success = await bookService.updateStock(id, newTotal);

    if (success) {
        setInventory(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, totalStock: newTotal };
            }
            return item;
        }));
        toast.success("Estoque atualizado!");
    } else {
        toast.error("Erro ao salvar no banco de dados.");
    }
  };

  // Filtragem
  const filteredItems = useMemo(() => {
    return inventory.filter(item => {
      const matchesCategory = selectedCategory === 'Todos os Livros' ? true : item.category.includes(selectedCategory);
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.author.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [inventory, selectedCategory, searchTerm]);

  // Resetar página ao filtrar
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  // Paginação lógica
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

  const getItemStatus = (item) => {
    const available = item.totalStock - item.rented - item.reserved;
    if (available <= 0) return { label: 'Indisponível', style: styles.statusUnavailable };
    if (available === 1) return { label: 'Último exemplar', style: styles.statusLastUnit };
    return { label: 'Disponível', style: styles.statusAvailable };
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
        
        <div className={styles.sidebar}>
          <div className={styles.sidebarTitle}>Nosso acervo</div>
          <ul className={styles.categoryList}>
            {categories.map(cat => (
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

        <div className={styles.mainContent}>
          
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

          <div className={styles.gridHeader}>
            <div>Livro</div>
            <div>Estoque Atual</div>
            <div>Status</div>
          </div>

          <div className={styles.stockList}>
            {loading ? <p style={{padding: 20}}>Carregando estoque...</p> : (
                <>
                {currentItems.length > 0 ? (
                currentItems.map(item => {
                    const status = getItemStatus(item);
                    
                    return (
                    <div key={item.id} className={styles.stockCard}>
                        
                        <div className={styles.bookInfo}>
                            <input type="checkbox" className={styles.checkbox} />
                            
                            {/* Revertido para o padrão sem imagem */}
                            <div className={styles.bookCover}></div>

                            <div className={styles.bookDetails}>
                                <h3>{item.title}</h3>
                                <p><strong>Autor(a):</strong> {item.author}</p>
                            </div>
                        </div>

                        <div className={styles.stockControl}>
                            <button className={styles.qtyBtn} onClick={() => handleStockChange(item.id, -1)}>-</button>
                            <span className={styles.qtyValue}>{item.totalStock}</span>
                            <button className={styles.qtyBtn} onClick={() => handleStockChange(item.id, 1)}>+</button>
                        </div>

                        <div className={`${styles.statusBadge} ${status.style}`}>
                            {status.label}
                        </div>

                    </div>
                    );
                })
                ) : (
                <div className={styles.noResults}>Nenhum livro encontrado nesta categoria.</div>
                )}
                
                {/* Controles de Paginação */}
                {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '30px', paddingBottom: '20px' }}>
                        <button 
                            onClick={() => setCurrentPage(p => p - 1)} 
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
                            onClick={() => setCurrentPage(p => p + 1)} 
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
    </div>
  );
};

export default Estoque;