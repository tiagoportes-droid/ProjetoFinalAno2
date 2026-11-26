const URL = "http://localhost:3000";

export async function api(url, opcoes = {}) {
  const cabecalhos = {
    "Content-Type": "application/json",
    ...(opcoes.headers || {}),
  };

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
