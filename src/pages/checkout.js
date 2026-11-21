import { api, dinheiro } from "../index.js";

async function carregarResumo() {
  if (!localStorage.getItem("greenenergy_token")) {
    window.location.href = "/src/formularios/login.html";
    return;
  }
  try {
    const carrinho = await api("/api/carrinho");
    if (!carrinho.itens.length)
      window.location.href = "/src/pages/carrinho.html";
    document.getElementById("resumo").innerHTML = `
            <h2>Resumo</h2>
            ${carrinho.itens.map((item) => `<p>${item.quantidade}x ${item.nome}<br><strong>${dinheiro(item.subtotal)}</strong></p>`).join("")}
            <p>Total: <strong>${dinheiro(carrinho.total)}</strong></p>
        `;
  } catch (error) {
    document.getElementById("mensagem").innerHTML =
      `<div class="aviso aviso-erro">${error.message}</div>`;
  }
}

document
  .getElementById("checkout")
  .addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const dados = Object.fromEntries(new FormData(evento.currentTarget));
    try {
      const resposta = await api("/api/checkout", {
        method: "POST",
        body: JSON.stringify(dados),
      });
      document.getElementById("mensagem").innerHTML =
        `<div class="aviso aviso-sucesso">Compra confirmada! Nota acadêmica: ${resposta.numero}</div>`;
      setTimeout(
        () => (window.location.href = "/src/pages/pedidos.html"),
        1800,
      );
    } catch (error) {
      document.getElementById("mensagem").innerHTML =
        `<div class="aviso aviso-erro">${error.message}</div>`;
    }
  });

carregarResumo();
