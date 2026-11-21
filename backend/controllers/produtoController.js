import * as produtoModel from "../models/produtoModel.js";
import { pool } from "../config/database.js";

export async function listarProdutos(req, res) {
  try {
    const produtos = await produtoModel.listar(req.query);
    return res.json(produtos);
  } catch (error) {
    console.error("Erro ao listar produtos:", error);
    return res.status(500).json({ mensagem: "Erro ao buscar produtos." });
  }
}

export async function buscarProduto(req, res) {
  try {
    const produto = await produtoModel.buscarPorId(req.params.id);
    if (!produto)
      return res.status(404).json({ mensagem: "Produto não encontrado." });
    return res.json(produto);
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    return res.status(500).json({ mensagem: "Erro ao buscar produto." });
  }
}

export async function listarCategorias(req, res) {
  try {
    return res.json(await produtoModel.listarCategorias());
  } catch (error) {
    console.error("Erro ao listar categorias:", error);
    return res.status(500).json({ mensagem: "Erro ao buscar categorias." });
  }
}

export async function registrarConsulta(req, res) {
  try {
    const termo = String(req.body.termo || "").trim();
    if (!termo) return res.status(400).json({ mensagem: "Informe um termo." });
    await pool.execute(
      "INSERT INTO consulta (cliente_id, termo) VALUES (?, ?)",
      [req.usuario?.id || null, termo],
    );
    return res.status(201).json({ mensagem: "Consulta registrada." });
  } catch (error) {
    console.error("Erro ao registrar consulta:", error);
    return res.status(500).json({ mensagem: "Erro ao registrar consulta." });
  }
}
