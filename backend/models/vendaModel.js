import { pool } from "../config/database.js";

export async function finalizar(clienteId, dados) {
  const conexao = await pool.getConnection();

  try {
    await conexao.beginTransaction();
    const [carrinhos] = await conexao.execute(
      "SELECT id FROM carrinho_de_compra WHERE cliente_id = ? LIMIT 1",
      [clienteId],
    );
    if (!carrinhos[0]) throw new Error("Carrinho vazio.");

    const carrinhoId = carrinhos[0].id;
    const [itens] = await conexao.query(
      `SELECT i.produto_id, i.quantidade, p.nome, p.preco, p.estoque
             FROM item_carrinho i
             INNER JOIN produto p ON p.id = i.produto_id
             WHERE i.carrinho_id = ?`,
      [carrinhoId],
    );
    if (itens.length === 0) throw new Error("Carrinho vazio.");

    let total = 0;
    for (const item of itens) {
      if (item.quantidade > item.estoque) {
        throw new Error(`Estoque insuficiente para ${item.nome}.`);
      }
      total += Number(item.preco) * item.quantidade;
    }

    const [compra] = await conexao.execute(
      `INSERT INTO compra
             (cliente_id, carrinho_id, endereco_entrega, forma_pagamento, valor_total)
             VALUES (?, ?, ?, ?, ?)`,
      [
        clienteId,
        carrinhoId,
        dados.endereco_entrega || "",
        dados.forma_pagamento || "Pix",
        total,
      ],
    );
    const compraId = compra.insertId;
    const [venda] = await conexao.execute(
      "INSERT INTO venda (compra_id, cliente_id, valor_total) VALUES (?, ?, ?)",
      [compraId, clienteId, total],
    );
    const vendaId = venda.insertId;

    for (const item of itens) {
      const subtotal = Number(item.preco) * item.quantidade;
      await conexao.execute(
        `INSERT INTO item_venda
                 (venda_id, produto_id, quantidade, preco_unitario, subtotal)
                 VALUES (?, ?, ?, ?, ?)`,
        [vendaId, item.produto_id, item.quantidade, item.preco, subtotal],
      );
      await conexao.execute(
        "UPDATE produto SET estoque = estoque - ? WHERE id = ?",
        [item.quantidade, item.produto_id],
      );
    }

    const numero = `GE-${new Date().getFullYear()}-${String(vendaId).padStart(6, "0")}`;
    await conexao.execute(
      "INSERT INTO nota_fiscal (venda_id, numero, valor_total) VALUES (?, ?, ?)",
      [vendaId, numero, total],
    );
    await conexao.execute("DELETE FROM item_carrinho WHERE carrinho_id = ?", [
      carrinhoId,
    ]);

    await conexao.commit();
    return { vendaId, compraId, numero, total };
  } catch (error) {
    await conexao.rollback();
    throw error;
  } finally {
    conexao.release();
  }
}

export async function listar(clienteId) {
  const [vendas] = await pool.query(
    `SELECT v.id, v.valor_total, v.data_venda, v.status,
                n.numero AS nota_numero
         FROM venda v
         LEFT JOIN nota_fiscal n ON n.venda_id = v.id
         WHERE v.cliente_id = ?
         ORDER BY v.data_venda DESC`,
    [clienteId],
  );

  for (const venda of vendas) {
    const [itens] = await pool.query(
      `SELECT iv.quantidade, iv.preco_unitario, iv.subtotal,
                    p.nome AS produto
             FROM item_venda iv
             INNER JOIN produto p ON p.id = iv.produto_id
             WHERE iv.venda_id = ?`,
      [venda.id],
    );
    venda.itens = itens;
  }
  return vendas;
}
