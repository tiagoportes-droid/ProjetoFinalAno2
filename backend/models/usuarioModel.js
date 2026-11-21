import bcrypt from "bcryptjs";
import { pool } from "../config/database.js";

export async function cadastrar(dados) {
  const conexao = await pool.getConnection();

  try {
    await conexao.beginTransaction();
    const senhaHash = await bcrypt.hash(dados.senha, 10);
    const [resultado] = await conexao.execute(
      "INSERT INTO cliente (nome, email, telefone, cpf) VALUES (?, ?, ?, ?)",
      [dados.nome, dados.email, dados.telefone || null, dados.cpf || null],
    );

    const clienteId = resultado.insertId;
    await conexao.execute(
      `INSERT INTO cadastro
             (cliente_id, endereco, numero, bairro, cidade, estado, cep)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        clienteId,
        dados.endereco || null,
        dados.numero || null,
        dados.bairro || null,
        dados.cidade || null,
        dados.estado || null,
        dados.cep || null,
      ],
    );
    await conexao.execute(
      "INSERT INTO login (cliente_id, senha_hash) VALUES (?, ?)",
      [clienteId, senhaHash],
    );
    await conexao.commit();
    return await buscarPorId(clienteId);
  } catch (error) {
    await conexao.rollback();
    throw error;
  } finally {
    conexao.release();
  }
}

export async function buscarPorId(id) {
  const [linhas] = await pool.query(
    `SELECT c.id, c.nome, c.email, c.telefone, c.cpf,
                d.endereco, d.numero, d.bairro, d.cidade, d.estado, d.cep
         FROM cliente c
         LEFT JOIN cadastro d ON d.cliente_id = c.id
         WHERE c.id = ?`,
    [id],
  );
  return linhas[0] || null;
}

export async function buscarLogin(email) {
  const [linhas] = await pool.query(
    `SELECT c.id, c.nome, c.email, l.senha_hash
         FROM cliente c
         INNER JOIN login l ON l.cliente_id = c.id
         WHERE c.email = ?`,
    [email],
  );
  return linhas[0] || null;
}

export async function atualizar(id, dados) {
  await pool.execute(
    "UPDATE cliente SET nome = ?, telefone = ?, cpf = ? WHERE id = ?",
    [dados.nome, dados.telefone || null, dados.cpf || null, id],
  );
  await pool.execute(
    `UPDATE cadastro SET endereco = ?, numero = ?, bairro = ?, cidade = ?, estado = ?, cep = ?
         WHERE cliente_id = ?`,
    [
      dados.endereco || null,
      dados.numero || null,
      dados.bairro || null,
      dados.cidade || null,
      dados.estado || null,
      dados.cep || null,
      id,
    ],
  );
  return await buscarPorId(id);
}
