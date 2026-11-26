import { api, escaparHtml, sair } from "../index.js";

async function carregar() {
  if (!localStorage.getItem("greenenergy_token")) {
    window.location.href = "/src/formularios/login.html";
    return;
  }
  try {
    const usuario = await api("/api/auth/perfil");
    document.getElementById("perfil").innerHTML = `
            <label for="perfil-nome">Nome completo</label>
            <input id="perfil-nome" name="nome" value="${escaparHtml(usuario.nome)}" autocomplete="name" required>
            <label for="perfil-email">E-mail</label>
            <input id="perfil-email" name="email" type="email" value="${escaparHtml(usuario.email)}" autocomplete="email" disabled>
            <label for="perfil-telefone">Telefone</label>
            <input id="perfil-telefone" name="telefone" type="tel" value="${escaparHtml(usuario.telefone)}" autocomplete="tel">
            <label for="perfil-cpf">CPF</label>
            <input id="perfil-cpf" name="cpf" value="${escaparHtml(usuario.cpf)}" inputmode="numeric">
            <label for="perfil-endereco">Endereço</label>
            <input id="perfil-endereco" name="endereco" value="${escaparHtml(usuario.endereco)}" autocomplete="street-address">
            <label for="perfil-numero">Número</label>
            <input id="perfil-numero" name="numero" value="${escaparHtml(usuario.numero)}">
            <label for="perfil-bairro">Bairro</label>
            <input id="perfil-bairro" name="bairro" value="${escaparHtml(usuario.bairro)}">
            <label for="perfil-cidade">Cidade</label>
            <input id="perfil-cidade" name="cidade" value="${escaparHtml(usuario.cidade)}" autocomplete="address-level2">
            <label for="perfil-estado">Estado (UF)</label>
            <input id="perfil-estado" name="estado" value="${escaparHtml(usuario.estado)}" maxlength="2" autocomplete="address-level1">
            <label for="perfil-cep">CEP</label>
            <input id="perfil-cep" name="cep" value="${escaparHtml(usuario.cep)}" autocomplete="postal-code" inputmode="numeric">
            <div id="mensagem" role="status" aria-live="polite"></div>
            <button class="botao" id="salvar-perfil" type="submit">Salvar alterações</button>
        `;
  } catch (error) {
    document.getElementById("perfil").innerHTML =
      `<div class="aviso aviso-erro">${escaparHtml(error.message)}</div>`;
  }
}

document.getElementById("perfil").addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const dados = Object.fromEntries(new FormData(evento.currentTarget));
  const botao = document.getElementById("salvar-perfil");
  botao.disabled = true;
  try {
    await api("/api/auth/perfil", {
      method: "PUT",
      body: JSON.stringify(dados),
    });
    document.getElementById("mensagem").innerHTML =
      '<div class="aviso aviso-sucesso">Perfil atualizado.</div>';
  } catch (error) {
    document.getElementById("mensagem").innerHTML =
      `<div class="aviso aviso-erro">${escaparHtml(error.message)}</div>`;
  } finally {
    botao.disabled = false;
  }
});

document.getElementById("sair").addEventListener("click", sair);
carregar();
