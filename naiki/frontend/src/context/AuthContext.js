import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há token salvo no localStorage
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    const adminData = localStorage.getItem('admin');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    
    if (token && adminData) {
      setAdmin(JSON.parse(adminData));
    }
    
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const loginAdmin = (token, adminData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('admin', JSON.stringify(adminData));
    setAdmin(adminData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('admin');
    setUser(null);
    setAdmin(null);
  };

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const value = {
    user,
    admin,
    login,
    loginAdmin,
    logout,
    getToken,
    loading,
    isAuthenticated: !!user,
    isAdmin: !!admin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};