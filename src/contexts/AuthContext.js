import React, { createContext, useState, useContext, useCallback } from 'react';

// 1. Cria o Contexto
const AuthContext = createContext(null);

// Dados de teste (simulando backend)
const ADMIN_CREDENTIALS = { user: 'admin', password: 'admin123' };

// 2. Provedor de Contexto
export const AuthProvider = ({ children }) => {
  // Estado para armazenar o token (simulado) e a role
  const [user, setUser] = useState(null); // { username: string, role: 'user' | 'admin' }
  const [token, setToken] = useState(null); // String simulada do JWT

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
      // Para usuários comuns, qualquer cadastro/login é aceito por enquanto
      if (!email || !password) {
        return { success: false, message: 'Preencha todos os campos.' };
      }
      role = 'user';
    }

    setUser({ username, role });
    setToken(simulatedToken);
    console.log(`Login successful as ${role}. Token: ${simulatedToken}`);
    return { success: true, role };

  }, []);

  // Simula a lógica de cadastro (por enquanto, apenas loga como 'user')
  const register = useCallback((username, email, password) => {
      // Simula um JWT token para o novo usuário
      const simulatedToken = `fake-jwt-${username}-user-token`;
      
      setUser({ username, role: 'user' });
      setToken(simulatedToken);
      console.log(`Registration successful as user. Token: ${simulatedToken}`);
      return { success: true, role: 'user' };
  }, []);


  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
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