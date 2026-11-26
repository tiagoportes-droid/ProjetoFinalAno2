import { api, dinheiro, atualizarContador } from "../index.js";

const parametros = new URLSearchParams(window.location.search);
const busca = document.getElementById("busca");
const categoria = document.getElementById("categoria");
const ordenar = document.getElementById("ordenar");

busca.value = parametros.get("busca") || "";
categoria.value = parametros.get("categoria") || "";

async function carregarCategorias() {
  try {
    const categorias = await api("/api/produtos/categorias");
    categoria.innerHTML += categorias
      .map((item) => `<option value="${item.nome}">${item.nome}</option>`)
      .join("");
    categoria.value = parametros.get("categoria") || "";
  } catch (error) {
    console.error(error);
  }
}

async function carregarProdutos() {
  const consulta = new URLSearchParams();
  if (busca.value) consulta.set("busca", busca.value);
  if (categoria.value) consulta.set("categoria", categoria.value);
  if (ordenar.value) consulta.set("ordenar", ordenar.value);

  try {
    document.getElementById("produtos").innerHTML =
      '<div class="carregando">Carregando</div>';
    const produtos = await api(`/api/produtos?${consulta}`);
    document.getElementById("produtos").innerHTML = produtos.length
      ? produtos
          .map(
            (produto) => `
            <article class="produto-card">
                <a href="/src/pages/produto.html?id=${produto.id}"><img src="${produto.imagem}" alt="${produto.nome}"></a>
                <div class="produto-info">
                    <small>${produto.categoria}</small>
                    <h3><a href="/src/pages/produto.html?id=${produto.id}">${produto.nome}</a></h3>
                    <div class="preco">${dinheiro(produto.preco)}</div>
                    <p>Estoque: ${produto.estoque}</p>
                    <a class="botao" style="display:block;text-align:center" href="/src/pages/produto.html?id=${produto.id}">Ver detalhes</a>
                </div>
            </article>
        `,
          )
          .join("")
      : "<p>Nenhum produto encontrado.</p>";
  } catch (error) {
    document.getElementById("produtos").innerHTML =
      `<div class="aviso aviso-erro">${error.message}</div>`;
  }
}

busca.addEventListener("input", carregarProdutos);
categoria.addEventListener("change", carregarProdutos);
ordenar.addEventListener("change", carregarProdutos);
carregarCategorias();
carregarProdutos();
atualizarContador();
