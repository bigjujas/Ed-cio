const express = require('express');
const jwt = require('jsonwebtoken');
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

// Perfil do cliente
router.get('/perfil', auth, async (req, res) => {
  try {
    const connection = await createConnection();
    
    const result = await connection.query(
      'SELECT id, nome, email, telefone, created_at FROM clientes WHERE id = $1',
      [req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;