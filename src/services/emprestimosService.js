// URL do API Gateway
const API_URL = 'http://localhost:3001/emprestimos'; 

const getAuthHeaders = () => {
    const token = localStorage.getItem('@BibliotecaPlus:token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const emprestimosService = {
    // Admin: Cria empréstimo a partir de uma reserva
    createEmprestimo: async (idReserva) => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ idReserva })
            });
            const data = await response.json();
            if (response.ok) return { success: true, message: data.message };
            return { success: false, message: data.message || 'Erro ao criar.' };
        } catch (error) {
            return { success: false, message: 'Erro de conexão.' };
        }
    },

    // Usuário: Meus Empréstimos
    getMyEmprestimos: async () => {
        try {
            const response = await fetch(`${API_URL}/meus`, {
                method: 'GET',
                headers: getAuthHeaders()
            });
            if (!response.ok) return [];
            return await response.json();
        } catch (error) {
            console.error("Erro service:", error);
            return [];
        }
    },

    // Admin: Todos os Empréstimos
    getAllEmprestimos: async () => {
        try {
            const response = await fetch(API_URL, { 
                method: 'GET',
                headers: getAuthHeaders()
            });
            if (!response.ok) return [];
            return await response.json();
        } catch (error) {
            return [];
        }
    },

    // Admin: Devolver Livro
    returnBook: async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}/devolver`, {
                method: 'PUT',
                headers: getAuthHeaders()
            });
            const data = await response.json();
            if (response.ok) return { success: true, message: data.message, multa: data.multa };
            return { success: false, message: data.message };
        } catch (error) {
            return { success: false, message: 'Erro de conexão.' };
        }
    }
};