import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import LoginScreen from './pages/LoginScreen/LoginScreen';
import RegisterScreen from './pages/RegisterScreen/RegisterScreen'; 
import './App.css'; 
import Catalogue from './pages/Catalogue/Catalogue'; 

const HEADER_HEIGHT = '50px'; 

// Componentes de Placeholder para as novas rotas (simulação)
const Placeholder = ({ title }) => <h1>{title}</h1>;
const Estoque = () => <Placeholder title="Estoque" />;
const ControleReservas = () => <Placeholder title="Controle de Reservas" />;
const ControleEmprestimos = () => <Placeholder title="Controle de Empréstimos" />;
const Relatorios = () => <Placeholder title="Relatórios" />;
const Reservas = () => <Placeholder title="Reservas" />;
const Emprestimos = () => <Placeholder title="Empréstimos" />;
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
          <Route path="/contato" element={<Placeholder title="Contato" />} />
          <Route path="/sobre-nos" element={<Placeholder title="Sobre Nós" />} />

          {/* Rota de Detalhe de Livro (Exemplo: /catalogo/livro/1) */}
          <Route path="/catalogo/livro/:id" element={<Placeholder title="Detalhe do Livro" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;