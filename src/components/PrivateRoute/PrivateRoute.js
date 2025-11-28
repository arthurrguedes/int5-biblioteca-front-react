import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { isLoggedIn, user, loading } = useAuth();

  // verificação de autenticação
  if (!isLoggedIn) {
    // Se não estiver logado, redireciona para o login
    return <Navigate to="/login" replace />;
  }

  // Verificação de permissão para Admin
  if (adminOnly && user?.role !== 'admin') {
    // Se a rota for só para admin e o usuário não for admin, manda para a home
    alert("Acesso negado: Área restrita para administradores.");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;