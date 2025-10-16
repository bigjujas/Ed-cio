import React from 'react';
import { Link } from 'react-router-dom';

const ProdutoCard = ({ produto }) => {
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

  return (
    <div className="card produto-card">
      <img 
        src={produto.imagem || '/placeholder-tenis.jpg'} 
        alt={produto.nome}
        className="card-img"
      />
      <div className="card-content">
        <h3>{produto.nome}</h3>
        <p className="marca">{produto.marca}</p>
        <div className="produto-avaliacao">
          <div className="estrelas">
            {renderEstrelas(Math.round(produto.avaliacao_media))}
          </div>
          <span>({produto.total_avaliacoes})</span>
        </div>
        <p className="produto-preco">R$ {produto.preco}</p>
        <Link to={`/produto/${produto.id}`} className="btn btn-primary">
          Ver Detalhes
        </Link>
      </div>
    </div>
  );
};

export default ProdutoCard;