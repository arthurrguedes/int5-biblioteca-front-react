import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import styles from './Reservas.module.css';
import { reservasService } from '../../services/reservasService'; // Serviço Correto
import { toast } from 'react-toastify';

const Reservas = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  // Carrega as reservas reais do banco de dados
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await reservasService.getMyReservations();
      const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setReservations(sortedData);
      setLoading(false);
    };
    loadData();
  }, []);

  // Lógica de cancelamento real
  const handleCancel = async (id) => {
    if (window.confirm('Deseja realmente cancelar esta reserva?')) {
      const success = await reservasService.cancelReservation(id);
      if (success) {
        toast.success('Reserva cancelada com sucesso.');
        // Atualiza a lista localmente para 'cancelada' sem precisar recarregar
        setReservations(prev => prev.map(r => 
            r.id === id ? { ...r, status: 'Cancelada' } : r
        ));
      } else {
        toast.error('Erro ao cancelar reserva.');
      }
    }
  };

  // Filtragem local
  const filteredReservations = reservations.filter(res => 
    res.bookTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // formatação
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  };

  const getStatusStyle = (status) => {
      switch (status) {
          case 'Ativa': return styles.statusActive;
          case 'Concluido': return styles.statusCompleted;
          case 'Cancelada': return styles.statusCancelled;
          default: return styles.statusActive;
      }
  };

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: '(usuário)', path: '#' },
    { label: 'Minhas Reservas', path: '/reservas' }
  ];

  return (
    <div className={styles.container}>
      <Breadcrumb items={breadcrumbItems} />

      <div className={styles.contentLayout}>
        <div className={styles.columnFull}> 
          <h1 className={styles.pageTitle}>Minhas Reservas</h1>
          
          {/* Barra de busca */}
          <div className={styles.searchBar}>
            <input 
              type="text" 
              placeholder="Buscar nas minhas reservas..." 
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className={styles.searchIcon} />
          </div>

          {/* Lista de reservas */}
          <div className={styles.reservationList}>
            {loading ? (
                <p style={{textAlign: 'center', padding: '20px'}}>Carregando reservas...</p>
            ) : filteredReservations.length > 0 ? (
              filteredReservations.map(res => (
                <div key={res.id} className={styles.reservationCard}>
                  
                  <div className={styles.cardHeader}>
                    <span className={styles.bookTitle}>{res.bookTitle}</span>
                    <span className={`${styles.statusBadge} ${getStatusStyle(res.status)}`}>
                      {res.status}
                    </span>
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.infoRow}>
                        <strong>Data do Pedido:</strong> {formatDate(res.date)}
                    </div>
                    <div className={styles.infoRow}>
                        <strong>Prazo para Retirada:</strong> {formatDate(res.deadline)}
                    </div>
                    {res.bookEditora && (
                        <div className={styles.infoRow}>
                            <strong>Editora:</strong> {res.bookEditora}
                        </div>
                    )}
                  </div>

                  {/* Botão de ação apenas se estiver Ativa */}
                  {res.status === 'Ativa' && (
                    <div className={styles.cardFooter}>
                      <button 
                        className={styles.btnCancel} 
                        onClick={() => handleCancel(res.id)}
                      >
                        Cancelar Reserva
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>
                <p>Você não possui reservas no momento.</p>
                <button 
                    className={styles.btnBrowse} 
                    onClick={() => navigate('/catalogo')}
                >
                    Ir para o Catálogo
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservas;