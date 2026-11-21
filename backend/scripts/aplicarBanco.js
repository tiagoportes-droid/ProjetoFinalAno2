import fs from "fs/promises";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const arquivo = process.argv[2];

async function aplicarArquivo() {
  if (!arquivo) {
    console.error("Informe o arquivo SQL.");
    process.exit(1);
  }

  try {
    const sql = await fs.readFile(arquivo, "utf8");
    const conexao = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      multipleStatements: true,
    });

    await conexao.query(sql);
    await conexao.end();
    console.log(`Arquivo aplicado: ${arquivo}`);
  } catch (error) {
    console.error("Erro ao aplicar SQL:", error.message);
    process.exit(1);
  }
}

aplicarArquivo();
