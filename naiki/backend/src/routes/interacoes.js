const express = require('express');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { createConnection } = require('../../config/database');

const router = express.Router();
const JWT_SECRET = 'naiki_secret_key';

// Middleware de autenticação
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

// Criar interação (avaliação, proposta, agendamento, reserva)
router.post('/', auth, async (req, res) => {
  try {
    const { produto_id, tipo, conteudo, nota, data_agendamento } = req.body;
    
    if (!produto_id || !tipo) {
      return res.status(400).json({ error: 'Produto ID e tipo são obrigatórios' });
    }
    
    const connection = await createConnection();
    const interacaoId = uuidv4();
    
    // Converter nota para número se for avaliação
    const notaValue = tipo === 'avaliacao' ? parseInt(nota) : null;
    const conteudoValue = conteudo || null;
    const dataAgendamento = data_agendamento || null;
    
    await connection.query(`
      INSERT INTO interacoes (id, cliente_id, produto_id, tipo, conteudo, nota, data_agendamento) 
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [interacaoId, req.user.id, produto_id, tipo, conteudoValue, notaValue, dataAgendamento]);
    
    // Se for avaliação, atualizar média do produto
    if (tipo === 'avaliacao' && notaValue) {
      const produto = await connection.query(
        'SELECT avaliacao_media, total_avaliacoes FROM produtos WHERE id = $1',
        [produto_id]
      );
      
      if (produto.rows.length > 0) {
        const { avaliacao_media, total_avaliacoes } = produto.rows[0];
        const novaMedia = ((avaliacao_media * total_avaliacoes) + notaValue) / (total_avaliacoes + 1);
        
        await connection.query(`
          UPDATE produtos 
          SET avaliacao_media = $1, total_avaliacoes = total_avaliacoes + 1 
          WHERE id = $2
        `, [novaMedia, produto_id]);
      }
    }
    
    res.status(201).json({ id: interacaoId, message: 'Interação criada com sucesso' });
  } catch (error) {
    console.error('Erro ao criar interação:', error);
    res.status(500).json({ error: error.message });
  }
});

// Listar interações do cliente
router.get('/minhas', auth, async (req, res) => {
  try {
    const connection = await createConnection();
    
    const result = await connection.query(`
      SELECT i.*, p.nome as produto_nome, p.imagem as produto_imagem, p.preco as produto_preco
      FROM interacoes i
      JOIN produtos p ON i.produto_id = p.id
      WHERE i.cliente_id = $1
      ORDER BY i.created_at DESC
    `, [req.user.id]);
    
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;