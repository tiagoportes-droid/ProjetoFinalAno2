import { api, escaparHtml } from "../index.js";

const formulario = document.getElementById("cadastro-produto");
const seletorCategoria = document.getElementById("categoria_id");
const mensagem = document.getElementById("mensagem");
const botao = document.getElementById("enviar");

async function carregarCategorias() {
  try {
    const categorias = await api("/api/produtos/categorias");
    seletorCategoria.innerHTML =
      '<option value="">Selecione uma categoria</option>' +
      categorias
        .map(
          (categoria) =>
            `<option value="${escaparHtml(categoria.id)}">${escaparHtml(categoria.nome)}</option>`,
        )
        .join("");
  } catch (error) {
    seletorCategoria.innerHTML =
      '<option value="">Não foi possível carregar as categorias</option>';
    mensagem.innerHTML =
      `<div class="aviso aviso-erro">${escaparHtml(error.message)}</div>`;
  }
}

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  mensagem.innerHTML = "";
  botao.disabled = true;

  const dados = Object.fromEntries(new FormData(formulario));
  dados.categoria_id = Number(dados.categoria_id);
  dados.preco = Number(dados.preco);
  dados.estoque = Number(dados.estoque);

  try {
    await api("/api/produtos", {
      method: "POST",
      body: JSON.stringify(dados),
    });
    mensagem.innerHTML =
      '<div class="aviso aviso-sucesso">Produto cadastrado. Redirecionando ao catálogo...</div>';
    window.setTimeout(() => {
      window.location.href = "/src/pages/produtos.html";
    }, 1000);
  } catch (error) {
    mensagem.innerHTML =
      `<div class="aviso aviso-erro">${escaparHtml(error.message)}</div>`;
    botao.disabled = false;
  }
});

carregarCategorias();
