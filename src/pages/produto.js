import { api, dinheiro, atualizarContador } from "../index.js";

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
                    <div id="mensagem"></div>
                    <label for="quantidade">Quantidade</label>
                    <input id="quantidade" type="number" min="1" max="${produto.estoque}" value="1" style="width:80px;padding:8px;margin:8px">
                    <button class="botao" id="adicionar" style="max-width:280px">Adicionar ao carrinho</button>
                </div>
            </section>
        `;
    document
      .getElementById("adicionar")
      .addEventListener("click", adicionarAoCarrinho);
  } catch (error) {
    document.getElementById("produto").innerHTML =
      `<div class="aviso aviso-erro">${error.message}</div>`;
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
      `<div class="aviso aviso-erro">${error.message}</div>`;
  }
}

carregar();
atualizarContador();
