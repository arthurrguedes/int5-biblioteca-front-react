import React, { useState, useMemo } from 'react';
import styles from './ControleEmprestimos.module.css';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { FaCheckCircle, FaSyncAlt, FaSearch } from 'react-icons/fa';

// Utilitários de data (reutilizados para coerência)
const getToday = () => new Date();
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};
const formatDate = (date) => date.toLocaleDateString('pt-BR');

// --- MOCK DATA (Coerente com a tela de 'Meus Empréstimos') ---
const INITIAL_LOANS = [
  {
    id: 1,
    user: 'Gabriel Souza', // Usuário logado
    title: 'Código Limpo',
    author: 'Robert C. Martin',
    year: 2009,
    startDate: formatDate(addDays(getToday(), -5)),
    endDateRaw: addDays(getToday(), 7), // Objeto Date para lógica
    returnDateRaw: null,
  },
  {
    id: 2,
    user: 'Gabriel Souza',
    title: 'O Hobbit',
    author: 'J.R.R. Tolkien',
    year: 1937,
    startDate: formatDate(addDays(getToday(), -10)),
    endDateRaw: addDays(getToday(), 2),
    returnDateRaw: null,
  },
  {
    id: 3,
    user: 'Lorena Oliveira',
    title: 'Gestão de recursos humanos',
    author: 'Kely César',
    year: 2018,
    startDate: formatDate(addDays(getToday(), -20)),
    endDateRaw: addDays(getToday(), -5), // Data passada = Atrasado
    returnDateRaw: null,
  },
  {
    id: 4,
    user: 'Matheus Silva',
    title: 'It: A Coisa',
    author: 'Stephen King',
    year: 1986,
    startDate: formatDate(addDays(getToday(), -30)),
    endDateRaw: addDays(getToday(), -15),
    returnDateRaw: addDays(getToday(), -14), // Devolvido (com atraso de 1 dia)
  },
  {
    id: 5,
    user: 'Gabriel Souza',
    title: 'Arquitetura Limpa',
    author: 'Robert C. Martin',
    year: 2017,
    startDate: formatDate(addDays(getToday(), -60)),
    endDateRaw: addDays(getToday(), -45),
    returnDateRaw: addDays(getToday(), -50), // Devolvido em dia
  },
  {
    id: 6,
    user: 'Ana Clara',
    title: 'Dom Quixote',
    author: 'Miguel de Cervantes',
    year: 1605,
    startDate: formatDate(addDays(getToday(), -2)),
    endDateRaw: addDays(getToday(), 12),
    returnDateRaw: null,
  }
];

const ControleEmprestimos = () => {
  const [loans, setLoans] = useState(INITIAL_LOANS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [periodFilter, setPeriodFilter] = useState('Todos');

  // Função auxiliar para determinar o status
  const getStatus = (loan) => {
    if (loan.returnDateRaw) return 'Devolvido';
    if (new Date() > loan.endDateRaw) return 'Atrasado';
    return 'Vigente';
  };

  // Ação: Renovar (Estende prazo em 7 dias)
  const handleRenew = (id) => {
    if (window.confirm('Deseja renovar este empréstimo por mais 7 dias?')) {
      setLoans(prev => prev.map(loan => {
        if (loan.id === id) {
          return { ...loan, endDateRaw: addDays(loan.endDateRaw, 7) };
        }
        return loan;
      }));
    }
  };

  // Ação: Devolver (Define data de devolução como hoje)
  const handleReturn = (id) => {
    if (window.confirm('Confirmar a devolução deste livro?')) {
      setLoans(prev => prev.map(loan => {
        if (loan.id === id) {
          return { ...loan, returnDateRaw: new Date() };
        }
        return loan;
      }));
    }
  };

  // Lógica de Filtragem
  const filteredLoans = useMemo(() => {
    return loans.filter(loan => {
      const status = getStatus(loan);
      
      // Filtro de Texto (Busca)
      const matchSearch = 
        loan.user.toLowerCase().includes(search.toLowerCase()) ||
        loan.title.toLowerCase().includes(search.toLowerCase()) ||
        loan.author.toLowerCase().includes(search.toLowerCase());

      // Filtro de Status
      const matchStatus = statusFilter === 'Todos' || status === statusFilter;

      // Filtro de Período (Simplificado para o exemplo)
      // "Último 1 ano" é apenas visual neste mock, pois todos os dados são recentes,
      // mas a lógica seria comparar loan.startDate com a data de corte.
      const matchPeriod = true; 

      return matchSearch && matchStatus && matchPeriod;
    });
  }, [loans, search, statusFilter]);

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: '(administrador)', path: '#' },
    { label: 'Controle de Empréstimos', path: '/controle-emprestimos' }
  ];

  return (
    <div className={styles.container}>
      <Breadcrumb items={breadcrumbItems} />
      
      <h1 className={styles.pageTitle}>Controle de Empréstimos</h1>

      {/* Barra de Filtros */}
      <div className={styles.filtersBar}>
        
        <div className={styles.filterGroup}>
          <label className={styles.label}>Status:</label>
          <select 
            className={styles.selectInput} 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="Todos">Todos</option>
            <option value="Vigente">Vigentes</option>
            <option value="Atrasado">Atrasados</option>
            <option value="Devolvido">Devolvidos</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.label}>Período:</label>
          <select 
            className={styles.selectInput}
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
          >
            <option value="Todos">Todos</option>
            <option value="1ano">Último 1 ano</option>
            <option value="6meses">Últimos 6 meses</option>
            <option value="30dias">Últimos 30 dias</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.label}>Campos:</label>
          <select className={styles.selectInput}>
            <option value="Todos">Todos</option>
            <option value="Titulo">Título</option>
            <option value="Autor">Autor</option>
            <option value="Usuario">Usuário</option>
          </select>
        </div>

        <div className={styles.filterGroup} style={{ flexGrow: 1 }}>
          <label className={styles.label}>Buscar:</label>
          <input 
            type="text" 
            className={styles.textInput} 
            placeholder="Digite e pressione enter ou espere..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Tabela de Dados */}
      <div className={styles.tableContainer}>
        <div className={styles.gridHeader}>
          <div>#</div>
          <div>Usuário</div>
          <div>Título</div>
          <div>Autor</div>
          <div>Ano</div>
          <div>Início</div>
          <div>Término</div>
          <div>Devolução</div>
          <div style={{ textAlign: 'center' }}>Status</div>
          <div style={{ textAlign: 'center' }}>Ações</div>
        </div>

        {filteredLoans.map((loan, index) => {
          const status = getStatus(loan);
          let statusStyle = styles.statusVigente;
          if (status === 'Atrasado') statusStyle = styles.statusAtrasado;
          if (status === 'Devolvido') statusStyle = styles.statusDevolvido;

          return (
            <div key={loan.id} className={styles.gridRow}>
              <div>{loan.id}</div>
              <div style={{ fontWeight: 'bold' }}>{loan.user}</div>
              <div title={loan.title} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {loan.title}
              </div>
              <div title={loan.author} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {loan.author}
              </div>
              <div>{loan.year}</div>
              <div>{loan.startDate}</div>
              <div>{formatDate(loan.endDateRaw)}</div>
              <div>{loan.returnDateRaw ? formatDate(loan.returnDateRaw) : '-'}</div>
              
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <span className={`${styles.statusBadge} ${statusStyle}`}>
                  {status}
                </span>
              </div>

              <div className={styles.actionButtons} style={{ justifyContent: 'center' }}>
                {status !== 'Devolvido' && (
                  <>
                    <button 
                      className={`${styles.btnIcon} ${styles.btnCheck}`} 
                      title="Registrar Devolução"
                      onClick={() => handleReturn(loan.id)}
                    >
                      <FaCheckCircle />
                    </button>
                    <button 
                      className={`${styles.btnIcon} ${styles.btnRenew}`} 
                      title="Renovar Empréstimo"
                      onClick={() => handleRenew(loan.id)}
                    >
                      <FaSyncAlt />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {filteredLoans.length === 0 && (
          <div className={styles.noResults}>Nenhum empréstimo encontrado.</div>
        )}
      </div>
    </div>
  );
};

export default ControleEmprestimos;