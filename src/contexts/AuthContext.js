import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';

// 1. Cria o Contexto
const AuthContext = createContext(null);

// Dados de teste (simulando backend)
const ADMIN_CREDENTIALS = { user: 'admin', password: 'admin123' };

// Chaves para o localStorage
const STORAGE_KEY_USER = '@BibliotecaPlus:user';
const STORAGE_KEY_TOKEN = '@BibliotecaPlus:token';

// 2. Provedor de Contexto
export const AuthProvider = ({ children }) => {
  // Inicializa o estado lendo do localStorage (Persistência)
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY_USER);
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_TOKEN);
  });

  // Simula a lógica de login com base em credenciais
  const login = useCallback((email, password, isLibrarian) => {
    let role = 'user';
    let username = email.split('@')[0];
    let simulatedToken = `fake-jwt-${username}-${role}-token`;

    if (isLibrarian) {
      if (email === ADMIN_CREDENTIALS.user && password === ADMIN_CREDENTIALS.password) {
        role = 'admin';
        username = ADMIN_CREDENTIALS.user;
        simulatedToken = `fake-jwt-${username}-${role}-token`;
      } else {
        return { success: false, message: 'Credenciais de Bibliotecário inválidas.' };
      }
    } else {
      if (!email || !password) {
        return { success: false, message: 'Preencha todos os campos.' };
      }
      role = 'user';
    }

    const userData = { username, role };

    // Atualiza estado
    setUser(userData);
    setToken(simulatedToken);

    // Persiste no localStorage
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userData));
    localStorage.setItem(STORAGE_KEY_TOKEN, simulatedToken);

    console.log(`Login successful as ${role}. Token: ${simulatedToken}`);
    return { success: true, role };

  }, []);

  // Simula a lógica de cadastro
  const register = useCallback((username, email, password) => {
      const simulatedToken = `fake-jwt-${username}-user-token`;
      const userData = { username, role: 'user' };
      
      setUser(userData);
      setToken(simulatedToken);

      // Persiste no localStorage
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userData));
      localStorage.setItem(STORAGE_KEY_TOKEN, simulatedToken);

      console.log(`Registration successful as user. Token: ${simulatedToken}`);
      return { success: true, role: 'user' };
  }, []);


  const logout = useCallback(() => {
    setUser(null);
    setToken(null);

    // Remove do localStorage
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TOKEN);

    console.log('Logout successful.');
  }, []);

  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Hook para usar o Contexto
export const useAuth = () => useContext(AuthContext);