import React, { useState } from 'react';
import styles from './ControleReservas.module.css';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import Button from '../../components/Button/Button';

const INITIAL_RESERVATIONS = [
  { id: 101, user: 'Lorena Oliveira de Souza', bookTitle: 'Gestão de recursos humanos: teorias e reflexões', author: 'Kely César Martins de Paiva', quantity: 1, requestDate: '19/09/2025 - 20:00', classification: '5º', status: 'Aguardando na Fila' },
  { id: 102, user: 'Lorena Oliveira de Souza', bookTitle: 'Gestão de recursos humanos: teorias e reflexões', author: 'Kely César Martins de Paiva', quantity: 1, requestDate: '19/09/2025 - 20:00', classification: '0º', status: 'Pendente' },
  { id: 103, user: 'Gabriel Souza', bookTitle: 'Código Limpo', author: 'Robert C. Martin', quantity: 1, requestDate: '20/09/2025 - 10:15', classification: 'X', status: 'Reserva cancelada' },
  { id: 104, user: 'Lorena Oliveira de Souza', bookTitle: 'O Senhor dos Anéis', author: 'J.R.R. Tolkien', quantity: 1, requestDate: '19/09/2025 - 20:00', classification: '5º', status: 'Aguardando na Fila' },
  { id: 105, user: 'Lorena Oliveira de Souza', bookTitle: 'Gestão de recursos humanos: teorias e reflexões', author: 'Kely César Martins de Paiva', quantity: 1, requestDate: '19/09/2025 - 20:00', classification: '0º', status: 'Pendente' },
  { id: 106, user: 'Lorena Oliveira de Souza', bookTitle: 'Gestão de recursos humanos: teorias e reflexões', author: 'Kely César Martins de Paiva', quantity: 1, requestDate: '19/09/2025 - 20:00', classification: 'X', status: 'Reserva cancelada' }
];

const ControleReservas = () => {
  const [reservations, setReservations] = useState(INITIAL_RESERVATIONS);
  const [selectedId, setSelectedId] = useState(null);

  const selectedReservation = reservations.find(r => r.id === selectedId);

  const handleAuthorize = () => {
    if (!selectedId) return;
    setReservations(prev => prev.map(item => {
      if (item.id === selectedId) return { ...item, status: 'Aprovada', classification: '-' };
      return item;
    }));
    alert('Reserva autorizada com sucesso!');
  };

  const handleCancel = () => {
    if (!selectedId) return;
    setReservations(prev => prev.map(item => {
      if (item.id === selectedId) return { ...item, status: 'Reserva cancelada', classification: 'X' };
      return item;
    }));
    alert('Reserva cancelada.');
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pendente': return styles.statusPending;
      case 'Aguardando na Fila': return styles.statusQueue;
      case 'Reserva cancelada': return styles.statusCancelled;
      case 'Aprovada': return styles.statusApproved;
      default: return '';
    }
  };

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: '(administrador)', path: '#' },
    { label: 'Controle de Reserva', path: '/controle-reservas' }
  ];

  return (
    <div className={styles.container}>
      <Breadcrumb items={breadcrumbItems} />
      <h1 className={styles.pageTitle}>Controle de Reservas</h1>

      <div className={styles.contentLayout}>
        <div className={styles.leftColumn}>
          <div className={styles.tableHeader}>
            <div>Usuário</div>
            <div>Livro</div>
            <div>Autor (a)</div>
            <div>Qtd</div>
            <div>Data da Solicitação</div>
            <div>Classif.</div>
            <div style={{textAlign: 'right'}}>Situação</div>
          </div>

          <div className={styles.listContainer}>
            {reservations.map(res => (
              <div 
                key={res.id} 
                className={`${styles.reservationCard} ${selectedId === res.id ? styles.selected : ''}`}
                onClick={() => setSelectedId(res.id)}
              >
                <div title={res.user} className={styles.bookTitle}>{res.user.split(' ')[0]}...</div>
                <div className={styles.bookTitle} title={res.bookTitle}>{res.bookTitle}</div>
                <div title={res.author}>{res.author.split(' ')[0]}...</div>
                <div style={{textAlign: 'center'}}>{res.quantity}</div>
                <div>{res.requestDate}</div>
                <div style={{textAlign: 'center'}}>{res.classification}</div>
                <div className={`${styles.statusText} ${getStatusClass(res.status)}`}>
                  {res.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.rightColumn}>
          <h3 className={styles.sidebarTitle}>Aprovação da reserva</h3>
          
          {selectedReservation ? (
            <div className={styles.approvalCard}>
              <div className={styles.cardHeader}>Aprovação da Reserva</div>
              
              <div className={styles.cardContent}>
                <div className={styles.detailRow}>
                  <span className={styles.label}>Usuario</span>
                  <span className={styles.value}>{selectedReservation.user}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.label}>Livro</span>
                  <span className={styles.value}>{selectedReservation.bookTitle}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.label}>Quantidade</span>
                  <span className={styles.value}>{selectedReservation.quantity}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.label}>Classificação</span>
                  <span className={styles.value}>
                    {selectedReservation.classification === 'X' ? '-' : `${selectedReservation.classification} na fila`}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.label}>Situação</span>
                  <span className={`${styles.value} ${getStatusClass(selectedReservation.status)}`}>
                    {selectedReservation.status}
                  </span>
                </div>
              </div>

              <div className={styles.actions}>
                <Button 
                  variant="success" 
                  size="small"
                  onClick={handleAuthorize}
                  disabled={selectedReservation.status === 'Reserva cancelada' || selectedReservation.status === 'Aprovada'}
                >
                  Autorizar
                </Button>
                
                <Button 
                  variant="danger"
                  size="small" 
                  onClick={handleCancel}
                  disabled={selectedReservation.status === 'Reserva cancelada' || selectedReservation.status === 'Aprovada'}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className={styles.noSelection}>
              Selecione uma reserva na lista para visualizar os detalhes e realizar ações.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ControleReservas;