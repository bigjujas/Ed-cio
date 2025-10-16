-- Criação do banco de dados NAIKI
CREATE DATABASE IF NOT EXISTS naiki_db;
USE naiki_db;

-- Tabela de administradores
CREATE TABLE IF NOT EXISTS administradores (
    id VARCHAR(36) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de clientes
CREATE TABLE IF NOT EXISTS clientes (
    id VARCHAR(36) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de produtos (tabela principal)
CREATE TABLE IF NOT EXISTS produtos (
    id VARCHAR(36) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    marca VARCHAR(50) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    descricao TEXT,
    categoria VARCHAR(50),
    tamanhos JSON,
    cores JSON,
    imagem VARCHAR(255),
    estoque INT DEFAULT 0,
    destaque BOOLEAN DEFAULT FALSE,
    avaliacao_media DECIMAL(3,2) DEFAULT 0,
    total_avaliacoes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de interações (avaliações, propostas, agendamentos, reservas)
CREATE TABLE IF NOT EXISTS interacoes (
    id VARCHAR(36) PRIMARY KEY,
    cliente_id VARCHAR(36) NOT NULL,
    produto_id VARCHAR(36) NOT NULL,
    tipo ENUM('avaliacao', 'proposta', 'agendamento', 'reserva') NOT NULL,
    conteudo TEXT,
    nota INT,
    status ENUM('pendente', 'respondida', 'confirmada', 'cancelada') DEFAULT 'pendente',
    resposta_admin TEXT,
    data_agendamento DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE
);

-- Inserir administrador padrão
INSERT IGNORE INTO administradores (id, nome, email, senha) 
VALUES (
    UUID(), 
    'Administrador NAIKI', 
    'admin@naiki.com', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'  -- senha: admin123
);

-- Inserir produtos de exemplo
INSERT IGNORE INTO produtos (id, nome, marca, preco, descricao, categoria, tamanhos, cores, imagem, estoque, destaque) VALUES
(UUID(), 'Air Max 270', 'Nike', 599.99, 'Tênis de corrida com tecnologia Air Max para máximo conforto', 'Corrida', '["38", "39", "40", "41", "42"]', '["Preto", "Branco", "Azul"]', 'https://via.placeholder.com/300x200', 50, TRUE),
(UUID(), 'Chuck Taylor All Star', 'Converse', 299.99, 'Clássico tênis casual para o dia a dia', 'Casual', '["36", "37", "38", "39", "40", "41"]', '["Preto", "Branco", "Vermelho"]', 'https://via.placeholder.com/300x200', 30, TRUE),
(UUID(), 'Air Jordan 1', 'Nike', 899.99, 'Icônico tênis de basquete com design atemporal', 'Basquete', '["39", "40", "41", "42", "43"]', '["Preto", "Vermelho", "Branco"]', 'https://via.placeholder.com/300x200', 25, TRUE),
(UUID(), 'Stan Smith', 'Adidas', 399.99, 'Tênis casual minimalista e elegante', 'Casual', '["37", "38", "39", "40", "41", "42"]', '["Branco", "Verde"]', 'https://via.placeholder.com/300x200', 40, FALSE),
(UUID(), 'Vans Old Skool', 'Vans', 349.99, 'Tênis de skate clássico com design icônico', 'Skateboard', '["36", "37", "38", "39", "40", "41", "42"]', '["Preto", "Branco", "Azul", "Vermelho"]', 'https://via.placeholder.com/300x200', 35, FALSE),
(UUID(), 'Ultraboost 22', 'Adidas', 799.99, 'Tênis de corrida com tecnologia Boost', 'Corrida', '["38", "39", "40", "41", "42", "43"]', '["Preto", "Branco", "Cinza"]', 'https://via.placeholder.com/300x200', 20, TRUE);

-- Inserir cliente de exemplo
INSERT IGNORE INTO clientes (id, nome, email, senha, telefone) 
VALUES (
    UUID(), 
    'Cliente Teste', 
    'cliente@teste.com', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',  -- senha: 123456
    '(11) 99999-9999'
);

-- Índices para melhor performance
CREATE INDEX idx_produtos_categoria ON produtos(categoria);
CREATE INDEX idx_produtos_destaque ON produtos(destaque);
CREATE INDEX idx_produtos_avaliacao ON produtos(avaliacao_media);
CREATE INDEX idx_interacoes_cliente ON interacoes(cliente_id);
CREATE INDEX idx_interacoes_produto ON interacoes(produto_id);
CREATE INDEX idx_interacoes_tipo ON interacoes(tipo);
CREATE INDEX idx_interacoes_status ON interacoes(status);