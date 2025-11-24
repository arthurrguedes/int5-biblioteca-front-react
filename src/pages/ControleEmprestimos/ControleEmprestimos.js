import React, { useState, useEffect } from 'react';
import styles from './ControleEmprestimos.module.css'; // Pode usar o mesmo CSS de Reservas se quiser manter o padrão
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { emprestimosService } from '../../services/emprestimosService';
import { toast } from 'react-toastify';

const ControleEmprestimos = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carrega todos os empréstimos
  useEffect(() => {
    const loadAll = async () => {
        setLoading(true);
        try {
            const data = await emprestimosService.getAllLoans();
            setLoans(data);
        } catch (error) {
            toast.error("Erro ao carregar empréstimos.");
        } finally {
            setLoading(false);
        }
    };
    loadAll();
  }, []);

  // Devolver Livro
  const handleReturn = async (id) => {
      if (!window.confirm("Confirmar devolução do livro?")) return;
      
      const success = await emprestimosService.returnBook(id);
      if (success) {
          toast.success("Livro devolvido com sucesso!");
          setLoans(prev => prev.map(l => 
              l.id === id ? { ...l, status: 'Concluído' } : l
          ));
      } else {
          toast.error("Erro ao devolver.");
      }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('pt-BR') : '-';

  return (
    <div className={styles.container}>
      <Breadcrumb items={[{ label: 'Admin', path: '#' }, { label: 'Empréstimos', path: '/controle-emprestimos' }]} />
      <h1 className={styles.title}>Controle de Empréstimos</h1>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Livro</th>
              <th>Usuário</th>
              <th>Retirada</th>
              <th>Devolução Prevista</th>
              <th>Status</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="7">Carregando...</td></tr> : loans.map(loan => (
              <tr key={loan.id}>
                <td>#{loan.id}</td>
                <td><span className={styles.bookTitle}>{loan.bookTitle}</span></td>
                <td>{loan.userName}</td>
                <td>{formatDate(loan.dateStart)}</td>
                <td>{formatDate(loan.dateDue)}</td>
                <td>
                    <span style={{color: loan.status === 'Vigente' ? '#007bff' : '#28a745', fontWeight: 'bold'}}>
                        {loan.status}
                    </span>
                </td>
                <td>
                  {loan.status === 'Vigente' && (
                    <button 
                        onClick={() => handleReturn(loan.id)} 
                        className={styles.btnCheck} // Reutilize estilos de botão
                        style={{cursor: 'pointer', border: '1px solid #00c07f', background: 'white', color: '#00c07f', padding: '5px 10px', borderRadius: '5px'}}
                    >
                        Devolver
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ControleEmprestimos;