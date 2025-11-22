import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Importar useNavigate
import styles from './Emprestimos.module.css';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { FaChevronDown } from 'react-icons/fa';

// --- Utilitários para gerar datas dinâmicas ---
const getFutureDate = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString('pt-BR');
};

const getPastDate = (months) => {
  const d = new Date();
  d.setMonth(d.getMonth() - months);
  return d; 
};

const formatDateObj = (date) => date.toLocaleDateString('pt-BR');

// --- MOCK DATA ---
const MOCK_LOANS = [
  // VIGENTES (Datas Futuras)
  {
    id: 1,
    title: 'Código Limpo',
    year: 2009,
    startDate: getFutureDate(-5),
    endDate: getFutureDate(7), 
    status: 'vigente',
    returnDateRaw: null 
  },
  {
    id: 2,
    title: 'O Hobbit',
    year: 1937,
    startDate: getFutureDate(-10),
    endDate: getFutureDate(2), 
    status: 'vigente',
    returnDateRaw: null
  },
  
  // DEVOLVIDOS (Datas Passadas)
  {
    id: 3,
    title: 'Arquitetura Limpa',
    year: 2017,
    startDate: formatDateObj(getPastDate(2)),
    endDate: formatDateObj(getPastDate(1)),
    status: 'devolvido',
    returnDateRaw: getPastDate(1) 
  },
  {
    id: 4,
    title: 'Domain-Driven Design',
    year: 2003,
    startDate: formatDateObj(getPastDate(5)),
    endDate: formatDateObj(getPastDate(4)),
    status: 'devolvido',
    returnDateRaw: getPastDate(4) 
  },
  {
    id: 5,
    title: 'Harry Potter e a Pedra Filosofal',
    year: 1997,
    startDate: formatDateObj(getPastDate(8)),
    endDate: formatDateObj(getPastDate(7)),
    status: 'devolvido',
    returnDateRaw: getPastDate(7) 
  },
  {
    id: 6,
    title: 'O Senhor dos Anéis',
    year: 1954,
    startDate: formatDateObj(getPastDate(18)),
    endDate: formatDateObj(getPastDate(17)),
    status: 'devolvido',
    returnDateRaw: getPastDate(17) 
  },
  {
    id: 7,
    title: 'Dom Quixote',
    year: 1605,
    startDate: formatDateObj(getPastDate(40)),
    endDate: formatDateObj(getPastDate(39)),
    status: 'devolvido',
    returnDateRaw: getPastDate(39) 
  }
];

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
  const [statusFilter, setStatusFilter] = useState('vigente'); 
  const [timeFilter, setTimeFilter] = useState(TIME_FILTERS[0]); 
  
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);

  const navigate = useNavigate(); // 2. Hook de navegação

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: '(usuário)', path: '#' },
    { label: 'Empréstimos', path: '/emprestimos' }
  ];

  const filteredLoans = useMemo(() => {
    return MOCK_LOANS.filter(loan => {
      if (loan.status !== statusFilter) return false;

      if (statusFilter === 'devolvido') {
        const cutoffDate = new Date();
        cutoffDate.setMonth(cutoffDate.getMonth() - timeFilter.months);
        return loan.returnDateRaw >= cutoffDate;
      }
      return true;
    });
  }, [statusFilter, timeFilter]);

  // 3. Atualizar funções de ação para redirecionar
  const goToReservas = (bookTitle) => {
    // Redireciona para /reservas passando o título no estado
    navigate('/reservas', { state: { selectedBookTitle: bookTitle } });
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
        {filteredLoans.length > 0 ? (
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

                    {/* 4. Botões chamando a função de redirecionamento */}
                    {loan.status === 'vigente' ? (
                      <button 
                        className={`${styles.actionBtn} ${styles.btnRenew}`}
                        onClick={() => goToReservas(loan.title)}
                      >
                        Renovar
                      </button>
                    ) : (
                      <button 
                        className={`${styles.actionBtn} ${styles.btnReserve}`}
                        onClick={() => goToReservas(loan.title)}
                      >
                        Reserve novamente
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.bookTitle}>{loan.title}</div>
              <div className={styles.bookYear}>Ano: {loan.year}</div>
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