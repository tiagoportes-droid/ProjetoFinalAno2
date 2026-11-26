import { api, dinheiro, escaparHtml } from "../index.js";

async function carregar() {
  if (!localStorage.getItem("greenenergy_token")) {
    window.location.href = "/src/formularios/login.html";
    return;
  }
  try {
    const pedidos = await api("/api/pedidos");
    document.getElementById("pedidos").innerHTML = pedidos.length
      ? pedidos
          .map(
            (pedido) => `
            <article class="pedido">
                <h3>Pedido #${escaparHtml(pedido.id)} | Nota ${escaparHtml(pedido.nota_numero)}</h3>
                <p>Status: ${escaparHtml(pedido.status)} | Total: <strong>${dinheiro(pedido.valor_total)}</strong></p>
                <ul>${pedido.itens.map((item) => `<li>${escaparHtml(item.quantidade)}x ${escaparHtml(item.produto)}, ${dinheiro(item.subtotal)}</li>`).join("")}</ul>
                <small>${new Date(pedido.data_venda).toLocaleString("pt-BR")}</small>
            </article>
        `,
          )
          .join("")
      : "<p>Você ainda não realizou compras.</p>";
  } catch (error) {
    document.getElementById("pedidos").innerHTML =
      `<div class="aviso aviso-erro">${escaparHtml(error.message)}</div>`;
  }
}

carregar();
