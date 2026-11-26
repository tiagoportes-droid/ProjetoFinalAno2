const URL = "http://localhost:3000";
const entidadesHtml = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};
const imagensPorCategoria = {
  "Acessórios": "/src/assets/acessorio.png",
  Baterias: "/src/assets/bateria.png",
  "Controladores de carga": "/src/assets/controlador.png",
  Inversores: "/src/assets/inversor.png",
  "Kits solares": "/src/assets/kit-solar.png",
  "Painéis fotovoltaicos": "/src/assets/painel.png",
};

export function escaparHtml(valor) {
  return String(valor ?? "").replace(/[&<>"']/g, (caractere) =>
    entidadesHtml[caractere],
  );
}

export function imagemProduto(imagem, categoria) {
  if (typeof imagem === "string" && imagem.trim()) return imagem.trim();
  return imagensPorCategoria[categoria] || "/src/assets/acessorio.png";
}

export async function api(url, opcoes = {}) {
  const token = localStorage.getItem("greenenergy_token");
  const cabecalhos = {
    "Content-Type": "application/json",
    ...(opcoes.headers || {}),
  };
  if (token) cabecalhos.Authorization = `Bearer ${token}`;

  const urlCompleta = url.startsWith("http") ? url : `${URL}${url}`;
  const resposta = await fetch(urlCompleta, { ...opcoes, headers: cabecalhos });
  const dados = await resposta.json().catch(() => ({}));
  if (!resposta.ok) throw new Error(dados.mensagem || "Erro na requisição.");
  return dados;
}

export function dinheiro(valor) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function sair() {
  localStorage.removeItem("greenenergy_token");
  localStorage.removeItem("greenenergy_usuario");
  window.location.href = "/src/formularios/login.html";
}

export async function atualizarContador() {
  const contador = document.querySelector(".contador");
  if (!contador) return;
  if (!localStorage.getItem("greenenergy_token")) {
    contador.textContent = "0";
    return;
  }
  try {
    const carrinho = await api("/api/carrinho");
    const quantidade = carrinho.itens.reduce(
      (total, item) => total + item.quantidade,
      0,
    );
    contador.textContent = String(quantidade);
    contador.removeAttribute("aria-label");
    contador.removeAttribute("title");
  } catch (error) {
    console.error("Não foi possível atualizar o carrinho.", error);
    contador.textContent = "!";
    contador.setAttribute("aria-label", "Não foi possível carregar o carrinho");
    contador.title = "Carrinho indisponível";
  }
}
