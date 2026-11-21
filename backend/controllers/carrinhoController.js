import * as carrinhoModel from "../models/carrinhoModel.js";

export async function obter(req, res) {
  try {
    return res.json(await carrinhoModel.buscarCarrinho(req.usuario.id));
  } catch (error) {
    console.error("Erro ao obter carrinho:", error);
    return res.status(500).json({ mensagem: "Erro ao consultar carrinho." });
  }
}

export async function adicionar(req, res) {
  try {
    const quantidade = Number(req.body.quantidade || 1);
    if (quantidade < 1)
      return res.status(400).json({ mensagem: "Quantidade inválida." });
    const carrinho = await carrinhoModel.adicionar(
      req.usuario.id,
      req.body.produto_id,
      quantidade,
    );
    return res.status(201).json(carrinho);
  } catch (error) {
    console.error("Erro ao adicionar ao carrinho:", error);
    return res.status(400).json({ mensagem: error.message });
  }
}

export async function alterar(req, res) {
  try {
    const quantidade = Number(req.body.quantidade);
    if (quantidade < 1)
      return res.status(400).json({ mensagem: "Quantidade inválida." });
    return res.json(
      await carrinhoModel.alterar(req.usuario.id, req.params.id, quantidade),
    );
  } catch (error) {
    console.error("Erro ao alterar carrinho:", error);
    return res.status(400).json({ mensagem: error.message });
  }
}

export async function remover(req, res) {
  try {
    return res.json(await carrinhoModel.remover(req.usuario.id, req.params.id));
  } catch (error) {
    console.error("Erro ao remover item:", error);
    return res.status(500).json({ mensagem: "Erro ao remover item." });
  }
}

export async function limpar(req, res) {
  try {
    return res.json(await carrinhoModel.limpar(req.usuario.id));
  } catch (error) {
    console.error("Erro ao limpar carrinho:", error);
    return res.status(500).json({ mensagem: "Erro ao limpar carrinho." });
  }
}
