const express = require('express');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { createConnection } = require('../../config/database');

const router = express.Router();
const JWT_SECRET = 'naiki_secret_key';

// Middleware de autenticação admin
const authAdmin = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.tipo !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

// Dashboard - estatísticas gerais
router.get('/dashboard', authAdmin, async (req, res) => {
  try {
    const connection = await createConnection();
    
    const totalProdutos = await connection.query('SELECT COUNT(*) as total FROM produtos');
    const totalClientes = await connection.query('SELECT COUNT(*) as total FROM clientes');
    const totalInteracoes = await connection.query('SELECT COUNT(*) as total FROM interacoes');
    const avaliacoesPendentes = await connection.query(
      "SELECT COUNT(*) as total FROM interacoes WHERE tipo = 'avaliacao' AND status = 'pendente'"
    );
    
    // Produtos mais avaliados
    const produtosMaisAvaliados = await connection.query(`
      SELECT p.nome, p.avaliacao_media, p.total_avaliacoes 
      FROM produtos p 
      WHERE p.total_avaliacoes > 0 
      ORDER BY p.total_avaliacoes DESC 
      LIMIT 5
    `);
    
    // Interações por tipo
    const interacoesPorTipo = await connection.query(`
      SELECT tipo, COUNT(*) as quantidade 
      FROM interacoes 
      GROUP BY tipo
    `);
    
    res.json({
      totalProdutos: totalProdutos.rows[0].total,
      totalClientes: totalClientes.rows[0].total,
      totalInteracoes: totalInteracoes.rows[0].total,
      avaliacoesPendentes: avaliacoesPendentes.rows[0].total,
      produtosMaisAvaliados: produtosMaisAvaliados.rows,
      interacoesPorTipo: interacoesPorTipo.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Listar produtos (admin)
router.get('/produtos', authAdmin, async (req, res) => {
  try {
    const connection = await createConnection();
    const result = await connection.query('SELECT * FROM produtos ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cadastrar produto
router.post('/produtos', authAdmin, async (req, res) => {
  try {
    const { nome, marca, preco, descricao, categoria, tamanhos, cores, imagem, estoque, destaque } = req.body;
    const connection = await createConnection();
    
    const produtoId = uuidv4();
    
    await connection.query(`
      INSERT INTO produtos (id, nome, marca, preco, descricao, categoria, tamanhos, cores, imagem, estoque, destaque) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `, [produtoId, nome, marca, preco, descricao, categoria, JSON.stringify(tamanhos), JSON.stringify(cores), imagem, estoque, destaque]);
    
    res.status(201).json({ id: produtoId, message: 'Produto cadastrado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Atualizar produto
router.put('/produtos/:id', authAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, marca, preco, descricao, categoria, tamanhos, cores, imagem, estoque, destaque } = req.body;
    const connection = await createConnection();
    
    await connection.query(`
      UPDATE produtos 
      SET nome = $1, marca = $2, preco = $3, descricao = $4, categoria = $5, tamanhos = $6, cores = $7, imagem = $8, estoque = $9, destaque = $10
      WHERE id = $11
    `, [nome, marca, preco, descricao, categoria, JSON.stringify(tamanhos), JSON.stringify(cores), imagem, estoque, destaque, id]);
    
    res.json({ message: 'Produto atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Listar interações (admin)
router.get('/interacoes', authAdmin, async (req, res) => {
  try {
    const connection = await createConnection();
    
    const result = await connection.query(`
      SELECT i.*, c.nome as cliente_nome, c.email as cliente_email, p.nome as produto_nome
      FROM interacoes i
      JOIN clientes c ON i.cliente_id = c.id
      JOIN produtos p ON i.produto_id = p.id
      ORDER BY i.created_at DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Deletar produto
router.delete('/produtos/:id', authAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Tentando deletar produto:', id);
    const connection = await createConnection();
    
    const result = await connection.query('DELETE FROM produtos WHERE id = $1', [id]);
    console.log('Produto deletado, linhas afetadas:', result.rowCount);
    
    res.json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    res.status(500).json({ error: error.message });
  }
});

// Deletar interação
router.delete('/interacoes/:id', authAdmin, async (req, res) => {
  console.log('=== ROTA DELETE INTERACAO CHAMADA ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Params:', req.params);
  
  try {
    const { id } = req.params;
    console.log('Tentando deletar interação:', id);
    const connection = await createConnection();
    
    const result = await connection.query('DELETE FROM interacoes WHERE id = $1', [id]);
    console.log('Interação deletada, linhas afetadas:', result.rowCount);
    
    res.json({ message: 'Interação deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar interação:', error);
    res.status(500).json({ error: error.message });
  }
});

// Responder interação
router.put('/interacoes/:id/responder', authAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { resposta_admin, status } = req.body;
    const connection = await createConnection();
    
    await connection.query(
      'UPDATE interacoes SET resposta_admin = $1, status = $2 WHERE id = $3',
      [resposta_admin, status, id]
    );
    
    res.json({ message: 'Resposta enviada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;