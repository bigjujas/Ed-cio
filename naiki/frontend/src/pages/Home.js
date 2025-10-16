import React, { useState, useEffect } from 'react';
import { produtosAPI } from '../services/api';
import ProdutoCard from '../components/ProdutoCard';

const Home = () => {
  const [destaques, setDestaques] = useState([]);
  const [ultimos, setUltimos] = useState([]);
  const [melhoresAvaliados, setMelhoresAvaliados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [destaquesRes, ultimosRes, melhoresRes] = await Promise.all([
          produtosAPI.destaques(),
          produtosAPI.ultimos(),
          produtosAPI.melhoresAvaliados()
        ]);

        setDestaques(destaquesRes.data);
        setUltimos(ultimosRes.data);
        setMelhoresAvaliados(melhoresRes.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  if (loading) {
    return <div className="container">Carregando...</div>;
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <h1>NAIKI</h1>
        <p>Os melhores tênis para o seu estilo</p>
        <a href="/produtos" className="btn btn-secondary">
          Ver Produtos
        </a>
      </section>

      <div className="container">
        {/* Produtos em Destaque */}
        {destaques.length > 0 && (
          <section>
            <h2>Produtos em Destaque</h2>
            <div className="grid grid-3">
              {destaques.map(produto => (
                <ProdutoCard key={produto.id} produto={produto} />
              ))}
            </div>
          </section>
        )}

        {/* Últimos Produtos */}
        {ultimos.length > 0 && (
          <section>
            <h2>Últimos Lançamentos</h2>
            <div className="grid grid-4">
              {ultimos.map(produto => (
                <ProdutoCard key={produto.id} produto={produto} />
              ))}
            </div>
          </section>
        )}

        {/* Melhores Avaliados */}
        {melhoresAvaliados.length > 0 && (
          <section>
            <h2>Melhores Avaliados</h2>
            <div className="grid grid-3">
              {melhoresAvaliados.map(produto => (
                <ProdutoCard key={produto.id} produto={produto} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Home;