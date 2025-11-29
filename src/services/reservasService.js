const API_URL = 'http://localhost:3001/reservas';

// pega o token e monta o header
const getAuthHeaders = () => {
    const token = localStorage.getItem('@BibliotecaPlus:token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const reservasService = {
    
    // Criar reserva (usuário)
    createReservation: async (idLivro) => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ idLivro })
            });

            const data = await response.json();
            if (response.status === 201) {
                if (data.type === 'ESPERA' || data.indisponivel) {
                    // Entrou na fila (Indisponível)
                    return { success: true, type: 'ESPERA', message: data.message }; 
                } else {
                    // Reserva confirmada
                    return { success: true, type: 'RESERVA', message: data.message };
                }
            } else if (response.status === 409) {
                // Já estava na fila (Conflito)
                return { success: false, message: data.message };
            } else {
                return { success: false, message: data.message || 'Erro ao reservar.' };
            }
        } catch (error) {
            console.error("Erro createReservation:", error);
            return { success: false, message: 'Erro de conexão com o servidor.' };
        }
    },

    // Minhas reservas (usuário)
    getMyReservations: async () => {
        try {
            const response = await fetch(`${API_URL}/my`, {
                method: 'GET',
                headers: getAuthHeaders()
            });
            
            if (!response.ok) throw new Error('Erro ao buscar reservas');
            const data = await response.json();
            
            // adaptação para front-end
            return data.map(r => ({
                id: r.idReserva,
                bookTitle: r.titulo,
                bookEditora: r.editora, 
                date: r.dataReserva,
                deadline: r.prazoReserva,
                status: r.statusReserva
            }));
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    // Todas as reservas (Admin / Bibliotecário)
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

    // Atualizar status (Admin)
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

    // Cancelar (user/admin)
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