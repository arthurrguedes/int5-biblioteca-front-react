import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('biblioteca_token');
    const storedUser = JSON.parse(localStorage.getItem('biblioteca_user'));

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, senha, tipoPerfil) => {
  
    const mockUser = {
      id: 1,
      nome: 'Arthur',
      perfil: tipoPerfil, 
    };
    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Seu JWT

    setToken(mockToken);
    setUser(mockUser);
    localStorage.setItem('biblioteca_token', mockToken);
    localStorage.setItem('biblioteca_user', JSON.stringify(mockUser));

    navigate('/'); 
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('biblioteca_token');
    localStorage.removeItem('biblioteca_user');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};