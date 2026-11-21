import { pool } from "../config/database.js";

export async function buscarCarrinho(clienteId) {
  const [carrinhos] = await pool.query(
    "SELECT * FROM carrinho_de_compra WHERE cliente_id = ? LIMIT 1",
    [clienteId],
  );

  let carrinho = carrinhos[0];
  if (!carrinho) {
    const [resultado] = await pool.execute(
      "INSERT INTO carrinho_de_compra (cliente_id) VALUES (?)",
      [clienteId],
    );
    carrinho = { id: resultado.insertId, cliente_id: clienteId };
  }

  const [itens] = await pool.query(
    `SELECT i.id, i.quantidade, p.id AS produto_id, p.nome,
                p.preco, p.estoque, p.imagem,
                (i.quantidade * p.preco) AS subtotal
         FROM item_carrinho i
         INNER JOIN produto p ON p.id = i.produto_id
         WHERE i.carrinho_id = ?
         ORDER BY i.id`,
    [carrinho.id],
  );

  const total = itens.reduce((soma, item) => soma + Number(item.subtotal), 0);
  return { id: carrinho.id, itens, total };
}

export async function adicionar(clienteId, produtoId, quantidade) {
  const carrinho = await buscarCarrinho(clienteId);
  const [produtos] = await pool.query(
    "SELECT id, estoque FROM produto WHERE id = ? AND ativo = TRUE",
    [produtoId],
  );
  if (!produtos[0]) throw new Error("Produto não encontrado.");

  const item = carrinho.itens.find(
    (linha) => linha.produto_id === Number(produtoId),
  );
  const quantidadeAtual = item ? item.quantidade : 0;
  const novaQuantidade = quantidadeAtual + Number(quantidade);

  if (novaQuantidade > produtos[0].estoque) {
    throw new Error("Quantidade maior que o estoque disponível.");
  }

  await pool.execute(
    `INSERT INTO item_carrinho (carrinho_id, produto_id, quantidade)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE quantidade = ?`,
    [carrinho.id, produtoId, novaQuantidade, novaQuantidade],
  );
  return await buscarCarrinho(clienteId);
}

export async function alterar(clienteId, itemId, quantidade) {
  const carrinho = await buscarCarrinho(clienteId);
  const item = carrinho.itens.find((linha) => linha.id === Number(itemId));
  if (!item) throw new Error("Item não encontrado no carrinho.");
  if (Number(quantidade) > item.estoque) {
    throw new Error("Quantidade maior que o estoque disponível.");
  }

  await pool.execute(
    "UPDATE item_carrinho SET quantidade = ? WHERE id = ? AND carrinho_id = ?",
    [quantidade, itemId, carrinho.id],
  );
  return await buscarCarrinho(clienteId);
}

export async function remover(clienteId, itemId) {
  const carrinho = await buscarCarrinho(clienteId);
  await pool.execute(
    "DELETE FROM item_carrinho WHERE id = ? AND carrinho_id = ?",
    [itemId, carrinho.id],
  );
  return await buscarCarrinho(clienteId);
}

export async function limpar(clienteId) {
  const carrinho = await buscarCarrinho(clienteId);
  await pool.execute("DELETE FROM item_carrinho WHERE carrinho_id = ?", [
    carrinho.id,
  ]);
  return await buscarCarrinho(clienteId);
}
