import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import produtoRoutes from "./routes/produtoRoutes.js";
import carrinhoRoutes from "./routes/carrinhoRoutes.js";
import vendaRoutes from "./routes/vendaRoutes.js";
import { pool } from "./config/database.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use("/src", express.static(path.join(__dirname, "..", "src")));

app.get("/api/status", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    return res.json({ status: "online", banco: "conectado" });
  } catch (error) {
    return res.status(503).json({
      status: "online",
      banco: "indisponivel",
      mensagem: "Configure o usuario e a senha do MariaDB no arquivo .env.",
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/produtos", produtoRoutes);
app.use("/api/carrinho", carrinhoRoutes);
app.use("/api", vendaRoutes);

app.get("/", (req, res) => {
  res.redirect("/src/pages/home.html");
});

app.use((req, res) => {
  res.status(404).json({ mensagem: "Rota não encontrada." });
});

async function iniciarServidor() {
  try {
    await pool.query("SELECT 1");
    console.log("Conexão com MariaDB estabelecida.");
  } catch (error) {
    console.warn("MariaDB indisponível:", error.message);
    console.warn("Execute os arquivos SQL antes de usar os recursos privados.");
  }

  const porta = Number(process.env.PORT || 3000);
  app.listen(porta, () => {
    console.log(`GreenEnergy disponível em http://localhost:${porta}`);
  });
}

iniciarServidor();
