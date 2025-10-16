import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import Produtos from './pages/Produtos';
import ProdutoDetalhes from './pages/ProdutoDetalhes';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import MinhasInteracoes from './pages/MinhasInteracoes';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminProdutos from './pages/AdminProdutos';
import AdminInteracoes from './pages/AdminInteracoes';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/produtos" element={<Produtos />} />
              <Route path="/produto/:id" element={<ProdutoDetalhes />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="/minhas-interacoes" element={<MinhasInteracoes />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/produtos" element={<AdminProdutos />} />
              <Route path="/admin/interacoes" element={<AdminInteracoes />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;