import { api, dinheiro, escaparHtml } from "../index.js";

async function carregarResumo() {
  if (!localStorage.getItem("greenenergy_token")) {
    window.location.href = "/src/formularios/login.html";
    return;
  }
  try {
    const carrinho = await api("/api/carrinho");
    if (!carrinho.itens.length) {
      window.location.href = "/src/pages/carrinho.html";
      return;
    }
    document.getElementById("resumo").innerHTML = `
            <h2>Resumo</h2>
            ${carrinho.itens.map((item) => `<p>${escaparHtml(item.quantidade)}x ${escaparHtml(item.nome)}<br><strong>${dinheiro(item.subtotal)}</strong></p>`).join("")}
            <p>Total: <strong>${dinheiro(carrinho.total)}</strong></p>
        `;
  } catch (error) {
    document.getElementById("mensagem").innerHTML =
      `<div class="aviso aviso-erro">${escaparHtml(error.message)}</div>`;
  }
}

document
  .getElementById("checkout")
  .addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const dados = Object.fromEntries(new FormData(evento.currentTarget));
    const botao = evento.currentTarget.querySelector('button[type="submit"]');
    botao.disabled = true;
    let confirmado = false;
    try {
      const resposta = await api("/api/checkout", {
        method: "POST",
        body: JSON.stringify(dados),
      });
      confirmado = true;
      document.getElementById("mensagem").innerHTML =
        `<div class="aviso aviso-sucesso">Compra confirmada! Nota acadêmica: ${escaparHtml(resposta.numero)}</div>`;
      setTimeout(
        () => (window.location.href = "/src/pages/pedidos.html"),
        1800,
      );
    } catch (error) {
      document.getElementById("mensagem").innerHTML =
        `<div class="aviso aviso-erro">${escaparHtml(error.message)}</div>`;
    } finally {
      if (!confirmado) botao.disabled = false;
    }
  });

carregarResumo();
