import { api, escaparHtml } from "../index.js";

document.getElementById("login").addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const dados = Object.fromEntries(new FormData(evento.currentTarget));
  try {
    const resposta = await api("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(dados),
    });
    localStorage.setItem("greenenergy_token", resposta.token);
    localStorage.setItem(
      "greenenergy_usuario",
      JSON.stringify(resposta.usuario),
    );
    window.location.href = "/src/pages/home.html";
  } catch (error) {
    document.getElementById("mensagem").innerHTML =
      `<div class="aviso aviso-erro">${escaparHtml(error.message)}</div>`;
  }
});
