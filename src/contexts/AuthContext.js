import React, { createContext, useState, useContext, useCallback } from 'react';

const AuthContext = createContext(null);

// URL do API Gateway
const API_URL = 'http://localhost:3001';

const STORAGE_KEY_USER = '@BibliotecaPlus:user';
const STORAGE_KEY_TOKEN = '@BibliotecaPlus:token';

const safeParseJson = async (response) => {
  try {
    return await response.json();
  } catch (err) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY_USER);
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_TOKEN);
  });

  // Login
  const login = useCallback(async (identifier, password, isLibrarian) => {
    try {
      // Se for bibliotecário, chama /bibliotecarios/login, senão /users/login
      const endpoint = isLibrarian ? '/bibliotecarios/login' : '/users/login';
      
      const body = isLibrarian 
        ? { login: identifier, senha: password }  // supondo que backend espera { login, senha }
        : { email: identifier, senha: password };

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await safeParseJson(response);

      if (!response.ok) {
        return { success: false, message: data?.message || 'Erro ao fazer login' };
      }

      // Mapeia os campos do backend para o front
      const userData = {
        id: data.user?.id ?? data.user?.usuario_id,
        username: data.user?.nome ?? data.user?.usuario_nome,
        email: (data.user?.email ?? data.user?.usuario_email) || null,
        role: data.user?.role || (isLibrarian ? 'admin' : 'usuario')
      };

      const realToken = data.token || null;

      setUser(userData);
      // Salva o token retornado pelo backend
      setToken(realToken);
      
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userData));
      if (realToken) localStorage.setItem(STORAGE_KEY_TOKEN, realToken);

      return { success: true };

    } catch (error) {
      console.error("Erro de conexão:", error);
      return { success: false, message: 'Erro de conexão com o servidor.' };
    }
  }, []);

  // Cadastro de usuários comuns
  // combina com seu RegisterScreen: (username, email, password, dob, phone, address)
  const register = useCallback(async (nome, email, password, dataNascimento, phone, address) => {
    try {
      // Normalizações mínimas
      const normalizedPhone = phone ? String(phone).replace(/[^\d]/g, '') : null;
      const payload = {
        nome: nome && nome.trim(),
        email: email && email.trim().toLowerCase(),
        senha: password,
        dataNascimento: dataNascimento || null, // input type=date costuma retornar YYYY-MM-DD
        telefone: normalizedPhone,
        endereco: address && address.trim()
      };

      // console.log('Enviando payload /users/register ->', payload);

      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await safeParseJson(response);

      if (!response.ok) {
        return { success: false, message: data?.message || data?.error || 'Erro ao cadastrar' };
      }
      
      return { success: true, data };

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

  // Atualizar
  const updateProfile = useCallback(async (dados) => {
    if (!user?.id) {
        return { success: false, message: "Usuário não identificado." };
    }

    try {
      const headers = {
        'Authorization': `Bearer ${token}` // Envia o token salvo
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

      const data = await safeParseJson(response);
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
             logout(); 
             return { success: false, message: "Sessão expirada. Faça login novamente." };
        }
        return { success: false, message: data?.message || 'Erro ao atualizar' };
      }

      // Atualiza o estado local com os dados retornados do backend
      const userAtualizado = { 
        ...user, 
        username: data?.user?.nome || data?.user?.usuario_nome || user.username,
        email: data?.user?.email || data?.user?.usuario_email || user.email,
        telefone: data?.user?.telefone || user.telefone,
        endereco: data?.user?.endereco || user.endereco,
        foto: data?.user?.foto || user.foto
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
