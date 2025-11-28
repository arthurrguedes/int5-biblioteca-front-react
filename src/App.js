import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import Footer from './components/Footer/Footer';

import Relatorios from './components/ControleRelatorios/Relatorios';

import RelatorioAtrasos from './components/ControleRelatorios/RelatorioAtrasos/RelatorioAtrasos';
import RelatorioMultas from './components/ControleRelatorios/RelatorioMultas/RelatorioMultas';
import RelatorioEstoque from './components/ControleRelatorios/RelatorioEstoque/RelatorioEstoque';
import RelatorioLivros from './components/ControleRelatorios/RelatorioLivros/RelatorioLivros';
import RelatorioUsuarios from './components/ControleRelatorios/RelatorioUsuarios/RelatorioUsuarios';



const HEADER_HEIGHT = '50px'; 

// Componente de Placeholder para Relatórios (ainda não criado)
// const Relatorios = () => <div style={{padding: 20}}><h1>Relatórios</h1></div>;

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
          <Route 
            path="/relatorios/atrasos" 
            element={
              <PrivateRoute adminOnly={true}>
                <RelatorioAtrasos />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/relatorios/multas" 
            element={
              <PrivateRoute adminOnly={true}>
                <RelatorioMultas />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/relatorios/estoque" 
            element={
              <PrivateRoute adminOnly={true}>
                <RelatorioEstoque />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/relatorios/livros" 
            element={
              <PrivateRoute adminOnly={true}>
                <RelatorioLivros />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/relatorios/usuarios" 
            element={
              <PrivateRoute adminOnly={true}>
                <RelatorioUsuarios />
              </PrivateRoute>
            } 
          />
        </Routes>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
      <Footer />
    </div>
  );
}

export default App;