const express = require('express');
const { createConnection } = require('../../config/database');

const router = express.Router();

// Listar produtos com filtros
router.get('/', async (req, res) => {
  try {
    const { search, categoria, ordenar } = req.query;
    const connection = await createConnection();
    
    let query = 'SELECT * FROM produtos WHERE 1=1';
    let params = [];
    let paramCount = 0;
    
    if (search) {
      paramCount++;
      query += ` AND (nome ILIKE $${paramCount} OR marca ILIKE $${paramCount} OR descricao ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }
    
    if (categoria) {
      paramCount++;
      query += ` AND categoria = $${paramCount}`;
      params.push(categoria);
    }
    
    switch (ordenar) {
      case 'preco_asc':
        query += ' ORDER BY preco ASC';
        break;
      case 'preco_desc':
        query += ' ORDER BY preco DESC';
        break;
      case 'avaliacao':
        query += ' ORDER BY avaliacao_media DESC';
        break;
      default:
        query += ' ORDER BY created_at DESC';
    }
    
    const result = await connection.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Produtos em destaque
router.get('/destaques', async (req, res) => {
  try {
    const connection = await createConnection();
    const result = await connection.query(
      'SELECT * FROM produtos WHERE destaque = TRUE ORDER BY avaliacao_media DESC LIMIT 6'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Últimos produtos
router.get('/ultimos', async (req, res) => {
  try {
    const connection = await createConnection();
    const result = await connection.query(
      'SELECT * FROM produtos ORDER BY created_at DESC LIMIT 8'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Melhores avaliados
router.get('/melhores-avaliados', async (req, res) => {
  try {
    const connection = await createConnection();
    const result = await connection.query(
      'SELECT * FROM produtos WHERE total_avaliacoes > 0 ORDER BY avaliacao_media DESC LIMIT 6'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Detalhes do produto
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await createConnection();
    
    const result = await connection.query(
      'SELECT * FROM produtos WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    
    // Buscar avaliações do produto
    const avaliacoes = await connection.query(`
      SELECT i.*, c.nome as cliente_nome 
      FROM interacoes i 
      JOIN clientes c ON i.cliente_id = c.id 
      WHERE i.produto_id = $1 AND i.tipo = 'avaliacao' 
      ORDER BY i.created_at DESC
    `, [id]);
    
    const produto = result.rows[0];
    produto.avaliacoes = avaliacoes.rows;
    
    res.json(produto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;