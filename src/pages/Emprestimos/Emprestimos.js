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
  { label: '4 Anos', months: 48 },
  { label: '5 Anos', months: 60 },
  { label: 'Todos', months: 9999 }
];

const Emprestimos = () => {
  // Estados
  const [loans, setLoans] = useState([]); // Dados reais da API
  const [loading, setLoading] = useState(true);
  
  const [statusFilter, setStatusFilter] = useState('vigente'); 
  const [timeFilter, setTimeFilter] = useState(TIME_FILTERS[0]); 
  
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);

  const navigate = useNavigate();

  // --- BUSCAR DADOS REAIS ---
  useEffect(() => {
    const fetchLoans = async () => {
      setLoading(true);
      try {
        const data = await emprestimosService.getMyEmprestimos();
        // Adaptar dados da API para o formato interno da tela, se necessário
        // O service já retorna: { id, bookTitle, dateStart, dateDue, status, ... }
        // Precisamos mapear para o que o seu layout usa (title, year, startDate...)
        const adaptedLoans = data.map(item => ({
            id: item.id,
            title: item.bookTitle || 'Título indisponível',
            year: item.bookEditora ? `Ed. ${item.bookEditora}` : '---', // Usando editora como info extra já que ano pode não vir
            startDate: new Date(item.dateStart).toLocaleDateString('pt-BR'),
            endDate: new Date(item.dateDue).toLocaleDateString('pt-BR'),
            status: item.status === 'Vigente' ? 'vigente' : 'devolvido', // Normalizando status
            returnDateRaw: item.status === 'Concluído' ? new Date(item.dateDue) : null // Ajuste conforme lógica de filtro
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
    { label: '(usuário)', path: '#' },
    { label: 'Empréstimos', path: '/emprestimos' }
  ];

  // Lógica de Filtragem (Mantida do seu código original)
  const filteredLoans = useMemo(() => {
    return loans.filter(loan => {
      if (loan.status !== statusFilter) return false;

      if (statusFilter === 'devolvido') {
        const cutoffDate = new Date();
        cutoffDate.setMonth(cutoffDate.getMonth() - timeFilter.months);
        // Se não tiver data real de devolução, usa a data de criação como fallback para não sumir
        const checkDate = loan.returnDateRaw || new Date(); 
        return checkDate >= cutoffDate;
      }
      return true;
    });
  }, [statusFilter, timeFilter, loans]);

  const goToReservas = (bookTitle) => {
    // Redireciona para o Catálogo buscando pelo título, para reservar de novo
    // (Como a rota /reservas agora é "Minhas Reservas", o ideal é mandar pro catálogo)
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

        {/* Dropdown Tempo */}
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
      </div>

      <div className={styles.loansGrid}>
        {loading ? (
            <p style={{padding: '20px'}}>Carregando...</p>
        ) : filteredLoans.length > 0 ? (
          filteredLoans.map(loan => (
            <div key={loan.id} className={styles.loanCardWrapper}>
              <div className={styles.cardBody}>
                <div className={styles.bookPlaceholder}></div>
                <div className={styles.infoBox}>
                  <div>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Data de início:</span>
                      <span className={styles.infoValue}>{loan.startDate}</span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>
                        {loan.status === 'vigente' ? 'Data de término:' : 'Data de devolução:'}
                      </span>
                      <span className={styles.infoValue}>{loan.endDate}</span>
                    </div>
                  </div>

                  <div>
                    <div className={styles.statusRow}>
                      <span className={styles.infoLabel}>Status:</span>
                      <span className={styles.statusText}>{loan.status}</span>
                    </div>

                    {/* Botões */}
                    {loan.status === 'vigente' ? (
                      <Button 
                        variant="danger" 
                        size="small"
                        // Lógica de renovação futura
                        onClick={() => toast.info("Renovação solicitada (funcionalidade futura)")}
                        style={{ marginTop: 'auto' }}
                      >
                        Renovar
                      </Button>
                    ) : (
                      <Button 
                        variant="warning" 
                        size="small"
                        onClick={() => goToReservas(loan.title)}
                        style={{ marginTop: 'auto' }}
                      >
                        Reserve novamente
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.bookTitle}>{loan.title}</div>
              {/* Exibindo editora ou ano se disponível */}
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