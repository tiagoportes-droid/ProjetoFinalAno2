import * as vendaModel from "../models/vendaModel.js";

export async function finalizar(req, res) {
  try {
    const resultado = await vendaModel.finalizar(req.usuario.id, req.body);
    return res.status(201).json({
      mensagem: "Compra confirmada com sucesso.",
      ...resultado,
    });
  } catch (error) {
    console.error("Erro ao finalizar compra:", error);
    return res.status(400).json({ mensagem: error.message });
  }
}

export async function historico(req, res) {
  try {
    return res.json(await vendaModel.listar(req.usuario.id));
  } catch (error) {
    console.error("Erro ao consultar histórico:", error);
    return res.status(500).json({ mensagem: "Erro ao buscar pedidos." });
  }
}
