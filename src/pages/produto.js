import {
  api,
  dinheiro,
  escaparHtml,
  imagemProduto,
  atualizarContador,
} from "../index.js";

const id = new URLSearchParams(window.location.search).get("id");
const container = document.getElementById("produto");

async function carregar() {
  if (!id) {
    container.innerHTML =
      '<div class="aviso aviso-erro">Produto não identificado. Volte ao catálogo e escolha um produto.</div>';
    return;
  }

  try {
    const produto = await api(`/api/produtos/${encodeURIComponent(id)}`);
    const estoque = Number(produto.estoque);
    container.innerHTML = `
            <section class="detalhe-produto glass">
                <img src="${escaparHtml(imagemProduto(produto.imagem, produto.categoria))}" alt="${escaparHtml(produto.nome)}">
                <div>
                    <small class="badge">${escaparHtml(produto.categoria)}</small>
                    <h1>${escaparHtml(produto.nome)}</h1>
                    <p>${escaparHtml(produto.descricao)}</p>
                    <div class="preco">${dinheiro(produto.preco)}</div>
                    <p>Estoque disponível: <strong>${escaparHtml(estoque)}</strong></p>
                    <div id="mensagem" role="status" aria-live="polite"></div>
                    <label for="quantidade">Quantidade</label>
                    <input id="quantidade" type="number" min="1" max="${escaparHtml(estoque)}" value="1" ${estoque < 1 ? "disabled" : ""}>
                    <button class="botao" id="adicionar" type="button" ${estoque < 1 ? "disabled" : ""}>${estoque < 1 ? "Produto indisponível" : "Adicionar ao carrinho"}</button>
                </div>
            </section>
        `;
    document.getElementById("produto").classList.remove("carregando");
    document
      .getElementById("adicionar")
      .addEventListener("click", adicionarAoCarrinho);
  } catch (error) {
    container.innerHTML =
      `<div class="aviso aviso-erro">${escaparHtml(error.message)}</div>`;
  }
}

async function adicionarAoCarrinho() {
  if (!localStorage.getItem("greenenergy_token")) {
    window.location.href = "/src/formularios/login.html";
    return;
  }
  try {
    const quantidade = Number(document.getElementById("quantidade").value);
    await api("/api/carrinho/itens", {
      method: "POST",
      body: JSON.stringify({ produto_id: Number(id), quantidade }),
    });
    document.getElementById("mensagem").innerHTML =
      '<div class="aviso aviso-sucesso">Produto adicionado ao carrinho.</div>';
    atualizarContador();
  } catch (error) {
    document.getElementById("mensagem").innerHTML =
      `<div class="aviso aviso-erro">${escaparHtml(error.message)}</div>`;
  }
}

carregar();
atualizarContador();
