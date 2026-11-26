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

export async function criarProduto(req, res) {
  const { categoria_id, nome, descricao, preco, estoque, imagem } =
    req.body || {};
  const nomeNormalizado = typeof nome === "string" ? nome.trim() : "";
  const descricaoNormalizada =
    typeof descricao === "string" ? descricao.trim() : "";
  const imagemNormalizada =
    typeof imagem === "string" && imagem.trim() ? imagem.trim() : null;

  // O preço usa duas casas; esta comparação evita erros de arredondamento do JavaScript.
  if (
    !Number.isInteger(categoria_id) ||
    categoria_id < 1 ||
    !nomeNormalizado ||
    nomeNormalizado.length > 150 ||
    !descricaoNormalizada ||
    descricaoNormalizada.length > 5000 ||
    !Number.isFinite(preco) ||
    preco <= 0 ||
    preco > 99999999.99 ||
    Number(preco.toFixed(2)) !== preco ||
    !Number.isInteger(estoque) ||
    estoque < 0 ||
    estoque > 2147483647
  ) {
    return res.status(400).json({
      mensagem:
        "Informe categoria, nome (até 150 caracteres), descrição (até 5000 caracteres), preço válido e estoque inteiro não negativo.",
    });
  }

  if (
    imagem !== undefined &&
    imagem !== null &&
    typeof imagem !== "string"
  ) {
    return res.status(400).json({ mensagem: "O campo imagem deve ser texto." });
  }

  if (
    imagemNormalizada &&
    (imagemNormalizada.length > 255 ||
      !/^(https?:\/\/[^\s"'<>]+|\/src\/assets\/[A-Za-z0-9._/-]+)$/.test(
        imagemNormalizada,
      ) ||
      imagemNormalizada.includes(".."))
  ) {
    return res.status(400).json({
      mensagem:
        "A imagem deve ser uma URL HTTP(S) ou um caminho dentro de /src/assets.",
    });
  }

  try {
    const categoriaId = Number(categoria_id);
    const categoria = await produtoModel.buscarCategoriaPorId(categoriaId);
    if (!categoria) {
      return res.status(400).json({ mensagem: "Categoria não encontrada." });
    }

    const id = await produtoModel.criar({
      categoriaId,
      nome: nomeNormalizado,
      descricao: descricaoNormalizada,
      preco,
      estoque,
      imagem: imagemNormalizada,
    });
    return res.status(201).json({
      mensagem: "Produto cadastrado com sucesso.",
      id,
    });
  } catch (error) {
    console.error("Erro ao cadastrar produto:", error);
    return res.status(500).json({ mensagem: "Erro ao cadastrar produto." });
  }
}

export async function registrarConsulta(req, res) {
  try {
    const termo = String(req.body.termo || "").trim();
    if (!termo) return res.status(400).json({ mensagem: "Informe um termo." });
    await pool.execute("INSERT INTO consulta (termo) VALUES (?)", [termo]);
    return res.status(201).json({ mensagem: "Consulta registrada." });
  } catch (error) {
    console.error("Erro ao registrar consulta:", error);
    return res.status(500).json({ mensagem: "Erro ao registrar consulta." });
  }
}
