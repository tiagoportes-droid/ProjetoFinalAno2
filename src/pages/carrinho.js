import { api, dinheiro, atualizarContador } from "../index.js";

async function carregar() {
  if (!localStorage.getItem("greenenergy_token")) {
    window.location.href = "/src/formularios/login.html";
    return;
  }
  try {
    const carrinho = await api("/api/carrinho");
    document.getElementById("itens").innerHTML = carrinho.itens.length
      ? carrinho.itens
          .map(
            (item) => `
            <div class="linha-carrinho">
                <img src="${item.imagem}" alt="${item.nome}">
                <div><strong>${item.nome}</strong><br><small>${dinheiro(item.preco)}</small></div>
                <input class="quantidade" type="number" min="1" max="${item.estoque}" value="${item.quantidade}" data-id="${item.id}">
                <strong class="subtotal">${dinheiro(item.subtotal)}</strong>
                <button class="remover acao" data-id="${item.id}" title="Remover">✕</button>
            </div>
        `,
          )
          .join("")
      : "<p>Seu carrinho está vazio.</p>";

    document.getElementById("resumo").innerHTML = `
            <p>Subtotal: <strong>${dinheiro(carrinho.total)}</strong></p>
            <p>Total: <strong>${dinheiro(carrinho.total)}</strong></p>
            ${carrinho.itens.length ? '<a class="botao" style="display:block;text-align:center" href="/src/pages/checkout.html">Ir para checkout</a>' : ""}
            ${carrinho.itens.length ? '<button class="botao botao-secundario" id="limpar" style="margin-top:8px">Limpar carrinho</button>' : ""}
        `;

    document.querySelectorAll(".quantidade").forEach((campo) => {
      campo.addEventListener("change", async () => {
        try {
          await api(`/api/carrinho/itens/${campo.dataset.id}`, {
            method: "PUT",
            body: JSON.stringify({ quantidade: Number(campo.value) }),
          });
          carregar();
        } catch (error) {
          document.getElementById("mensagem").innerHTML =
            `<div class="aviso aviso-erro">${error.message}</div>`;
        }
      });
    });
    document.querySelectorAll(".remover").forEach((botao) => {
      botao.addEventListener("click", async () => {
        await api(`/api/carrinho/itens/${botao.dataset.id}`, {
          method: "DELETE",
        });
        carregar();
      });
    });
    const limpar = document.getElementById("limpar");
    if (limpar)
      limpar.addEventListener("click", async () => {
        await api("/api/carrinho", { method: "DELETE" });
        carregar();
      });
    atualizarContador();
  } catch (error) {
    document.getElementById("mensagem").innerHTML =
      `<div class="aviso aviso-erro">${error.message}</div>`;
  }
}

carregar();
