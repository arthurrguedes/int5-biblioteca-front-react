import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import LoginScreen from './pages/LoginScreen/LoginScreen';
import RegisterScreen from './pages/RegisterScreen/RegisterScreen';
import ProtectedRoute from './components/ProtectedRoute'; // Importar componente de proteção

// --- Simulação de Telas Restritas (Crie estes componentes) ---
const UserDashboard = () => <h1>Tela Principal do Usuário Comum</h1>;
const AdminTools = () => <h1>Tela de Administração/Bibliotecário</h1>;
// -------------------------------------------------------------

const HEADER_HEIGHT = '50px';

function App() {
  return (
    <div className="App">
      <div className="headerWrapper">
        <Header />
      </div>
      
      <div style={{ paddingTop: HEADER_HEIGHT }}>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginScreen />} /> 
          <Route path="/cadastro" element={<RegisterScreen />} />

          {/* Rotas Protegidas por Perfil */}
          
          {/* Acesso apenas para USUÁRIOS COMUNS */}
          <Route 
            path="/dashboard" 
            element={<ProtectedRoute element={UserDashboard} allowedProfiles={['usuario']} />} 
          />

          {/* Acesso apenas para BIBLIOTECÁRIOS/ADMINS */}
          <Route 
            path="/admin" 
            element={<ProtectedRoute element={AdminTools} allowedProfiles={['bibliotecario']} />} 
          />

          {/* Exemplo de Rota ABERTA a todos os logados, independente do perfil: */}
          {/* <Route 
            path="/perfil" 
            element={<ProtectedRoute element={ProfileSettings} />} 
          /> */}
          
        </Routes>
      </div>
    </div>
  );
}

export default App;