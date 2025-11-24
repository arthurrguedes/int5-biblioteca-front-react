import React, { useState, useEffect } from 'react';
import styles from './ControleEmprestimos.module.css';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { emprestimosService } from '../../services/emprestimosService';
import { toast } from 'react-toastify';
import { FaUndo, FaSearch } from 'react-icons/fa';

const ControleEmprestimos = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const loadLoans = async () => {
        setLoading(true);
        const data = await emprestimosService.getAllEmprestimos();
        // O service já retorna o array pronto do backend
        setLoans(Array.isArray(data) ? data : []);
        setLoading(false);
    };

    useEffect(() => {
        loadLoans();
    }, []);

    const handleReturn = async (id) => {
        if (!window.confirm("Confirmar a devolução deste livro?")) return;

        const result = await emprestimosService.returnBook(id);
        if (result.success) {
            let msg = result.message;
            if (result.multa > 0) msg += ` (Multa: R$ ${result.multa})`;
            toast.success(msg);
            loadLoans(); // Recarrega para atualizar status
        } else {
            toast.error(result.message);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('pt-BR');
    };

    const filteredLoans = loans.filter(l => 
        l.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.usuario_info?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const breadcrumbItems = [
        { label: 'Admin', path: '#' },
        { label: 'Controle de Empréstimos', path: '/controle-emprestimos' }
    ];

    return (
        <div className={styles.container}>
            <Breadcrumb items={breadcrumbItems} />
            
            <div className={styles.header}>
                <h1>Controle de Empréstimos</h1>
                <div className={styles.searchBox}>
                    <FaSearch />
                    <input 
                        type="text" 
                        placeholder="Buscar por livro ou usuário..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Livro</th>
                            <th>Usuário</th>
                            <th>Retirada</th>
                            <th>Prevista</th>
                            <th>Status</th>
                            <th>Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="7" style={{textAlign:'center'}}>Carregando...</td></tr>
                        ) : filteredLoans.length > 0 ? (
                            filteredLoans.map(loan => (
                                <tr key={loan.idEmprestimo}>
                                    <td>#{loan.idEmprestimo}</td>
                                    <td>{loan.titulo}</td>
                                    <td>{loan.usuario_info}</td>
                                    <td>{formatDate(loan.dataEmprestimo)}</td>
                                    <td style={{
                                        color: (new Date() > new Date(loan.dataDevolucaoPrevista) && loan.statusEmprestimo === 'Ativo') ? 'red' : 'inherit',
                                        fontWeight: (new Date() > new Date(loan.dataDevolucaoPrevista) && loan.statusEmprestimo === 'Ativo') ? 'bold' : 'normal'
                                    }}>
                                        {formatDate(loan.dataDevolucaoPrevista)}
                                    </td>
                                    <td>
                                        <span className={`${styles.badge} ${loan.statusEmprestimo === 'Ativo' ? styles.active : styles.done}`}>
                                            {loan.statusEmprestimo}
                                        </span>
                                    </td>
                                    <td>
                                        {loan.statusEmprestimo === 'Ativo' && (
                                            <button 
                                                className={styles.btnReturn}
                                                onClick={() => handleReturn(loan.idEmprestimo)}
                                                title="Registrar Devolução"
                                            >
                                                <FaUndo /> Devolver
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="7" style={{textAlign:'center'}}>Nenhum registro encontrado.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ControleEmprestimos;