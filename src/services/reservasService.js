const API_URL = 'http://localhost:3001/reservas';

// Helper para pegar o token e montar o header
const getAuthHeaders = () => {
    const token = localStorage.getItem('@BibliotecaPlus:token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const reservasService = {
    
    // Criar Reserva (Usuário comum)
    createReservation: async (idLivro) => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ idLivro })
            });

            const data = await response.json();

            if (response.status === 201) {
                return { success: true, type: 'RESERVA', message: data.message };
            } else if (response.status === 409) {
                // 409 = Conflito (Sem estoque -> Entrou na Lista de Espera)
                return { success: true, type: 'ESPERA', message: data.message };
            } else {
                return { success: false, message: data.message || 'Erro ao reservar.' };
            }
        } catch (error) {
            console.error("Erro createReservation:", error);
            return { success: false, message: 'Erro de conexão com o servidor.' };
        }
    },

    // Minhas Reservas (Usuário comum)
    getMyReservations: async () => {
        try {
            const response = await fetch(`${API_URL}/my`, {
                method: 'GET',
                headers: getAuthHeaders()
            });
            
            if (!response.ok) throw new Error('Erro ao buscar reservas');
            const data = await response.json();
            
            // Adaptação dos dados para o formato que a tela espera
            return data.map(r => ({
                id: r.idReserva,
                bookTitle: r.titulo,
                bookEditora: r.editora, // Se o backend retornar isso no join
                date: r.dataReserva,
                deadline: r.prazoReserva,
                status: r.statusReserva
            }));
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    // Todas as Reservas (Admin / Bibliotecário)
    getAllReservations: async () => {
        try {
            const response = await fetch(API_URL, { 
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) throw new Error('Erro ao buscar todas reservas');
            const data = await response.json();

            return data.map(r => ({
                id: r.idReserva,
                userName: r.usuario_nome, 
                bookTitle: r.titulo,
                date: r.dataReserva,
                deadline: r.prazoReserva,
                status: r.statusReserva
            }));
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    // Atualizar Status (Admin)
    updateStatus: async (id, newStatus) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ statusReserva: newStatus })
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    },

    // Cancelar (User/Admin)
    cancelReservation: async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    }
};