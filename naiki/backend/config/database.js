const { Pool } = require('pg');

// Configuração do Neon PostgreSQL
const dbConfig = {
  connectionString: process.env.DATABASE_URL || 'postgresql://user:password@host:5432/naiki_db?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  }
};

const pool = new Pool(dbConfig);

const createConnection = async () => {
  try {
    return pool;
  } catch (error) {
    console.error('Erro ao conectar com o banco:', error);
    throw error;
  }
};

const initDatabase = async () => {
  try {
    const dbConnection = await createConnection();
    
    // Criar tabelas PostgreSQL
    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS administradores (
        id VARCHAR(36) PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS clientes (
        id VARCHAR(36) PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL,
        telefone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS produtos (
        id VARCHAR(36) PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        marca VARCHAR(50) NOT NULL,
        preco DECIMAL(10,2) NOT NULL,
        descricao TEXT,
        categoria VARCHAR(50),
        tamanhos JSONB,
        cores JSONB,
        imagem VARCHAR(255),
        estoque INT DEFAULT 0,
        destaque BOOLEAN DEFAULT FALSE,
        avaliacao_media DECIMAL(3,2) DEFAULT 0,
        total_avaliacoes INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Criar tipos ENUM para PostgreSQL
    await dbConnection.query(`
      DO $$ BEGIN
        CREATE TYPE tipo_interacao AS ENUM ('avaliacao', 'proposta', 'agendamento', 'reserva');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    
    // Adicionar novo tipo 'carrinho' ao enum existente
    await dbConnection.query(`
      DO $$ BEGIN
        ALTER TYPE tipo_interacao ADD VALUE IF NOT EXISTS 'carrinho';
      EXCEPTION
        WHEN others THEN null;
      END $$;
    `);

    await dbConnection.query(`
      DO $$ BEGIN
        CREATE TYPE status_interacao AS ENUM ('pendente', 'respondida', 'confirmada', 'cancelada');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS interacoes (
        id VARCHAR(36) PRIMARY KEY,
        cliente_id VARCHAR(36) NOT NULL,
        produto_id VARCHAR(36) NOT NULL,
        tipo tipo_interacao NOT NULL,
        conteudo TEXT,
        nota INT,
        status status_interacao DEFAULT 'pendente',
        resposta_admin TEXT,
        data_agendamento TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
        FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE
      )
    `);

    // Inserir admin padrão
    const { v4: uuidv4 } = require('uuid');
    const bcrypt = require('bcryptjs');
    
    // Verificar se admin já existe
    const adminExists = await dbConnection.query(
      'SELECT id FROM administradores WHERE email = $1',
      ['admin@naiki.com']
    );
    
    if (adminExists.rows.length === 0) {
      const adminId = uuidv4();
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await dbConnection.query(`
        INSERT INTO administradores (id, nome, email, senha) 
        VALUES ($1, $2, $3, $4)
      `, [adminId, 'Administrador NAIKI', 'admin@naiki.com', hashedPassword]);
      
      console.log('Administrador criado: admin@naiki.com / admin123');
    } else {
      console.log('Administrador já existe: admin@naiki.com / admin123');
    }

    console.log('Banco de dados PostgreSQL inicializado com sucesso!');
  } catch (error) {
    console.error('Erro ao inicializar banco:', error);
  }
};

module.exports = { createConnection, initDatabase };