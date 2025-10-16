import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';

const AdminProdutos = () => {
  const { isAdmin } = useAuth();
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    marca: '',
    preco: '',
    descricao: '',
    categoria: '',
    tamanhos: [],
    cores: [],
    imagem: '',
    estoque: '',
    destaque: false
  });

  const categorias = ['Corrida', 'Casual', 'Basquete', 'Futebol', 'Skateboard'];
  const tamanhosDisponiveis = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];
  const coresDisponiveis = ['Preto', 'Branco', 'Vermelho', 'Azul', 'Verde', 'Amarelo', 'Rosa', 'Cinza'];

  useEffect(() => {
    if (isAdmin) {
      carregarProdutos();
    }
  }, [isAdmin]);

  const carregarProdutos = async () => {
    try {
      const response = await adminAPI.produtos();
      setProdutos(response.data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (produto = null) => {
    if (produto) {
      setProdutoEditando(produto);
      setFormData({
        nome: produto.nome,
        marca: produto.marca,
        preco: produto.preco,
        descricao: produto.descricao,
        categoria: produto.categoria,
        tamanhos: JSON.parse(produto.tamanhos || '[]'),
        cores: JSON.parse(produto.cores || '[]'),
        imagem: produto.imagem,
        estoque: produto.estoque,
        destaque: produto.destaque
      });
    } else {
      setProdutoEditando(null);
      setFormData({
        nome: '',
        marca: '',
        preco: '',
        descricao: '',
        categoria: '',
        tamanhos: [],
        cores: [],
        imagem: '',
        estoque: '',
        destaque: false
      });
    }
    setModalAberto(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (produtoEditando) {
        await adminAPI.atualizarProduto(produtoEditando.id, formData);
        alert('Produto atualizado com sucesso!');
      } else {
        await adminAPI.criarProduto(formData);
        alert('Produto cadastrado com sucesso!');
      }
      
      setModalAberto(false);
      carregarProdutos();
    } catch (error) {
      alert('Erro ao salvar produto');
    }
  };

  const handleArrayChange = (campo, valor, checked) => {
    setFormData(prev => ({
      ...prev,
      [campo]: checked 
        ? [...prev[campo], valor]
        : prev[campo].filter(item => item !== valor)
    }));
  };

  if (!isAdmin) {
    return <div className="container">Acesso negado</div>;
  }

  if (loading) {
    return <div className="container">Carregando produtos...</div>;
  }

  return (
    <div className="container">
      <div className="admin-header">
        <h1>Gerenciar Produtos</h1>
        <button onClick={() => abrirModal()} className="btn btn-primary">
          Novo Produto
        </button>
      </div>

      <div className="produtos-lista">
        {produtos.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Marca</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Estoque</th>
                <th>Destaque</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map(produto => (
                <tr key={produto.id}>
                  <td>{produto.nome}</td>
                  <td>{produto.marca}</td>
                  <td>{produto.categoria}</td>
                  <td>R$ {produto.preco}</td>
                  <td>{produto.estoque}</td>
                  <td>{produto.destaque ? 'Sim' : 'Não'}</td>
                  <td>
                    <button 
                      onClick={() => abrirModal(produto)}
                      className="btn btn-secondary btn-sm"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Nenhum produto cadastrado.</p>
        )}
      </div>

      {/* Modal de Produto */}
      {modalAberto && (
        <div className="modal">
          <div className="modal-content modal-large">
            <h3>{produtoEditando ? 'Editar Produto' : 'Novo Produto'}</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Nome:</label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Marca:</label>
                  <input
                    type="text"
                    value={formData.marca}
                    onChange={(e) => setFormData({...formData, marca: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Preço:</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.preco}
                    onChange={(e) => setFormData({...formData, preco: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Categoria:</label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                    required
                  >
                    <option value="">Selecione</option>
                    {categorias.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Descrição:</label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>URL da Imagem:</label>
                <input
                  type="url"
                  value={formData.imagem}
                  onChange={(e) => setFormData({...formData, imagem: e.target.value})}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Estoque:</label>
                  <input
                    type="number"
                    value={formData.estoque}
                    onChange={(e) => setFormData({...formData, estoque: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.destaque}
                      onChange={(e) => setFormData({...formData, destaque: e.target.checked})}
                    />
                    Produto em destaque
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Tamanhos:</label>
                <div className="checkbox-group">
                  {tamanhosDisponiveis.map(tamanho => (
                    <label key={tamanho}>
                      <input
                        type="checkbox"
                        checked={formData.tamanhos.includes(tamanho)}
                        onChange={(e) => handleArrayChange('tamanhos', tamanho, e.target.checked)}
                      />
                      {tamanho}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Cores:</label>
                <div className="checkbox-group">
                  {coresDisponiveis.map(cor => (
                    <label key={cor}>
                      <input
                        type="checkbox"
                        checked={formData.cores.includes(cor)}
                        onChange={(e) => handleArrayChange('cores', cor, e.target.checked)}
                      />
                      {cor}
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">
                  {produtoEditando ? 'Atualizar' : 'Cadastrar'}
                </button>
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

export default AdminProdutos;