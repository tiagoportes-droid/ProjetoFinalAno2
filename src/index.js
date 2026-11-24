const URL = "http://localhost:3000";

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

export function usuarioAtual() {
  try {
    return JSON.parse(localStorage.getItem("greenenergy_usuario"));
  } catch (error) {
    return null;
  }
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
  } catch (error) {
    contador.textContent = "0";
  }
}
