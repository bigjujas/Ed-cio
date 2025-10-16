import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { produtosAPI, interacoesAPI } from '../services/api';

// Função auxiliar para analisar JSON de forma segura
const parseJsonSeguro = (data) => {
  // Se o dado já for um array, retorna ele mesmo
  if (Array.isArray(data)) {
    return data;
  }
  
  // Trata valores nulos ou indefinidos
  if (!data) {
    return [];
  }
  
  // Garante que é uma string antes de tentar o parse
  const stringData = String(data).trim();

  // Se é uma string separada por vírgulas (não JSON), processa diretamente
  if (stringData.includes(',') && !stringData.startsWith('[') && !stringData.startsWith('{')) {
    return stringData.split(',').map(item => item.trim());
  }

  // Tenta analisar como JSON
  try {
    return JSON.parse(stringData);
  } catch (e) {
    // Se for uma string simples sem vírgulas, retorna como array de um elemento
    return [stringData];
  }
};


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
    nota: 5
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
      const dadosEnvio = {
        produto_id: id,
        tipo: 'avaliacao',
        conteudo: formData.conteudo,
        nota: parseInt(formData.nota)
      };
      
      await interacoesAPI.criar(dadosEnvio);
      
      alert('Avaliação enviada com sucesso!');
      setModalAberto(false);
      setFormData({ conteudo: '', nota: 5 });
      carregarProduto();
    } catch (error) {
      console.error('Erro detalhado:', error.response?.data || error.message);
      alert(`Erro ao enviar interação: ${error.response?.data?.error || error.message}`);
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

  // --- Aplicação da correção ---
  const tamanhosDisponiveis = parseJsonSeguro(produto.tamanhos);
  const coresDisponiveis = parseJsonSeguro(produto.cores);
  // -----------------------------

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
            {/* USANDO A VARIÁVEL TRATADA */}
            {tamanhosDisponiveis.map(tamanho => (
              <span key={tamanho} className="tamanho">{tamanho}</span>
            ))}
          </div>

          <div className="cores">
            <h3>Cores disponíveis:</h3>
            {/* USANDO A VARIÁVEL TRATADA */}
            {coresDisponiveis.map(cor => (
              <span key={cor} className="cor">{cor}</span>
            ))}
          </div>

          <div className="acoes">
            <button onClick={() => abrirModal('avaliacao')} className="btn btn-primary">
              Avaliar Produto
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
            <h3>Avaliar Produto</h3>

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

              <div className="form-group">
                <label>Comentário:</label>
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