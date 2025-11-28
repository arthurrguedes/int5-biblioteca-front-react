import React, { useState, useMemo, useEffect } from 'react';
import styles from './Estoque.module.css';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { bookService } from '../../services/bookService';

const Estoque = () => {
  const [categories, setCategories] = useState(['Todos os Livros']);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos os Livros');

  // Carrega dados
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [booksData, genresData] = await Promise.all([
          bookService.getAllBooks(),
          bookService.getGenres()
        ]);

        // Adiciona campos de segurança caso o backend não mande rented/reserved ainda
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

  // Atualizar o estoque no backend e no state
  const handleStockChange = async (id, delta) => {
    // Encontra o item atual para calcular o novo valor
    const currentItem = inventory.find(item => item.id === id);
    if (!currentItem) return;

    const newTotal = Math.max(0, currentItem.totalStock + delta);

    // Validação lógica do front-end
    if (newTotal < (currentItem.rented + currentItem.reserved)) {
      toast.error("Não é possível reduzir o estoque físico abaixo da quantidade em uso.");
      return;
    }

    // Chama a API
    const success = await bookService.updateStock(id, newTotal);

    // Se sucesso, atualiza o visual
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

        {/* Conteúdo principal */}
        <div className={styles.mainContent}>
          
          {/* Header da seção */}
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
            {loading ? <p style={{padding: 20}}>Carregando estoque...</p> : (
                filteredItems.length > 0 ? (
                filteredItems.map(item => {
                    const status = getItemStatus(item);
                    
                    return (
                    <div key={item.id} className={styles.stockCard}>
                        
                        {/*Checkbox + Info */}
                        <div className={styles.bookInfo}>
                        <input type="checkbox" className={styles.checkbox} />
                        <div className={styles.bookCover}></div>
                        <div className={styles.bookDetails}>
                            <h3>{item.title}</h3>
                            <p><strong>Autor(a):</strong> {item.author}</p>
                        </div>
                        </div>

                        {/* Controle de Estoque para admin */}
                        <div className={styles.stockControl}>
                        <button className={styles.qtyBtn} onClick={() => handleStockChange(item.id, -1)}>-</button>
                        <span className={styles.qtyValue}>{item.totalStock}</span>
                        <button className={styles.qtyBtn} onClick={() => handleStockChange(item.id, 1)}>+</button>
                        </div>

                        {/* Status Texto */}
                        <div className={`${styles.statusBadge} ${status.style}`}>
                        {status.label}
                        </div>

                    </div>
                    );
                })
                ) : (
                <div className={styles.noResults}>Nenhum livro encontrado nesta categoria.</div>
                )
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Estoque;