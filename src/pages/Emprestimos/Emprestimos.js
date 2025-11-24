import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Emprestimos.module.css';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { FaChevronDown } from 'react-icons/fa';
import Button from '../../components/Button/Button'; 
import { emprestimosService } from '../../services/emprestimosService';
import { toast } from 'react-toastify';

// Filtros de Tempo
const TIME_FILTERS = [
  { label: 'Últimos 6 Meses', months: 6 },
  { label: '1 Ano', months: 12 },
  { label: '2 Anos', months: 24 },
  { label: '3 Anos', months: 36 },
  { label: 'Todos', months: 9999 }
];

const Emprestimos = () => {
  const [loans, setLoans] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const [statusFilter, setStatusFilter] = useState('vigente'); 
  const [timeFilter, setTimeFilter] = useState(TIME_FILTERS[0]); 
  
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);

  const navigate = useNavigate();

  // --- BUSCAR DADOS REAIS E ADAPTAR ---
  useEffect(() => {
    const fetchLoans = async () => {
      setLoading(true);
      try {
        const data = await emprestimosService.getMyEmprestimos();
        
        // Mapeamento: Backend -> Frontend
        const adaptedLoans = data.map(item => ({
            id: item.idEmprestimo, // Backend: idEmprestimo
            title: item.titulo || 'Título indisponível',
            year: item.editora ? `Ed. ${item.editora}` : '', // Usando editora
            
            // Backend envia datas ISO (2023-11-25T...). Convertemos para string legível.
            startDate: new Date(item.dataEmprestimo).toLocaleDateString('pt-BR'),
            endDate: new Date(item.dataDevolucaoPrevista).toLocaleDateString('pt-BR'),
            
            // Normaliza status para minúsculo para bater com seus filtros ('Ativo' -> 'vigente')
            status: (item.statusEmprestimo === 'Ativo' || item.statusEmprestimo === 'Atrasado') ? 'vigente' : 'devolvido',
            
            statusReal: item.statusEmprestimo, // Guardamos o status original para exibição se quiser
            
            // Para filtros de data
            returnDateRaw: item.dataDevolucaoReal ? new Date(item.dataDevolucaoReal) : null 
        }));
        
        setLoans(adaptedLoans);
      } catch (error) {
        toast.error("Erro ao carregar empréstimos.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, []);

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Meus Livros', path: '#' },
    { label: 'Empréstimos', path: '/emprestimos' }
  ];

  const filteredLoans = useMemo(() => {
    return loans.filter(loan => {
      if (loan.status !== statusFilter) return false;

      if (statusFilter === 'devolvido') {
        const cutoffDate = new Date();
        cutoffDate.setMonth(cutoffDate.getMonth() - timeFilter.months);
        const checkDate = loan.returnDateRaw || new Date(); 
        return checkDate >= cutoffDate;
      }
      return true;
    });
  }, [statusFilter, timeFilter, loans]);

  const goToReservas = () => {
    navigate('/catalogo'); 
  };

  return (
    <div className={styles.container}>
      <Breadcrumb items={breadcrumbItems} />
      
      <h1 className={styles.pageTitle}>Meus empréstimos</h1>

      <div className={styles.filtersContainer}>
        {/* Dropdown Status */}
        <div className={styles.dropdownWrapper}>
          <button 
            className={styles.dropdownButton} 
            onClick={() => { setShowStatusDropdown(!showStatusDropdown); setShowTimeDropdown(false); }}
          >
            {statusFilter === 'vigente' ? 'Vigentes' : 'Devolvidos'}
            <FaChevronDown className={styles.dropdownIcon} />
          </button>
          {showStatusDropdown && (
            <ul className={styles.dropdownMenu}>
              <li className={styles.dropdownItem} onClick={() => { setStatusFilter('vigente'); setShowStatusDropdown(false); }}>
                Vigentes
              </li>
              <li className={styles.dropdownItem} onClick={() => { setStatusFilter('devolvido'); setShowStatusDropdown(false); }}>
                Devolvidos
              </li>
            </ul>
          )}
        </div>

        {/* Dropdown Tempo (Apenas se devolvido) */}
        {statusFilter === 'devolvido' && (
            <div className={styles.dropdownWrapper}>
            <button 
                className={styles.dropdownButton}
                onClick={() => { setShowTimeDropdown(!showTimeDropdown); setShowStatusDropdown(false); }}
            >
                {timeFilter.label}
                <FaChevronDown className={styles.dropdownIcon} />
            </button>
            {showTimeDropdown && (
                <ul className={styles.dropdownMenu}>
                {TIME_FILTERS.map((filter, index) => (
                    <li 
                    key={index} 
                    className={styles.dropdownItem}
                    onClick={() => { setTimeFilter(filter); setShowTimeDropdown(false); }}
                    >
                    {filter.label}
                    </li>
                ))}
                </ul>
            )}
            </div>
        )}
      </div>

      <div className={styles.loansGrid}>
        {loading ? (
            <p style={{padding: '20px', color: '#666'}}>Carregando seus empréstimos...</p>
        ) : filteredLoans.length > 0 ? (
          filteredLoans.map(loan => (
            <div key={loan.id} className={styles.loanCardWrapper}>
              <div className={styles.cardBody}>
                {/* Placeholder da Capa */}
                <div className={styles.bookPlaceholder}>
                    <span style={{fontSize:'2rem', color:'#fff'}}>📖</span>
                </div>
                
                <div className={styles.infoBox}>
                  <div>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Retirada:</span>
                      <span className={styles.infoValue}>{loan.startDate}</span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>
                        {loan.status === 'vigente' ? 'Devolução Prevista:' : 'Devolvido em:'}
                      </span>
                      <span className={styles.infoValue} style={{
                          color: (loan.status === 'vigente' && new Date() > new Date(loan.endDate.split('/').reverse().join('-'))) ? 'red' : 'inherit'
                      }}>
                          {loan.endDate}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className={styles.statusRow}>
                      <span className={styles.infoLabel}>Situação:</span>
                      <span className={`${styles.statusText} ${loan.statusReal === 'Atrasado' ? styles.textDanger : ''}`}>
                          {loan.statusReal || loan.status}
                      </span>
                    </div>

                    {loan.status === 'vigente' ? (
                      <Button 
                        variant="danger" 
                        size="small"
                        onClick={() => toast.info("Para renovar, compareça à biblioteca.")}
                        style={{ marginTop: 'auto', width: '100%' }}
                      >
                        Renovar
                      </Button>
                    ) : (
                      <Button 
                        variant="warning" 
                        size="small"
                        onClick={() => goToReservas()}
                        style={{ marginTop: 'auto', width: '100%' }}
                      >
                        Reservar Novamente
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.bookTitle}>{loan.title}</div>
              <div className={styles.bookYear}>{loan.year}</div>
            </div>
          ))
        ) : (
          <div className={styles.noResults}>
            Nenhum empréstimo encontrado para este filtro.
          </div>
        )}
      </div>
    </div>
  );
};

export default Emprestimos;