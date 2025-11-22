import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import LoginScreen from './pages/LoginScreen/LoginScreen';
import RegisterScreen from './pages/RegisterScreen/RegisterScreen'; 
import './App.css'; 
import Catalogue from './pages/Catalogue/Catalogue';
import Reservas from './pages/Reservas/Reservas';
import Emprestimos from './pages/Emprestimos/Emprestimos';
import Contato from './pages/Contato/Contato';
import SobreNos from './pages/SobreNos/SobreNos';
import Perfil from './pages/Perfil/Perfil';
import Estoque from './pages/Estoque/Estoque';
import ControleReservas from './pages/ControleReservas/ControleReservas';
import ControleEmprestimos from './pages/ControleEmprestimos/ControleEmprestimos';
import BookDetails from './pages/BookDetails/BookDetails';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';

const HEADER_HEIGHT = '50px'; 

// Componente de Placeholder para Relatórios (ainda não criado)
const Relatorios = () => <div style={{padding: 20}}><h1>Relatórios</h1></div>;

function App() {
  return (
    <div className="App">
      <div className="headerWrapper">
        <Header />
      </div>
      
      <div style={{ paddingTop: HEADER_HEIGHT }}>
        <Routes>
          {/* --- Rotas Públicas (Qualquer um acessa) --- */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginScreen />} /> 
          <Route path="/cadastro" element={<RegisterScreen />} />
          <Route path="/catalogo" element={<Catalogue />} />
          <Route path="/catalogo/livro/:id" element={<BookDetails />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/sobre-nos" element={<SobreNos />} />

          {/* --- Rotas Protegidas (Requer Login) --- */}
          <Route 
            path="/reservas" 
            element={
              <PrivateRoute>
                <Reservas />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/emprestimos" 
            element={
              <PrivateRoute>
                <Emprestimos />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/perfil" 
            element={
              <PrivateRoute>
                <Perfil />
              </PrivateRoute>
            } 
          />
          
          {/* --- Rotas de Administrador (Requer Login + Role 'admin') --- */}
          <Route 
            path="/estoque" 
            element={
              <PrivateRoute adminOnly={true}>
                <Estoque />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/controle-reservas" 
            element={
              <PrivateRoute adminOnly={true}>
                <ControleReservas />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/controle-emprestimos" 
            element={
              <PrivateRoute adminOnly={true}>
                <ControleEmprestimos />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/relatorios" 
            element={
              <PrivateRoute adminOnly={true}>
                <Relatorios />
              </PrivateRoute>
            } 
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;