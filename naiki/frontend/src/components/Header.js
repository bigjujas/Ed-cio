import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, admin, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">NAIKI</Link>
        
        <nav>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/produtos">Produtos</Link></li>
            {isAuthenticated && (
              <li><Link to="/minhas-interacoes">Minhas Avaliações</Link></li>
            )}
            {isAdmin && (
              <>
                <li><Link to="/admin/dashboard">Dashboard</Link></li>
                <li><Link to="/admin/produtos">Produtos</Link></li>
                <li><Link to="/admin/interacoes">Interações</Link></li>
              </>
            )}
          </ul>
        </nav>

        <div className="auth-buttons">
          {isAuthenticated ? (
            <>
              <span>Olá, {user.nome}</span>
              <button onClick={handleLogout} className="btn btn-secondary">
                Sair
              </button>
            </>
          ) : isAdmin ? (
            <>
              <span>Admin: {admin.nome}</span>
              <button onClick={handleLogout} className="btn btn-secondary">
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">Login</Link>
              <Link to="/cadastro" className="btn btn-primary">Cadastrar</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;