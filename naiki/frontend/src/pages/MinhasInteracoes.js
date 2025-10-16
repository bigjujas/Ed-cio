import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { interacoesAPI } from '../services/api';

const MinhasInteracoes = () => {
  const { isAuthenticated } = useAuth();
  const [interacoes, setInteracoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      carregarInteracoes();
    }
  }, [isAuthenticated]);

  const carregarInteracoes = async () => {
    try {
      const response = await interacoesAPI.minhas();
      setInteracoes(response.data);
    } catch (error) {
      console.error('Erro ao carregar interações:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTipoLabel = (tipo) => {
    const tipos = {
      'avaliacao': 'Avaliação',
      'proposta': 'Proposta',
      'agendamento': 'Agendamento',
      'reserva': 'Reserva'
    };
    return tipos[tipo] || tipo;
  };

  const getStatusLabel = (status) => {
    const statuses = {
      'pendente': 'Pendente',
      'respondida': 'Respondida',
      'confirmada': 'Confirmada',
      'cancelada': 'Cancelada'
    };
    return statuses[status] || status;
  };

  const renderEstrelas = (nota) => {
    if (!nota) return null;
    const estrelas = [];
    for (let i = 1; i <= 5; i++) {
      estrelas.push(
        <span key={i} className={i <= nota ? 'estrela-preenchida' : 'estrela-vazia'}>
          ★
        </span>
      );
    }
    return <div className="estrelas">{estrelas}</div>;
  };

  if (!isAuthenticated) {
    return (
      <div className="container">
        <p>Você precisa estar logado para ver suas interações.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="container">Carregando...</div>;
  }

  return (
    <div className="container">
      <h1>Minhas Interações</h1>
      
      {interacoes.length > 0 ? (
        <div className="interacoes-lista">
          {interacoes.map(interacao => (
            <div key={interacao.id} className="card interacao-card">
              <div className="interacao-header">
                <div className="produto-info">
                  <img 
                    src={interacao.produto_imagem || '/placeholder-tenis.jpg'} 
                    alt={interacao.produto_nome}
                    className="produto-thumb"
                  />
                  <div>
                    <h3>{interacao.produto_nome}</h3>
                    <span className="tipo-badge">{getTipoLabel(interacao.tipo)}</span>
                    <span className={`status-badge status-${interacao.status}`}>
                      {getStatusLabel(interacao.status)}
                    </span>
                  </div>
                </div>
                <div className="data">
                  {new Date(interacao.created_at).toLocaleDateString()}
                </div>
              </div>
              
              <div className="interacao-content">
                {interacao.nota && renderEstrelas(interacao.nota)}
                
                {interacao.conteudo && (
                  <div className="conteudo">
                    <strong>Seu comentário:</strong>
                    <p>{interacao.conteudo}</p>
                  </div>
                )}
                
                {interacao.data_agendamento && (
                  <div className="agendamento">
                    <strong>Data agendada:</strong>
                    <p>{new Date(interacao.data_agendamento).toLocaleString()}</p>
                  </div>
                )}
                
                {interacao.resposta_admin && (
                  <div className="resposta-admin">
                    <strong>Resposta da administração:</strong>
                    <p>{interacao.resposta_admin}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="sem-interacoes">
          <p>Você ainda não fez nenhuma interação.</p>
          <a href="/produtos" className="btn btn-primary">Ver Produtos</a>
        </div>
      )}
    </div>
  );
};

export default MinhasInteracoes;