import {
  api,
  dinheiro,
  escaparHtml,
  imagemProduto,
  atualizarContador,
} from "../index.js";

const itensContainer = document.getElementById("itens");
const mensagem = document.getElementById("mensagem");

function mostrarErro(error) {
  mensagem.innerHTML =
    `<div class="aviso aviso-erro">${escaparHtml(error.message)}</div>`;
}

async function carregar() {
  if (!localStorage.getItem("greenenergy_token")) {
    window.location.href = "/src/formularios/login.html";
    return;
  }
  try {
    const carrinho = await api("/api/carrinho");
    itensContainer.innerHTML = carrinho.itens.length
      ? carrinho.itens
          .map(
            (item) => `
            <div class="linha-carrinho glass">
                <img src="${escaparHtml(imagemProduto(item.imagem, item.categoria))}" alt="${escaparHtml(item.nome)}" loading="lazy">
                <div><strong>${escaparHtml(item.nome)}</strong><br><small>${dinheiro(item.preco)}</small></div>
                <input class="quantidade" type="number" min="1" max="${escaparHtml(item.estoque)}" value="${escaparHtml(item.quantidade)}" data-id="${escaparHtml(item.id)}" aria-label="Quantidade de ${escaparHtml(item.nome)}">
                <strong class="subtotal">${dinheiro(item.subtotal)}</strong>
                <button class="remover acao" type="button" data-id="${escaparHtml(item.id)}" aria-label="Remover ${escaparHtml(item.nome)} do carrinho"><i class="fi fi-rr-trash" aria-hidden="true"></i></button>
            </div>
        `,
          )
          .join("")
      : '<div class="estado-carrinho-vazio"><i class="fi fi-rr-shopping-cart" aria-hidden="true"></i><h2>Seu carrinho está vazio</h2><p>Explore o catálogo e adicione os equipamentos que mais combinam com seu projeto.</p><a class="botao" href="/src/pages/produtos.html">Explorar produtos</a></div>';

    document.getElementById("resumo").innerHTML = carrinho.itens.length ? `
            <h2>Resumo do pedido</h2>
            <p>Subtotal: <strong>${dinheiro(carrinho.total)}</strong></p>
            <p>Total: <strong>${dinheiro(carrinho.total)}</strong></p>
            <a class="botao" href="/src/pages/checkout.html">Ir para checkout</a>
            <button class="botao botao-secundario" id="limpar" type="button">Limpar carrinho</button>
        ` : "";

    document.querySelectorAll(".quantidade").forEach((campo) => {
      campo.addEventListener("change", async () => {
        try {
          campo.disabled = true;
          await api(`/api/carrinho/itens/${campo.dataset.id}`, {
            method: "PUT",
            body: JSON.stringify({ quantidade: Number(campo.value) }),
          });
          await carregar();
        } catch (error) {
          campo.disabled = false;
          mostrarErro(error);
        }
      });
    });
    document.querySelectorAll(".remover").forEach((botao) => {
      botao.addEventListener("click", async () => {
        try {
          botao.disabled = true;
          await api(`/api/carrinho/itens/${botao.dataset.id}`, {
            method: "DELETE",
          });
          await carregar();
        } catch (error) {
          botao.disabled = false;
          mostrarErro(error);
        }
      });
    });
    const limpar = document.getElementById("limpar");
    if (limpar)
      limpar.addEventListener("click", async () => {
        try {
          limpar.disabled = true;
          await api("/api/carrinho", { method: "DELETE" });
          await carregar();
        } catch (error) {
          limpar.disabled = false;
          mostrarErro(error);
        }
      });
    atualizarContador();
  } catch (error) {
    itensContainer.innerHTML = "";
    document.getElementById("resumo").innerHTML = "";
    mostrarErro(error);
  }
}

carregar();
