import React from 'react';
import { Routes, Route } from 'react-router-dom';
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

const HEADER_HEIGHT = '50px'; 

// Componentes de Placeholder para as novas rotas (simulação)
const Placeholder = ({ title }) => <h1>{title}</h1>;
const Relatorios = () => <Placeholder title="Relatórios" />;
// Você pode expandir ou criar componentes reais para estes no futuro.

function App() {
  return (
    <div className="App">
      <div className="headerWrapper">
        <Header />
      </div>
      
      <div style={{ paddingTop: HEADER_HEIGHT }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginScreen />} /> 
          <Route path="/cadastro" element={<RegisterScreen />} />

          {/* Rotas de Usuário Comum */}
          <Route path="/catalogo" element={<Catalogue />} /> {/* ROTA ATUALIZADA */}
          <Route path="/reservas" element={<Reservas />} />
          <Route path="/emprestimos" element={<Emprestimos />} />
          
          {/* Rotas de Bibliotecário (Admin) */}
          <Route path="/estoque" element={<Estoque />} />
          <Route path="/controle-reservas" element={<ControleReservas />} />
          <Route path="/controle-emprestimos" element={<ControleEmprestimos />} />
          <Route path="/relatorios" element={<Relatorios />} />
          
          {/* Rotas Comuns */}
          <Route path="/contato" element={<Contato />} />
          <Route path="/sobre-nos" element={<SobreNos />} />
          <Route path="/perfil" element={<Perfil />} />
          

          {/* Rota de Detalhe de Livro (Exemplo: /catalogo/livro/1) */}
          <Route path="/catalogo/livro/:id" element={<BookDetails />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;