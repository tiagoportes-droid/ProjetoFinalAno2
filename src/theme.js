const chaveTema = "greenenergy-theme";
const preferenciasSistema = window.matchMedia("(prefers-color-scheme: dark)");
let escolhaManual = false;
let temaAtual;
let botaoTema;
let iconeTema;

try {
  const temaSalvo = localStorage.getItem(chaveTema);
  if (temaSalvo === "light" || temaSalvo === "dark") {
    temaAtual = temaSalvo;
    escolhaManual = true;
  }
} catch (error) {
  console.warn("Não foi possível ler a preferência de tema salva.", error);
}

if (!temaAtual) temaAtual = preferenciasSistema.matches ? "dark" : "light";
document.documentElement.dataset.theme = temaAtual;

function atualizarControle(botao, icone) {
  const temaEscuroAtivo = document.documentElement.dataset.theme === "dark";
  botao.setAttribute("aria-label", `Ativar tema ${temaEscuroAtivo ? "claro" : "escuro"}`);
  botao.setAttribute("aria-pressed", String(temaEscuroAtivo));
  botao.title = `Ativar tema ${temaEscuroAtivo ? "claro" : "escuro"}`;
  icone.className = `fi fi-rr-${temaEscuroAtivo ? "sun" : "moon"}`;
}

function montarControleTema() {
  const cabecalho = document.querySelector(".topo");
  let acoes = cabecalho ? cabecalho.querySelector(".acoes") : null;

  if (cabecalho && !acoes) {
    acoes = document.createElement("div");
    acoes.className = "acoes";
    cabecalho.append(acoes);
  }

  botaoTema = document.createElement("button");
  botaoTema.className = "acao botao-tema";
  botaoTema.type = "button";
  botaoTema.setAttribute("aria-pressed", "false");

  iconeTema = document.createElement("i");
  iconeTema.setAttribute("aria-hidden", "true");
  botaoTema.append(iconeTema);
  atualizarControle(botaoTema, iconeTema);

  if (acoes) {
    acoes.append(botaoTema);
  } else {
    botaoTema.classList.add("botao-tema-flutuante");
    document.body.append(botaoTema);
  }

  botaoTema.addEventListener("click", () => {
    escolhaManual = true;
    document.documentElement.dataset.theme =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    temaAtual = document.documentElement.dataset.theme;

    try {
      localStorage.setItem(chaveTema, temaAtual);
    } catch (error) {
      console.warn("Não foi possível salvar a preferência de tema.", error);
    }

    atualizarControle(botaoTema, iconeTema);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", montarControleTema, { once: true });
} else {
  montarControleTema();
}

function acompanharPreferenciaSistema(evento) {
  if (escolhaManual) return;
  document.documentElement.dataset.theme = evento.matches ? "dark" : "light";
  temaAtual = document.documentElement.dataset.theme;
  if (botaoTema && iconeTema) atualizarControle(botaoTema, iconeTema);
}

if (preferenciasSistema.addEventListener) {
  preferenciasSistema.addEventListener("change", acompanharPreferenciaSistema);
} else {
  preferenciasSistema.addListener(acompanharPreferenciaSistema);
}

const movimentoReducido = window.matchMedia("(prefers-reduced-motion: reduce)");
let elementoLiquidoAtivo = null;
let quadroLiquido = null;

function atualizarDestaque(evento) {
  if (movimentoReducido.matches) return;

  const alvo = evento.target.closest(
    ".glass, dialog, [role='dialog'], .topo, .categoria, .produto-card, .beneficio, .institucional, .painel, .resumo, .pedido, .linha-carrinho",
  );

  if (!alvo) {
    if (elementoLiquidoAtivo) {
      elementoLiquidoAtivo.style.removeProperty("--liquid-x");
      elementoLiquidoAtivo.style.removeProperty("--liquid-y");
      elementoLiquidoAtivo = null;
    }
    return;
  }

  elementoLiquidoAtivo = alvo;

  if (quadroLiquido) cancelAnimationFrame(quadroLiquido);
  quadroLiquido = requestAnimationFrame(() => {
    const limites = alvo.getBoundingClientRect();
    const x = Math.max(0, Math.min(limites.width, evento.clientX - limites.left));
    const y = Math.max(0, Math.min(limites.height, evento.clientY - limites.top));
    alvo.style.setProperty("--liquid-x", `${((x / limites.width) * 100).toFixed(1)}%`);
    alvo.style.setProperty("--liquid-y", `${((y / limites.height) * 100).toFixed(1)}%`);
  });
}

document.addEventListener("pointermove", atualizarDestaque, { passive: true });

document.addEventListener("pointerleave", () => {
  if (!elementoLiquidoAtivo) return;
  elementoLiquidoAtivo.style.removeProperty("--liquid-x");
  elementoLiquidoAtivo.style.removeProperty("--liquid-y");
  elementoLiquidoAtivo = null;
});
