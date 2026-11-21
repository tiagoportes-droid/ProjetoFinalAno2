USE projeto_integrador;

-- Produtos com suas categorias
SELECT p.id, p.nome, p.preco, p.estoque, c.nome AS categoria
FROM produto p
INNER JOIN categoria c ON c.id = p.categoria_id;

-- Itens vendidos com venda e produto
SELECT v.id AS venda_id, p.nome AS produto, iv.quantidade,
       iv.preco_unitario, iv.subtotal
FROM item_venda iv
INNER JOIN venda v ON v.id = iv.venda_id
INNER JOIN produto p ON p.id = iv.produto_id;

-- Compras com dados do cliente
SELECT co.id AS compra_id, cl.nome, cl.email,
       co.valor_total AS valor_compra, co.status, co.criado_em
FROM compra co
INNER JOIN cliente cl ON cl.id = co.cliente_id;

-- Carrinho, cliente e produtos
SELECT c.id AS carrinho_id, cl.nome AS cliente,
       p.nome AS produto, ic.quantidade
FROM item_carrinho ic
INNER JOIN carrinho_de_compra c ON c.id = ic.carrinho_id
INNER JOIN cliente cl ON cl.id = c.cliente_id
INNER JOIN produto p ON p.id = ic.produto_id;

-- Vendas com cliente e nota fiscal
SELECT v.id AS venda_id, cl.nome AS cliente,
       v.valor_total, n.numero AS nota_fiscal
FROM venda v
INNER JOIN cliente cl ON cl.id = v.cliente_id
INNER JOIN nota_fiscal n ON n.venda_id = v.id;
