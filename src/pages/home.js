import { api, dinheiro, atualizarContador } from "../index.js";

async function carregarCategorias() {
  try {
    const categorias = await api("/api/produtos/categorias");
    document.getElementById("categorias").innerHTML = categorias
      .map(
        (categoria) =>
          `<a class="categoria" href="/src/pages/produtos.html?categoria=${encodeURIComponent(categoria.nome)}">
                ☀<br><strong>${categoria.nome}</strong>
             </a>`,
      )
      .join("");
  } catch (error) {
    document.getElementById("categorias").innerHTML =
      '<div class="aviso aviso-erro">Não foi possível carregar categorias.</div>';
  }
}

async function carregarProdutos() {
  try {
    const produtos = await api("/api/produtos");
    document.getElementById("carrossel").innerHTML = produtos
      .map(
        (produto) => `
            <article class="produto-card">
                <a href="/src/pages/produto.html?id=${produto.id}">
                    <img src="${produto.imagem}" alt="${produto.nome}">
                </a>
                <div class="produto-info">
                    <small>${produto.categoria}</small>
                    <h3><a href="/src/pages/produto.html?id=${produto.id}">${produto.nome}</a></h3>
                    <div class="preco">${dinheiro(produto.preco)}</div>
                </div>
            </article>
        `,
      )
      .join("");
  } catch (error) {
    document.getElementById("carrossel").innerHTML =
      '<div class="aviso aviso-erro">Não foi possível carregar os produtos.</div>';
  }
}

function iniciarParallax() {
  const banner = document.querySelector(".banner");
  if (!banner) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let ticking = false;

  function atualizar() {
    const rect = banner.getBoundingClientRect();

    if (rect.bottom > 0 && rect.top < window.innerHeight) {
      const scrollY = window.scrollY;
      banner.style.setProperty("--parallax-texto", `${scrollY * 0.1}px`);
      banner.style.setProperty("--parallax-sol", `${scrollY * 0.1}px`);
    }

    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(atualizar);
        ticking = true;
      }
    },
    { passive: true },
  );
}

document.getElementById("proximo").addEventListener("click", () => {
  document
    .getElementById("carrossel")
    .scrollBy({ left: 280, behavior: "smooth" });
});
document.getElementById("anterior").addEventListener("click", () => {
  document
    .getElementById("carrossel")
    .scrollBy({ left: -280, behavior: "smooth" });
});
document.getElementById("busca").addEventListener("submit", (evento) => {
  evento.preventDefault();
  const termo = new FormData(evento.currentTarget).get("busca");
  window.location.href = `/src/pages/produtos.html?busca=${encodeURIComponent(termo || "")}`;
});

carregarCategorias();
carregarProdutos();
atualizarContador();
iniciarParallax();
