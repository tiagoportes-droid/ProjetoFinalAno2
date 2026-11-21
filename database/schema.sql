CREATE DATABASE IF NOT EXISTS projeto_integrador
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE projeto_integrador;

CREATE TABLE IF NOT EXISTS categoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(80) NOT NULL UNIQUE,
    descricao VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS cliente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    cpf VARCHAR(14) UNIQUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS cadastro (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL UNIQUE,
    endereco VARCHAR(255),
    numero VARCHAR(20),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado CHAR(2),
    cep VARCHAR(9),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cadastro_cliente FOREIGN KEY (cliente_id)
        REFERENCES cliente(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS login (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    ultimo_login TIMESTAMP NULL,
    CONSTRAINT fk_login_cliente FOREIGN KEY (cliente_id)
        REFERENCES cliente(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS consulta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NULL,
    termo VARCHAR(150) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_consulta_cliente FOREIGN KEY (cliente_id)
        REFERENCES cliente(id) ON DELETE SET NULL,
    INDEX idx_consulta_termo (termo)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS produto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categoria_id INT NOT NULL,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    estoque INT NOT NULL DEFAULT 0,
    imagem VARCHAR(255),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_produto_categoria FOREIGN KEY (categoria_id)
        REFERENCES categoria(id),
    INDEX idx_produto_nome (nome),
    INDEX idx_produto_preco (preco)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS carrinho_de_compra (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NULL,
    sessao VARCHAR(100),
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_carrinho_cliente FOREIGN KEY (cliente_id)
        REFERENCES cliente(id) ON DELETE CASCADE,
    UNIQUE KEY uk_carrinho_cliente_sessao (cliente_id, sessao)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS item_carrinho (
    id INT AUTO_INCREMENT PRIMARY KEY,
    carrinho_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL,
    CONSTRAINT fk_item_carrinho FOREIGN KEY (carrinho_id)
        REFERENCES carrinho_de_compra(id) ON DELETE CASCADE,
    CONSTRAINT fk_item_carrinho_produto FOREIGN KEY (produto_id)
        REFERENCES produto(id),
    UNIQUE KEY uk_carrinho_produto (carrinho_id, produto_id),
    CONSTRAINT chk_quantidade_carrinho CHECK (quantidade > 0)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS compra (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    carrinho_id INT NULL,
    endereco_entrega VARCHAR(255),
    forma_pagamento VARCHAR(50) NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'confirmada',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_compra_cliente FOREIGN KEY (cliente_id)
        REFERENCES cliente(id),
    CONSTRAINT fk_compra_carrinho FOREIGN KEY (carrinho_id)
        REFERENCES carrinho_de_compra(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS venda (
    id INT AUTO_INCREMENT PRIMARY KEY,
    compra_id INT NOT NULL UNIQUE,
    cliente_id INT NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    data_venda TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(30) NOT NULL DEFAULT 'paga',
    CONSTRAINT fk_venda_compra FOREIGN KEY (compra_id)
        REFERENCES compra(id),
    CONSTRAINT fk_venda_cliente FOREIGN KEY (cliente_id)
        REFERENCES cliente(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS item_venda (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venda_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_item_venda FOREIGN KEY (venda_id)
        REFERENCES venda(id) ON DELETE CASCADE,
    CONSTRAINT fk_item_venda_produto FOREIGN KEY (produto_id)
        REFERENCES produto(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS nota_fiscal (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venda_id INT NOT NULL UNIQUE,
    numero VARCHAR(30) NOT NULL UNIQUE,
    valor_total DECIMAL(10,2) NOT NULL,
    emitida_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    observacao VARCHAR(255) DEFAULT 'Comprovante fiscal acadêmico interno',
    CONSTRAINT fk_nota_venda FOREIGN KEY (venda_id)
        REFERENCES venda(id)
) ENGINE=InnoDB;
