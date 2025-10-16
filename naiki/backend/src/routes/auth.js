const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { createConnection } = require('../../config/database');

const router = express.Router();
const JWT_SECRET = 'naiki_secret_key';

// Login Cliente
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const connection = await createConnection();
    
    const result = await connection.query(
      'SELECT * FROM clientes WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    
    const cliente = result.rows[0];
    const senhaValida = await bcrypt.compare(senha, cliente.senha);
    
    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    
    const token = jwt.sign({ id: cliente.id, tipo: 'cliente' }, JWT_SECRET);
    
    res.json({ 
      token, 
      cliente: { 
        id: cliente.id, 
        nome: cliente.nome, 
        email: cliente.email 
      } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cadastro Cliente
router.post('/cadastro', async (req, res) => {
  try {
    const { nome, email, senha, telefone } = req.body;
    const connection = await createConnection();
    
    const clienteId = uuidv4();
    const hashedPassword = await bcrypt.hash(senha, 10);
    
    await connection.query(
      'INSERT INTO clientes (id, nome, email, senha, telefone) VALUES ($1, $2, $3, $4, $5)',
      [clienteId, nome, email, hashedPassword, telefone]
    );
    
    const token = jwt.sign({ id: clienteId, tipo: 'cliente' }, JWT_SECRET);
    
    res.status(201).json({ 
      token, 
      cliente: { id: clienteId, nome, email } 
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Login Admin
router.post('/admin/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const connection = await createConnection();
    
    const result = await connection.query(
      'SELECT * FROM administradores WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    
    const admin = result.rows[0];
    const senhaValida = await bcrypt.compare(senha, admin.senha);
    
    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    
    const token = jwt.sign({ id: admin.id, tipo: 'admin' }, JWT_SECRET);
    
    res.json({ 
      token, 
      admin: { 
        id: admin.id, 
        nome: admin.nome, 
        email: admin.email 
      } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;