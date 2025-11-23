import React, { useState, useEffect } from 'react';
import styles from './ControleReservas.module.css';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { reservasService } from '../../services/reservasService';
import { toast } from 'react-toastify';

const ControleReservas = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Todas');

  useEffect(() => {
    const loadAll = async () => {
        setLoading(true);
        try {
            const data = await reservasService.getAllReservations();
            if (Array.isArray(data)) {
                setReservations(data);
            } else {
                setReservations([]);
            }
        } catch (error) {
            console.error("Erro:", error);
            toast.error("Erro ao carregar reservas.");
        } finally {
            setLoading(false);
        }
    };
    loadAll();
  }, []);

  // --- LÓGICA DE CANCELAMENTO (A única ação necessária) ---
  const handleCancel = async (id) => {
      if (!window.confirm("Tem certeza que deseja cancelar esta reserva?")) return;

      const success = await reservasService.cancelReservation(id);
      
      if (success) {
          toast.success("Reserva cancelada com sucesso.");
          // Atualiza a lista visualmente para 'Cancelada'
          setReservations(prev => prev.map(r => 
              r.id === id ? { ...r, status: 'Cancelada' } : r
          ));
      } else {
          toast.error("Erro ao cancelar reserva.");
      }
  };

  const filteredReservations = reservations.filter(r => 
      filter === 'Todas' ? true : r.status === filter
  );

  const formatDateShort = (d) => {
      if (!d) return '-';
      const date = new Date(d);
      return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }).replace('.', '');
  };

  const getStatusClass = (status) => {
      switch (status) {
          case 'Ativa': return styles.statusAtiva;
          case 'Concluída': return styles.statusConcluida; // Mantive caso existam legados
          case 'Cancelada': return styles.statusCancelada;
          case 'Expirada': return styles.statusExpirada;
          default: return styles.statusAtiva;
      }
  };

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Admin', path: '#' },
    { label: 'Controle', path: '/controle-reservas' }
  ];

  return (
    <div className={styles.container}>
      <Breadcrumb items={breadcrumbItems} />
      
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Controle de Reservas</h1>
        <select 
            className={styles.filterSelect} 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
        >
            <option value="Todas">Todas as Reservas</option>
            <option value="Ativa">Ativas</option>
            <option value="Cancelada">Canceladas</option>
            <option value="Expirada">Expiradas</option>
            <option value="Concluídas">Concluídas</option>
        </select>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Livro</th>
              <th>Usuário</th>
              <th>Data / Prazo</th>
              <th>Status</th>
              <th style={{textAlign: 'right'}}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
                <tr><td colSpan="5" style={{textAlign: 'center', padding: '30px'}}>Carregando...</td></tr>
            ) : filteredReservations.length > 0 ? (
                filteredReservations.map(res => (
                <tr key={res.id}>
                    <td data-label="Livro">
                        <span className={styles.bookTitle}>{res.bookTitle}</span>
                        <span className={styles.bookAuthor}>ID: #{res.id}</span>
                    </td>

                    <td data-label="Usuário">
                        <span className={styles.userInfo}>{res.userName}</span>
                    </td>

                    <td data-label="Data">
                        <span className={styles.dateInfo}>
                            {formatDateShort(res.date)} - {formatDateShort(res.deadline)}
                        </span>
                    </td>

                    <td data-label="Status">
                        <span className={`${styles.statusBadge} ${getStatusClass(res.status)}`}>
                            <span className={styles.statusDot}></span>
                            {res.status}
                        </span>
                    </td>

                    <td data-label="Ações" style={{textAlign: 'right'}}>
                    {/* Apenas mostramos o botão se a reserva estiver ativa */}
                    {res.status === 'Ativa' ? (
                        <button 
                          className={styles.btnCancel}
                          onClick={() => handleCancel(res.id)}>Cancelar</button>
                    ) : (
                        <span style={{color: '#ccc', fontSize: '0.8rem'}}>--</span>
                    )}
                    </td>
                </tr>
                ))
            ) : (
                <tr>
                    <td colSpan="5" style={{textAlign: 'center', padding: '40px', color: '#8898aa'}}>
                        Nenhuma reserva encontrada.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ControleReservas;