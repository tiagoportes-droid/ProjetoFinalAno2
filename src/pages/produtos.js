import {
  api,
  dinheiro,
  escaparHtml,
  imagemProduto,
  atualizarContador,
} from "../index.js";

const parametros = new URLSearchParams(window.location.search);
const busca = document.getElementById("busca");
const categoria = document.getElementById("categoria");
const ordenar = document.getElementById("ordenar");
let temporizadorBusca;
let requisicaoAtual = 0;

busca.value = parametros.get("busca") || "";
categoria.value = parametros.get("categoria") || "";

async function carregarCategorias() {
  try {
    const categorias = await api("/api/produtos/categorias");
    categoria.innerHTML += categorias
      .map(
        (item) =>
          `<option value="${escaparHtml(item.nome)}">${escaparHtml(item.nome)}</option>`,
      )
      .join("");
    categoria.value = parametros.get("categoria") || "";
  } catch (error) {
    console.error(error);
  }
}

async function carregarProdutos() {
  const requisicao = ++requisicaoAtual;
  const consulta = new URLSearchParams();
  if (busca.value) consulta.set("busca", busca.value);
  if (categoria.value) consulta.set("categoria", categoria.value);
  if (ordenar.value) consulta.set("ordenar", ordenar.value);

  try {
    document.getElementById("produtos").innerHTML =
      '<div class="carregando">Carregando</div>';
    const produtos = await api(`/api/produtos?${consulta}`);
    if (requisicao !== requisicaoAtual) return;
    document.getElementById("produtos").innerHTML = produtos.length
      ? produtos
          .map(
            (produto) => `
            <article class="produto-card glass">
                <a href="/src/pages/produto.html?id=${encodeURIComponent(produto.id)}"><img src="${escaparHtml(imagemProduto(produto.imagem, produto.categoria))}" alt="${escaparHtml(produto.nome)}" loading="lazy"></a>
                <div class="produto-info">
                    <small>${escaparHtml(produto.categoria)}</small>
                    <h3><a href="/src/pages/produto.html?id=${encodeURIComponent(produto.id)}">${escaparHtml(produto.nome)}</a></h3>
                    <div class="preco">${dinheiro(produto.preco)}</div>
                    <p>Estoque: ${escaparHtml(produto.estoque)}</p>
                    <a class="botao" href="/src/pages/produto.html?id=${encodeURIComponent(produto.id)}">Ver detalhes</a>
                </div>
            </article>
        `,
          )
          .join("")
      : "<p>Nenhum produto encontrado.</p>";
  } catch (error) {
    if (requisicao === requisicaoAtual) {
      document.getElementById("produtos").innerHTML =
        `<div class="aviso aviso-erro">${escaparHtml(error.message)}</div>`;
    }
  }
}

busca.addEventListener("input", () => {
  window.clearTimeout(temporizadorBusca);
  temporizadorBusca = window.setTimeout(carregarProdutos, 250);
});
categoria.addEventListener("change", carregarProdutos);
ordenar.addEventListener("change", carregarProdutos);
carregarCategorias();
carregarProdutos();
atualizarContador();
