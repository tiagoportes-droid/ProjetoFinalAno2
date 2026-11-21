import { api, sair } from "../index.js";

async function carregar() {
  if (!localStorage.getItem("greenenergy_token")) {
    window.location.href = "/src/formularios/login.html";
    return;
  }
  try {
    const usuario = await api("/api/auth/perfil");
    document.getElementById("perfil").innerHTML = `
            <input name="nome" value="${usuario.nome || ""}" placeholder="Nome" required>
            <input name="email" value="${usuario.email || ""}" disabled>
            <input name="telefone" value="${usuario.telefone || ""}" placeholder="Telefone">
            <input name="cpf" value="${usuario.cpf || ""}" placeholder="CPF">
            <input name="endereco" value="${usuario.endereco || ""}" placeholder="Endereço">
            <input name="numero" value="${usuario.numero || ""}" placeholder="Número">
            <input name="bairro" value="${usuario.bairro || ""}" placeholder="Bairro">
            <input name="cidade" value="${usuario.cidade || ""}" placeholder="Cidade">
            <input name="estado" value="${usuario.estado || ""}" maxlength="2" placeholder="UF">
            <input name="cep" value="${usuario.cep || ""}" placeholder="CEP">
            <div id="mensagem"></div>
            <button class="botao">Salvar alterações</button>
        `;
  } catch (error) {
    document.getElementById("perfil").innerHTML =
      `<div class="aviso aviso-erro">${error.message}</div>`;
  }
}

document.getElementById("perfil").addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const dados = Object.fromEntries(new FormData(evento.currentTarget));
  try {
    await api("/api/auth/perfil", {
      method: "PUT",
      body: JSON.stringify(dados),
    });
    document.getElementById("mensagem").innerHTML =
      '<div class="aviso aviso-sucesso">Perfil atualizado.</div>';
  } catch (error) {
    document.getElementById("mensagem").innerHTML =
      `<div class="aviso aviso-erro">${error.message}</div>`;
  }
});

document.getElementById("sair").addEventListener("click", sair);
carregar();
