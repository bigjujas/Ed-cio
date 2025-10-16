import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';

const AdminInteracoes = () => {
  const { isAdmin } = useAuth();
  const [interacoes, setInteracoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [interacaoSelecionada, setInteracaoSelecionada] = useState(null);
  const [resposta, setResposta] = useState('');
  const [novoStatus, setNovoStatus] = useState('');

  useEffect(() => {
    if (isAdmin) {
      carregarInteracoes();
    }
  }, [isAdmin]);

  const carregarInteracoes = async () => {
    try {
      const response = await adminAPI.interacoes();
      setInteracoes(response.data);
    } catch (error) {
      console.error('Erro ao carregar interações:', error);
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (interacao) => {
    setInteracaoSelecionada(interacao);
    setResposta(interacao.resposta_admin || '');
    setNovoStatus(interacao.status);
    setModalAberto(true);
  };

  const handleResponder = async (e) => {
    e.preventDefault();
    
    try {
      await adminAPI.responderInteracao(interacaoSelecionada.id, {
        resposta_admin: resposta,
        status: novoStatus
      });
      
      alert('Resposta enviada com sucesso!');
      setModalAberto(false);
      carregarInteracoes();
    } catch (error) {
      alert('Erro ao enviar resposta');
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

  const deletarInteracao = async (id) => {
    console.log('=== DELETAR INTERACAO FRONTEND ===');
    console.log('ID da interação:', id);
    
    if (window.confirm('Tem certeza que deseja excluir esta interação?')) {
      try {
        console.log('Chamando adminAPI.deletarInteracao com ID:', id);
        const response = await adminAPI.deletarInteracao(id);
        console.log('Resposta da API:', response);
        alert('Interação excluída com sucesso!');
        carregarInteracoes();
      } catch (error) {
        console.error('Erro completo:', error);
        console.error('Status:', error.response?.status);
        console.error('Data:', error.response?.data);
        alert(`Erro ao excluir interação: ${error.response?.data?.error || error.message}`);
      }
    }
  };

  if (!isAdmin) {
    return <div className="container">Acesso negado</div>;
  }

  if (loading) {
    return <div className="container">Carregando interações...</div>;
  }

  return (
    <div className="container">
      <h1>Gerenciar Interações dos Clientes</h1>

      {interacoes.length > 0 ? (
        <div className="interacoes-admin">
          {interacoes.map(interacao => (
            <div key={interacao.id} className="card interacao-admin-card">
              <div className="interacao-header">
                <div className="cliente-info">
                  <h3>{interacao.cliente_nome}</h3>
                  <p>{interacao.cliente_email}</p>
                </div>
                <div className="produto-info">
                  <h4>{interacao.produto_nome}</h4>
                  <span className="tipo-badge">{getTipoLabel(interacao.tipo)}</span>
                  <span className={`status-badge status-${interacao.status}`}>
                    {getStatusLabel(interacao.status)}
                  </span>
                </div>
                <div className="data">
                  {new Date(interacao.created_at).toLocaleDateString()}
                </div>
              </div>

              <div className="interacao-content">
                {interacao.nota && (
                  <div className="avaliacao">
                    <strong>Nota:</strong>
                    {renderEstrelas(interacao.nota)}
                  </div>
                )}

                {interacao.conteudo && (
                  <div className="conteudo">
                    <strong>Comentário do cliente:</strong>
                    <p>{interacao.conteudo}</p>
                  </div>
                )}

                {interacao.data_agendamento && (
                  <div className="agendamento">
                    <strong>Data solicitada:</strong>
                    <p>{new Date(interacao.data_agendamento).toLocaleString()}</p>
                  </div>
                )}

                {interacao.resposta_admin && (
                  <div className="resposta-existente">
                    <strong>Sua resposta:</strong>
                    <p>{interacao.resposta_admin}</p>
                  </div>
                )}
              </div>

              <div className="interacao-actions">
                <button 
                  onClick={() => abrirModal(interacao)}
                  className="btn btn-primary"
                >
                  {interacao.resposta_admin ? 'Editar Resposta' : 'Responder'}
                </button>
                <button 
                  onClick={() => deletarInteracao(interacao.id)}
                  className="btn btn-danger"
                  style={{marginLeft: '0.5rem'}}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Nenhuma interação encontrada.</p>
      )}

      {/* Modal de Resposta */}
      {modalAberto && interacaoSelecionada && (
        <div className="modal">
          <div className="modal-content">
            <h3>Responder Interação</h3>
            
            <div className="interacao-resumo">
              <p><strong>Cliente:</strong> {interacaoSelecionada.cliente_nome}</p>
              <p><strong>Produto:</strong> {interacaoSelecionada.produto_nome}</p>
              <p><strong>Tipo:</strong> {getTipoLabel(interacaoSelecionada.tipo)}</p>
              {interacaoSelecionada.conteudo && (
                <p><strong>Comentário:</strong> {interacaoSelecionada.conteudo}</p>
              )}
            </div>

            <form onSubmit={handleResponder}>
              <div className="form-group">
                <label>Status:</label>
                <select
                  value={novoStatus}
                  onChange={(e) => setNovoStatus(e.target.value)}
                  required
                >
                  <option value="pendente">Pendente</option>
                  <option value="respondida">Respondida</option>
                  <option value="confirmada">Confirmada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>

              <div className="form-group">
                <label>Resposta:</label>
                <textarea
                  value={resposta}
                  onChange={(e) => setResposta(e.target.value)}
                  placeholder="Digite sua resposta para o cliente..."
                  rows="4"
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">
                  Enviar Resposta
                </button>
                <button 
                  type="button" 
                  onClick={() => setModalAberto(false)} 
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInteracoes;