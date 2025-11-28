const API_URL = 'http://localhost:3001'; // Gateway

export const bookService = {
    // Listar todos os livros
    getAllBooks: async () => {
        try {
            const response = await fetch(`${API_URL}/books`);
            if (!response.ok) throw new Error('Erro ao buscar livros');
            
            const data = await response.json();
            
            // Adaptador de formato do Banco para o front
            return data.map(book => ({
                id: book.idLivro,
                title: book.titulo,
                author: book.autores || 'Autor Desconhecido',
                category: book.generos || 'Geral',
                isbn: book.isbn,
                edition: book.edicao,
                year: book.ano,
                editora: book.editora,
                totalStock: book.estoque || 0,
                language: 'Português', 
                pages: 0 
            }));
        } catch (error) {
            console.error("Erro no bookService:", error);
            return [];
        }
    },

    // Buscar um livro por ID
    getBookById: async (id) => {
        try {
            const response = await fetch(`${API_URL}/books/${id}`);
            if (!response.ok) return null;
            
            const book = await response.json();
            
            return {
                id: book.idLivro,
                title: book.titulo,
                author: book.autores || 'Autor Desconhecido',
                category: book.generos || 'Geral',
                isbn: book.isbn,
                editora: book.editora,
                edition: book.edicao,
                year: book.ano,
                totalStock: book.estoque || 0,
                language: 'Português',
                pages: 0
            };
        } catch (error) {
            console.error("Erro ao buscar livro:", error);
            return null;
        }
    },

    getGenres: async () => {
        try {
            // Chama a rota via gateway
            const response = await fetch(`${API_URL}/books/genres`);
            if (!response.ok) throw new Error('Erro ao buscar gêneros');
            
            const data = await response.json();
            // Retorna apenas os nomes para facilitar o uso nos componentes
            return data.map(g => g.nomeDoGenero);
        } catch (error) {
            console.error("Erro ao buscar gêneros:", error);
            return [];
        }
    },

    // Atualizar estoque
    updateStock: async (id, novaQuantidade) => {
        try {
            const response = await fetch(`${API_URL}/books/${id}/stock`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ novaQuantidade })
            });
            return response.ok;
        } catch (error) {
            console.error("Erro ao atualizar estoque:", error);
            return false;
        }
    }
};