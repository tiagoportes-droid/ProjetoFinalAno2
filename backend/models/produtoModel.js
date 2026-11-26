import { pool } from "../config/database.js";

export async function listar({ categoria, busca, ordenar }) {
  let sql = `SELECT p.*, c.nome AS categoria
               FROM produto p
               INNER JOIN categoria c ON c.id = p.categoria_id
               WHERE p.ativo = TRUE`;
  const parametros = [];

  if (categoria) {
    sql += " AND c.nome = ?";
    parametros.push(categoria);
  }
  if (busca) {
    sql += " AND (p.nome LIKE ? OR p.descricao LIKE ?)";
    parametros.push(`%${busca}%`, `%${busca}%`);
  }

  if (ordenar === "menor") sql += " ORDER BY p.preco ASC";
  else if (ordenar === "maior") sql += " ORDER BY p.preco DESC";
  else if (ordenar === "nome") sql += " ORDER BY p.nome ASC";
  else sql += " ORDER BY p.id DESC";

  const [produtos] = await pool.query(sql, parametros);
  return produtos;
}

export async function buscarPorId(id) {
  const [linhas] = await pool.query(
    `SELECT p.*, c.nome AS categoria
         FROM produto p
         INNER JOIN categoria c ON c.id = p.categoria_id
         WHERE p.id = ? AND p.ativo = TRUE`,
    [id],
  );
  return linhas[0] || null;
}

export async function listarCategorias() {
  const [categorias] = await pool.query(
    "SELECT * FROM categoria ORDER BY nome",
  );
  return categorias;
}

export async function buscarCategoriaPorId(id) {
  const [categorias] = await pool.execute(
    "SELECT id FROM categoria WHERE id = ?",
    [id],
  );
  return categorias[0] || null;
}

export async function criar({
  categoriaId,
  nome,
  descricao,
  preco,
  estoque,
  imagem,
}) {
  const [resultado] = await pool.execute(
    `INSERT INTO produto (categoria_id, nome, descricao, preco, estoque, imagem)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [categoriaId, nome, descricao, preco, estoque, imagem],
  );
  return resultado.insertId;
}
