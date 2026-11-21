USE projeto_integrador;

INSERT IGNORE INTO categoria (id, nome, descricao) VALUES
(1, 'Kits solares', 'Conjuntos completos para geração de energia solar'),
(2, 'Painéis fotovoltaicos', 'Módulos para conversão da luz em eletricidade'),
(3, 'Inversores', 'Equipamentos que convertem corrente contínua em alternada'),
(4, 'Baterias', 'Armazenamento de energia para uso contínuo'),
(5, 'Controladores de carga', 'Proteção e controle de carregamento das baterias'),
(6, 'Acessórios', 'Cabos, conectores e componentes de instalação');

INSERT IGNORE INTO produto (id, categoria_id, nome, descricao, preco, estoque, imagem) VALUES
(1, 1, 'Kit Solar Residencial 3 kWp', 'Kit completo para residências com 6 painéis de 500 W e inversor.', 12999.90, 8, '/src/assets/kit-solar.svg'),
(2, 1, 'Kit Solar Econômico 1 kWp', 'Sistema compacto ideal para pequenas aplicações e economia mensal.', 4999.90, 15, '/src/assets/kit-solar.svg'),
(3, 2, 'Painel Solar Mono 550 W', 'Painel monocristalino de alta eficiência para projetos residenciais.', 1199.90, 40, '/src/assets/painel.svg'),
(4, 2, 'Painel Solar Bifacial 600 W', 'Módulo bifacial com alta geração em superfícies claras.', 1499.90, 22, '/src/assets/painel.svg'),
(5, 3, 'Inversor On-grid 3000 W', 'Inversor conectado à rede com monitoramento integrado.', 3499.90, 12, '/src/assets/inversor.svg'),
(6, 3, 'Inversor Híbrido 5 kW', 'Conversão híbrida para sistemas com armazenamento.', 5999.90, 7, '/src/assets/inversor.svg'),
(7, 4, 'Bateria LiFePO4 5 kWh', 'Bateria estacionária segura para sistemas solares híbridos.', 8499.90, 10, '/src/assets/bateria.svg'),
(8, 4, 'Bateria Estacionária 150 Ah', 'Bateria de chumbo-ácido para armazenamento de energia.', 1899.90, 18, '/src/assets/bateria.svg'),
(9, 5, 'Controlador MPPT 60 A', 'Controle inteligente de máxima potência para painéis solares.', 1299.90, 25, '/src/assets/controlador.svg'),
(10, 5, 'Controlador PWM 30 A', 'Controlador compacto para sistemas fotovoltaicos menores.', 499.90, 30, '/src/assets/controlador.svg'),
(11, 6, 'Conector MC4 Solar', 'Par de conectores para ligações fotovoltaicas resistentes.', 39.90, 100, '/src/assets/acessorio.svg'),
(12, 6, 'Cabo Solar 6 mm - 10 m', 'Cabo flexível de alta temperatura para instalação solar.', 189.90, 60, '/src/assets/acessorio.svg');

INSERT IGNORE INTO cliente (id, nome, email, telefone, cpf) VALUES
(1, 'Cliente Demonstrativo', 'cliente@greenenergy.com', '(11) 99999-0001', '123.456.789-00');

INSERT IGNORE INTO cadastro (cliente_id, endereco, numero, bairro, cidade, estado, cep) VALUES
(1, 'Rua das Energias Renováveis', '100', 'Centro', 'São Paulo', 'SP', '01000-000');

INSERT IGNORE INTO login (cliente_id, senha_hash) VALUES
(1, '$2b$10$oJR7Y9vegz7Lw52lLrHfz.7nOXswconuF4AisPBWU9SIqrviwlTP6');
