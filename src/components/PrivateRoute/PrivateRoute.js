import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { isLoggedIn, user, loading } = useAuth();

  // Se estiver carregando o estado do usuário (opcional, mas boa prática), 
  // pode retornar null ou um spinner aqui.
  // if (loading) return null; 

  // 1. Verificação de Autenticação
  if (!isLoggedIn) {
    // Se não estiver logado, manda para o login
    return <Navigate to="/login" replace />;
  }

  // 2. Verificação de Permissão de Admin (Opcional)
  if (adminOnly && user?.role !== 'admin') {
    // Se a rota for só para admin e o usuário não for admin, manda para a Home
    alert("Acesso negado: Área restrita para administradores.");
    return <Navigate to="/" replace />;
  }

  // Se passou pelas verificações, renderiza a página (o 'filho' deste componente)
  return children;
};

export default PrivateRoute;