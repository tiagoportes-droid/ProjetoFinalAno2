import { api, dinheiro } from "../index.js";

const id = new URLSearchParams(window.location.search).get("id");

async function carregar() {
  try {
    const produto = await api(`/api/produtos/${id}`);
    document.getElementById("produto").innerHTML = `
            <section class="detalhe-produto">
                <img src="${produto.imagem}" alt="${produto.nome}">
                <div>
                    <small>${produto.categoria}</small>
                    <h1>${produto.nome}</h1>
                    <p>${produto.descricao}</p>
                    <div class="preco">${dinheiro(produto.preco)}</div>
                    <p>Estoque disponível: <strong>${produto.estoque}</strong></p>
                </div>
            </section>
        `;
  } catch (error) {
    document.getElementById("produto").innerHTML =
      `<div class="aviso aviso-erro">${error.message}</div>`;
  }
}

carregar();
