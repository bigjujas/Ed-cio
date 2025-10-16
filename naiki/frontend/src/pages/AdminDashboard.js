import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AdminDashboard = () => {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      carregarDashboard();
    }
  }, [isAdmin]);

  const carregarDashboard = async () => {
    try {
      const response = await adminAPI.dashboard();
      setStats(response.data);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return <div className="container">Acesso negado</div>;
  }

  if (loading) {
    return <div className="container">Carregando dashboard...</div>;
  }

  // Dados para gráfico de interações por tipo
  const interacoesData = {
    labels: stats?.interacoesPorTipo?.map(item => item.tipo) || [],
    datasets: [{
      label: 'Quantidade',
      data: stats?.interacoesPorTipo?.map(item => item.quantidade) || [],
      backgroundColor: ['#ff6b35', '#f7931e', '#ffb347', '#ffd700']
    }]
  };

  // Dados para gráfico de produtos mais avaliados
  const produtosData = {
    labels: stats?.produtosMaisAvaliados?.map(item => item.nome) || [],
    datasets: [{
      label: 'Total de Avaliações',
      data: stats?.produtosMaisAvaliados?.map(item => item.total_avaliacoes) || [],
      backgroundColor: '#ff6b35'
    }]
  };

  return (
    <div className="container">
      <h1>Dashboard Administrativo</h1>
      
      {/* Estatísticas Gerais */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total de Produtos</h3>
          <div className="stat-number">{stats?.totalProdutos || 0}</div>
        </div>
        
        <div className="stat-card">
          <h3>Total de Clientes</h3>
          <div className="stat-number">{stats?.totalClientes || 0}</div>
        </div>
        
        <div className="stat-card">
          <h3>Total de Interações</h3>
          <div className="stat-number">{stats?.totalInteracoes || 0}</div>
        </div>
        
        <div className="stat-card">
          <h3>Avaliações Pendentes</h3>
          <div className="stat-number">{stats?.avaliacoesPendentes || 0}</div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="dashboard-charts">
        <div className="chart-container">
          <h3>Interações por Tipo</h3>
          {stats?.interacoesPorTipo?.length > 0 ? (
            <Doughnut data={interacoesData} />
          ) : (
            <p>Nenhuma interação encontrada</p>
          )}
        </div>
        
        <div className="chart-container">
          <h3>Produtos Mais Avaliados</h3>
          {stats?.produtosMaisAvaliados?.length > 0 ? (
            <Bar 
              data={produtosData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Top 5 Produtos por Número de Avaliações'
                  }
                }
              }}
            />
          ) : (
            <p>Nenhum produto avaliado ainda</p>
          )}
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="quick-actions">
        <h3>Ações Rápidas</h3>
        <div className="actions-grid">
          <a href="/admin/produtos" className="btn btn-primary">
            Gerenciar Produtos
          </a>
          <a href="/admin/interacoes" className="btn btn-secondary">
            Ver Interações
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;