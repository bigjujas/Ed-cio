import React, { useState, useEffect } from 'react';
import { produtosAPI } from '../services/api';
import ProdutoCard from '../components/ProdutoCard';

const Produtos = () => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    search: '',
    categoria: '',
    ordenar: ''
  });

  const categorias = ['Corrida', 'Casual', 'Basquete', 'Futebol', 'Skateboard'];

  useEffect(() => {
    carregarProdutos();
  }, [filtros]);

  const carregarProdutos = async () => {
    try {
      setLoading(true);
      const response = await produtosAPI.listar(filtros);
      setProdutos(response.data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const limparFiltros = () => {
    setFiltros({
      search: '',
      categoria: '',
      ordenar: ''
    });
  };

  return (
    <div className="container">
      <h1>Nossos Produtos</h1>

      {/* Filtros */}
      <div className="filters">
        <input
          type="text"
          placeholder="Buscar produtos..."
          value={filtros.search}
          onChange={(e) => handleFiltroChange('search', e.target.value)}
          className="search-input"
        />

        <select
          value={filtros.categoria}
          onChange={(e) => handleFiltroChange('categoria', e.target.value)}
        >
          <option value="">Todas as categorias</option>
          {categorias.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={filtros.ordenar}
          onChange={(e) => handleFiltroChange('ordenar', e.target.value)}
        >
          <option value="">Ordenar por</option>
          <option value="preco_asc">Menor preço</option>
          <option value="preco_desc">Maior preço</option>
          <option value="avaliacao">Melhor avaliação</option>
        </select>

        <button onClick={limparFiltros} className="btn btn-secondary">
          Limpar Filtros
        </button>
      </div>

      {/* Lista de Produtos */}
      {loading ? (
        <div>Carregando produtos...</div>
      ) : produtos.length > 0 ? (
        <div className="grid grid-3">
          {produtos.map(produto => (
            <ProdutoCard key={produto.id} produto={produto} />
          ))}
        </div>
      ) : (
        <div>Nenhum produto encontrado.</div>
      )}
    </div>
  );
};

export default Produtos;