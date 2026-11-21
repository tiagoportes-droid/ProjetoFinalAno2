import { api } from "../index.js";

document
  .getElementById("cadastro")
  .addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const dados = Object.fromEntries(new FormData(evento.currentTarget));

    try {
      const resposta = await api("/api/auth/cadastro", {
        method: "POST",
        body: JSON.stringify(dados),
      });
      localStorage.setItem("greenenergy_token", resposta.token);
      localStorage.setItem(
        "greenenergy_usuario",
        JSON.stringify(resposta.usuario),
      );
      window.location.href = "/src/pages/perfil.html";
    } catch (error) {
      document.getElementById("mensagem").innerHTML =
        `<div class="aviso aviso-erro">${error.message}</div>`;
    }
  });
