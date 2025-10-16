require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDatabase } = require('../config/database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Rotas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/produtos', require('./routes/produtos'));
app.use('/api/clientes', require('./routes/clientes'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/interacoes', require('./routes/interacoes'));

// Inicializar banco e servidor
const startServer = async () => {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
  }
};

startServer();