import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// 'allowedProfiles' é um array, ex: ['usuario'] ou ['bibliotecario', 'admin']
const ProtectedRoute = ({ element: Element, allowedProfiles, ...rest }) => {
  const { user, loading } = useAuth();

  // Enquanto verifica o localStorage
  if (loading) {
    return <div>Carregando...</div>; 
  }

  // Usuário não logado, redireciona para Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Usuário logado, mas perfil não permitido (Se allowedProfiles for passado)
  if (allowedProfiles && !allowedProfiles.includes(user.perfil)) {
    // Redireciona para uma página de "Acesso Negado" ou para a Home
    return <Navigate to="/" replace />; 
  }

  // Usuário logado e perfil permitido, renderiza o componente
  return <Element {...rest} />;
};

export default ProtectedRoute;