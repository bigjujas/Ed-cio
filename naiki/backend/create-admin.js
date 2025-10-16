require('dotenv').config();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { createConnection } = require('./config/database');

const createAdmin = async () => {
  try {
    const connection = await createConnection();
    
    // Deletar admin existente se houver
    await connection.query('DELETE FROM administradores WHERE email = $1', ['admin@naiki.com']);
    
    // Criar novo admin
    const adminId = uuidv4();
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await connection.query(`
      INSERT INTO administradores (id, nome, email, senha) 
      VALUES ($1, $2, $3, $4)
    `, [adminId, 'Administrador NAIKI', 'admin@naiki.com', hashedPassword]);
    
    console.log('✅ Administrador criado com sucesso!');
    console.log('📧 Email: admin@naiki.com');
    console.log('🔑 Senha: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao criar administrador:', error);
    process.exit(1);
  }
};

createAdmin();