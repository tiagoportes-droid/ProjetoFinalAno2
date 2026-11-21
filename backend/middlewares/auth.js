import jwt from "jsonwebtoken";

export function exigirLogin(req, res, next) {
  try {
    const cabecalho = req.headers.authorization;

    if (!cabecalho || !cabecalho.startsWith("Bearer ")) {
      return res.status(401).json({ mensagem: "Faça login para continuar." });
    }

    const token = cabecalho.split(" ")[1];
    const dados = jwt.verify(
      token,
      process.env.JWT_SECRET || "greenenergy-dev",
    );
    req.usuario = dados;
    next();
  } catch (error) {
    return res.status(401).json({ mensagem: "Sessão inválida ou expirada." });
  }
}
