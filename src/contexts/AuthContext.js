import React, { createContext, useState, useContext, useCallback } from 'react';

const AuthContext = createContext(null);

// URL do API Gateway (ou direto para o backend se não houver gateway)
const API_URL = 'http://localhost:3001';

const STORAGE_KEY_USER = '@BibliotecaPlus:user';
const STORAGE_KEY_TOKEN = '@BibliotecaPlus:token';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY_USER);
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_TOKEN);
  });

  // --- LOGIN ---
  const login = useCallback(async (identifier, password, isLibrarian) => {
    try {
      const endpoint = isLibrarian ? '/bibliotecarios/login' : '/users/login';
      
      const body = isLibrarian 
        ? { login: identifier, senha: password } 
        : { email: identifier, senha: password };

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || 'Erro ao fazer login' };
      }

      // Padronizando o objeto user para o front-end
      const userData = {
        id: data.user.id,
        username: data.user.nome, 
        email: data.user.email || null,
        telefone: data.user.telefone || '',
        endereco: data.user.endereco || '',
        role: data.user.role || (isLibrarian ? 'admin' : 'usuario')
      };

      const realToken = data.token;

      setUser(userData);
      setToken(realToken);
      
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userData));
      localStorage.setItem(STORAGE_KEY_TOKEN, realToken);

      return { success: true };

    } catch (error) {
      console.error("Erro de conexão:", error);
      return { success: false, message: 'Erro de conexão com o servidor.' };
    }
  }, []);

  // --- CADASTRO ---
  const register = useCallback(async (nome, email, password, dataNascimento, telefone, endereco) => {
    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          email,
          senha: password,
          dataNascimento,
          telefone,
          endereco
        })
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || 'Erro ao cadastrar' };
      }
      
      return { success: true };

    } catch (error) {
      console.error("Erro no cadastro:", error);
      return { success: false, message: 'Erro de conexão ao tentar cadastrar.' };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
  }, []);

  // --- UPDATE PROFILE ---
  const updateProfile = useCallback(async (dados) => {
    if (!user?.id) {
        return { success: false, message: "Usuário não identificado." };
    }

    try {
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      let body;

      if (dados instanceof FormData) {
        body = dados;
      } else {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(dados);
      }

      const response = await fetch(`${API_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: headers,
        body: body
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
             logout(); 
             return { success: false, message: "Sessão expirada. Faça login novamente." };
        }
        return { success: false, message: data.message || 'Erro ao atualizar' };
      }

      // Atualiza o estado local com os dados retornados do backend
      const userAtualizado = { 
        ...user, 
        username: data.user.nome || user.username,
        email: data.user.email || user.email,
        telefone: data.user.telefone || user.telefone,
        endereco: data.user.endereco || user.endereco,
        foto: data.user.foto || user.foto
      };

      setUser(userAtualizado);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userAtualizado));

      return { success: true };

    } catch (error) {
      console.error("Erro update:", error);
      return { success: false, message: 'Erro de conexão.' };
    }
  }, [user, token, logout]);

  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);