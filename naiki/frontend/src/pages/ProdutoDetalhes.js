import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { produtosAPI, interacoesAPI } from '../services/api';

const ProdutoDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [tipoInteracao, setTipoInteracao] = useState('');
  const [formData, setFormData] = useState({
    conteudo: '',
    nota: 5,
    data_agendamento: ''
  });

  useEffect(() => {
    carregarProduto();
  }, [id]);

  const carregarProduto = async () => {
    try {
      const response = await produtosAPI.detalhes(id);
      setProduto(response.data);
    } catch (error) {
      console.error('Erro ao carregar produto:', error);
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (tipo) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setTipoInteracao(tipo);
    setModalAberto(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await interacoesAPI.criar({
        produto_id: id,
        tipo: tipoInteracao,
        ...formData
      });
      
      alert('Interação enviada com sucesso!');
      setModalAberto(false);
      setFormData({ conteudo: '', nota: 5, data_agendamento: '' });
      
      // Recarregar produto para atualizar avaliações
      if (tipoInteracao === 'avaliacao') {
        carregarProduto();
      }
    } catch (error) {
      alert('Erro ao enviar interação');
    }
  };

  const renderEstrelas = (nota) => {
    const estrelas = [];
    for (let i = 1; i <= 5; i++) {
      estrelas.push(
        <span key={i} className={i <= nota ? 'estrela-preenchida' : 'estrela-vazia'}>
          ★
        </span>
      );
    }
    return estrelas;
  };

  if (loading) {
    return <div className="container">Carregando...</div>;
  }

  if (!produto) {
    return <div className="container">Produto não encontrado</div>;
  }

  return (
    <div className="container">
      <div className="produto-detalhes">
        <div className="produto-imagem">
          <img src={produto.imagem || '/placeholder-tenis.jpg'} alt={produto.nome} />
        </div>
        
        <div className="produto-info">
          <h1>{produto.nome}</h1>
          <p className="marca">{produto.marca}</p>
          <p className="categoria">Categoria: {produto.categoria}</p>
          
          <div className="avaliacao">
            <div className="estrelas">
              {renderEstrelas(Math.round(produto.avaliacao_media))}
            </div>
            <span>({produto.total_avaliacoes} avaliações)</span>
          </div>
          
          <p className="preco">R$ {produto.preco}</p>
          <p className="descricao">{produto.descricao}</p>
          
          <div className="tamanhos">
            <h3>Tamanhos disponíveis:</h3>
            {JSON.parse(produto.tamanhos || '[]').map(tamanho => (
              <span key={tamanho} className="tamanho">{tamanho}</span>
            ))}
          </div>
          
          <div className="cores">
            <h3>Cores disponíveis:</h3>
            {JSON.parse(produto.cores || '[]').map(cor => (
              <span key={cor} className="cor">{cor}</span>
            ))}
          </div>
          
          <div className="acoes">
            <button onClick={() => abrirModal('avaliacao')} className="btn btn-primary">
              Avaliar Produto
            </button>
            <button onClick={() => abrirModal('proposta')} className="btn btn-secondary">
              Fazer Proposta
            </button>
            <button onClick={() => abrirModal('agendamento')} className="btn btn-secondary">
              Agendar Visita
            </button>
            <button onClick={() => abrirModal('reserva')} className="btn btn-primary">
              Reservar
            </button>
          </div>
        </div>
      </div>

      {/* Avaliações */}
      <div className="avaliacoes">
        <h2>Avaliações dos Clientes</h2>
        {produto.avaliacoes?.length > 0 ? (
          produto.avaliacoes.map(avaliacao => (
            <div key={avaliacao.id} className="avaliacao-item">
              <div className="avaliacao-header">
                <strong>{avaliacao.cliente_nome}</strong>
                <div className="estrelas">
                  {renderEstrelas(avaliacao.nota)}
                </div>
              </div>
              <p>{avaliacao.conteudo}</p>
              <small>{new Date(avaliacao.created_at).toLocaleDateString()}</small>
            </div>
          ))
        ) : (
          <p>Nenhuma avaliação ainda.</p>
        )}
      </div>

      {/* Modal de Interação */}
      {modalAberto && (
        <div className="modal">
          <div className="modal-content">
            <h3>
              {tipoInteracao === 'avaliacao' && 'Avaliar Produto'}
              {tipoInteracao === 'proposta' && 'Fazer Proposta'}
              {tipoInteracao === 'agendamento' && 'Agendar Visita'}
              {tipoInteracao === 'reserva' && 'Reservar Produto'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              {tipoInteracao === 'avaliacao' && (
                <div className="form-group">
                  <label>Nota (1-5):</label>
                  <select
                    value={formData.nota}
                    onChange={(e) => setFormData({...formData, nota: parseInt(e.target.value)})}
                  >
                    {[1,2,3,4,5].map(n => (
                      <option key={n} value={n}>{n} estrela{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              )}
              
              {tipoInteracao === 'agendamento' && (
                <div className="form-group">
                  <label>Data e Hora:</label>
                  <input
                    type="datetime-local"
                    value={formData.data_agendamento}
                    onChange={(e) => setFormData({...formData, data_agendamento: e.target.value})}
                    required
                  />
                </div>
              )}
              
              <div className="form-group">
                <label>
                  {tipoInteracao === 'avaliacao' && 'Comentário:'}
                  {tipoInteracao === 'proposta' && 'Sua proposta:'}
                  {tipoInteracao === 'agendamento' && 'Observações:'}
                  {tipoInteracao === 'reserva' && 'Observações:'}
                </label>
                <textarea
                  value={formData.conteudo}
                  onChange={(e) => setFormData({...formData, conteudo: e.target.value})}
                  required
                />
              </div>
              
              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">Enviar</button>
                <button type="button" onClick={() => setModalAberto(false)} className="btn btn-secondary">
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

export default ProdutoDetalhes;