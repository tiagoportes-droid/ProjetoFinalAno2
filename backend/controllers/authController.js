import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as usuarioModel from "../models/usuarioModel.js";
import { pool } from "../config/database.js";

function criarToken(usuario) {
  return jwt.sign(
    { id: usuario.id, nome: usuario.nome, email: usuario.email },
    process.env.JWT_SECRET || "greenenergy-dev",
    { expiresIn: "8h" },
  );
}

export async function cadastrar(req, res) {
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
      return res
        .status(400)
        .json({ mensagem: "Nome, e-mail e senha são obrigatórios." });
    }
    if (senha.length < 6) {
      return res
        .status(400)
        .json({ mensagem: "A senha deve ter pelo menos 6 caracteres." });
    }

    const usuario = await usuarioModel.cadastrar(req.body);
    return res.status(201).json({
      mensagem: "Cadastro realizado com sucesso.",
      token: criarToken(usuario),
      usuario,
    });
  } catch (error) {
    console.error("Erro ao cadastrar:", error);
    if (error.code === "ER_DUP_ENTRY") // Erro de quando o e-mail ou CPF já está cadastrado
    {
      return res
        .status(409)
        .json({ mensagem: "Este e-mail ou CPF já está cadastrado." });
    }
    return res.status(500).json({ mensagem: "Erro ao realizar cadastro." });
  }
}

export async function login(req, res) {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ mensagem: "Informe e-mail e senha." });
    }

    const usuario = await usuarioModel.buscarLogin(email);
    if (!usuario || !(await bcrypt.compare(senha, usuario.senha_hash))) {
      return res.status(401).json({ mensagem: "E-mail ou senha incorretos." });
    }

    const perfil = await usuarioModel.buscarPorId(usuario.id);
    await pool.execute(
      "UPDATE login SET ultimo_login = CURRENT_TIMESTAMP WHERE cliente_id = ?",
      [usuario.id],
    );
    return res.json({
      mensagem: "Login realizado.",
      token: criarToken(usuario),
      usuario: perfil,
    });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return res.status(500).json({ mensagem: "Erro ao realizar login." });
  }
}

export async function perfil(req, res) {
  try {
    const usuario = await usuarioModel.buscarPorId(req.usuario.id);
    return res.json(usuario);
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    return res.status(500).json({ mensagem: "Erro ao buscar perfil." });
  }
}

export async function atualizarPerfil(req, res) {
  try {
    const usuario = await usuarioModel.atualizar(req.usuario.id, req.body);
    return res.json({ mensagem: "Perfil atualizado.", usuario });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    return res.status(500).json({ mensagem: "Erro ao atualizar perfil." });
  }
}
