// URL do Gateway
const API_URL = 'http://localhost:3001/emprestimos'; 

const getAuthHeaders = () => {
    const token = localStorage.getItem('@BibliotecaPlus:token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const emprestimosService = {
    
    // 1. Criar Empréstimo (Admin transforma Reserva em Empréstimo)
    createEmprestimo: async (idReserva) => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ idReserva })
            });
            const data = await response.json();
            
            if (response.status === 201) {
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message || 'Erro ao criar empréstimo.' };
            }
        } catch (error) {
            console.error("Erro:", error);
            return { success: false, message: 'Erro de conexão.' };
        }
    },

    // 2. Meus Empréstimos (Usuário)
    getMyEmprestimos: async () => {
        try {
            const response = await fetch(`${API_URL}/meus`, {
                method: 'GET',
                headers: getAuthHeaders()
            });
            if (!response.ok) return [];
            const data = await response.json();
            
            // Mapeamento
            return data.map(e => ({
                id: e.idEmprestimo,
                bookTitle: e.titulo,
                bookEditora: e.editora,
                dateStart: e.dataEmprestimo,
                dateDue: e.dataDevolucaoPrevista,
                status: e.statusEmprestimo
            }));
        } catch (error) {
            return [];
        }
    },

    // 3. Todos os Empréstimos (Admin)
    getAllEmprestimos: async () => {
        try {
            const response = await fetch(API_URL, { 
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) throw new Error('Falha ao buscar empréstimos');
            const data = await response.json();

            return data.map(e => ({
                id: e.idEmprestimo,
                bookTitle: e.titulo,
                userName: e.usuario_info, // Placeholder ou nome real se o back trouxer
                dateStart: e.dataEmprestimo,
                dateDue: e.dataDevolucaoPrevista,
                dateReturn: e.dataDevolucaoReal,
                status: e.statusEmprestimo
            }));
        } catch (error) {
            console.error("Erro no service:", error);
            return [];
        }
    },

    // 4. Devolver Livro (Admin)
    returnBook: async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}/devolver`, {
                method: 'PUT',
                headers: getAuthHeaders()
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    }
};