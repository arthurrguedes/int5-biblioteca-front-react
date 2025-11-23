import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

// URL do API Gateway
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
      // Define o endpoint baseado no tipo de usuário
      // Se for bibliotecário, chama /bibliotecarios/login, senão /users/login
      const endpoint = isLibrarian ? '/bibliotecarios/login' : '/users/login';
      
      // O back-end espera { email, senha } para usuário ou { login, senha } para bibliotecário
      const body = isLibrarian 
        ? { login: identifier,yb: password } // Ajuste se o back esperar senha
        : { email: identifier, senha: password };

        // Users: { email, senha }
        // Bibliotecarios: { login, senha }

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            [isLibrarian ? 'login' : 'email']: identifier,
            senha: password 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || 'Erro ao fazer login' };
      }

      // Padronizando o objeto user para o front-end
      // O Front usa username, o banco devolve nome
      const userData = {
        id: data.user.id,
        username: data.user.nome, 
        email: data.user.email || null, // Bibliotecário não tem email no retorno atual
        role: data.user.role || (isLibrarian ? 'admin' : 'usuario')
      };

      setUser(userData);
      setToken('token-dummy-jwt'); // Futuramente seu back retornará um token real aqui
      
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userData));
      localStorage.setItem(STORAGE_KEY_TOKEN, 'token-dummy-jwt');

      return { success: true };

    } catch (error) {
      console.error("Erro de conexão:", error);
      return { success: false, message: 'Erro de conexão com o servidor.' };
    }
  }, []);

  // --- CADASTRO (Apenas Usuários Comuns) ---
  const register = useCallback(async (nome, email, password, dataNascimento) => {
    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          email,
          senha: password,
          dataNascimento // Formato esperado: YYYY-MM-DD
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
  }, [login]); // Dependência do login ao usar auto-login

  const updateProfile = useCallback(async (dadosParaAtualizar) => {
    // ID do user logado
    if (!user?.id) {
      return { success: false, message: "Usuário não identificado." };
    }

    try {
      const response = await fetch(`${API_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosParaAtualizar)
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || 'Erro ao atualizar' };
      }

      const userAtualizado = { 
        ...user, 
        username: data.user.nome,
        email: data.user.email
      };

      setUser(userAtualizado);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userAtualizado));

      return { success: true };

    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      return { success: false, message: 'Erro de conexão.' };
    }
  }, [user]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
  }, []);

  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);